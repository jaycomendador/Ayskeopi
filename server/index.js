require('dotenv').config()
const express = require('express')
const cors = require('cors')
const mongoose = require('mongoose')
const crypto = require('crypto')

const app = express()
app.use(cors())
app.use(express.json())

const coffeeSchema = new mongoose.Schema({ name: { type: String, required: true }, description: String, category: String, price: { type: Number, required: true }, image: String, available: { type: Boolean, default: true } }, { timestamps: true })
const coffeeShopSchema = new mongoose.Schema({ name: String, address: String, hours: String, occupancy: Number, amenities: [String] }, { timestamps: true })
const userSchema = new mongoose.Schema({ name: { type: String, required: true, trim: true }, email: { type: String, required: true, unique: true, trim: true, lowercase: true }, passwordHash: { type: String, required: true, select: false }, coffeeProfile: { temperature: String, flavor: String, strength: String }, passportStamps: { type: Number, default: 0 }, streak: { type: Number, default: 0 }, achievements: [String] }, { timestamps: true })
const orderSchema = new mongoose.Schema({ user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }, coffee: { type: mongoose.Schema.Types.ObjectId, ref: 'Coffee' }, drink: { type: String, required: true }, customizations: { size: String, milk: String, extraShot: Boolean, syrup: String }, total: { type: Number, required: true }, status: { type: String, enum: ['received', 'preparing', 'ready', 'picked-up'], default: 'received' }, pickupMinutes: { type: Number, default: 4 } }, { timestamps: true })
const favoriteSchema = new mongoose.Schema({ user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, coffee: { type: mongoose.Schema.Types.ObjectId, ref: 'Coffee', required: true } }, { timestamps: true })
favoriteSchema.index({ user: 1, coffee: 1 }, { unique: true })
const reviewSchema = new mongoose.Schema({ user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }, coffeeShop: { type: mongoose.Schema.Types.ObjectId, ref: 'CoffeeShop' }, rating: { type: Number, min: 1, max: 5 }, comment: String }, { timestamps: true })

const Coffee = mongoose.model('Coffee', coffeeSchema)
const CoffeeShop = mongoose.model('CoffeeShop', coffeeShopSchema)
const User = mongoose.model('User', userSchema)
const Order = mongoose.model('Order', orderSchema)
const Favorite = mongoose.model('Favorite', favoriteSchema)
const Review = mongoose.model('Review', reviewSchema)
const asyncRoute = (handler) => (req, res, next) => Promise.resolve(handler(req, res, next)).catch(next)
const dbReady = (req, res, next) => mongoose.connection.readyState === 1 ? next() : res.status(503).json({ error: 'Database is unavailable. Check MongoDB Atlas Network Access.' })
const hashPassword = (password) => {
  const salt = crypto.randomBytes(16).toString('hex')
  return `${salt}:${crypto.scryptSync(password, salt, 64).toString('hex')}`
}
const verifyPassword = (password, storedHash) => {
  const [salt, hash] = storedHash.split(':')
  const derivedHash = crypto.scryptSync(password, salt, 64).toString('hex')
  return crypto.timingSafeEqual(Buffer.from(hash, 'hex'), Buffer.from(derivedHash, 'hex'))
}
const publicUser = (user) => ({ id: user._id, name: user.name, email: user.email, passportStamps: user.passportStamps, streak: user.streak, achievements: user.achievements })

app.get('/api/cafe-status', (req, res) => res.json({ occupancy: 58, crowd: 'Just right', music: 'Lo-fi & slow', volume: 'Low', wifi: 'Excellent' }))
app.get('/api/health', (req, res) => res.json({ status: 'ok', database: mongoose.connection.readyState === 1 ? 'connected' : 'unavailable' }))
app.use('/api', dbReady)
app.post('/api/auth/forgot-password', asyncRoute(async (req, res) => {
  if (!req.body.email) return res.status(400).json({ error: 'Email is required.' })
  res.json({ message: 'If an account matches that email, password reset instructions will be sent.' })
}))
app.post('/api/auth/register', asyncRoute(async (req, res) => {
  const { name, email, password } = req.body
  if (!name || !email || !password) return res.status(400).json({ error: 'Name, email, and password are required.' })
  if (password.length < 6) return res.status(400).json({ error: 'Password must be at least 6 characters.' })
  const normalizedEmail = email.trim().toLowerCase()
  if (await User.exists({ email: normalizedEmail })) return res.status(409).json({ error: 'An account with that email already exists.' })
  const user = await User.create({ name, email: normalizedEmail, passwordHash: hashPassword(password) })
  res.status(201).json({ user: publicUser(user) })
}))
app.post('/api/auth/login', asyncRoute(async (req, res) => {
  const { email, password } = req.body
  if (!email || !password) return res.status(400).json({ error: 'Email and password are required.' })
  const user = await User.findOne({ email: email.trim().toLowerCase() }).select('+passwordHash')
  if (!user || !user.passwordHash || !verifyPassword(password, user.passwordHash)) return res.status(401).json({ error: 'Incorrect email or password.' })
  res.json({ user: publicUser(user) })
}))
app.get('/api/coffees', asyncRoute(async (req, res) => res.json(await Coffee.find({ available: true }).sort('name'))))
app.post('/api/coffees', asyncRoute(async (req, res) => res.status(201).json(await Coffee.create(req.body))))
app.get('/api/coffeeshops', asyncRoute(async (req, res) => res.json(await CoffeeShop.find().sort('name'))))
app.get('/api/users/demo', asyncRoute(async (req, res) => res.json(await User.findOne({ email: 'jay@example.com' }))))
app.post('/api/users', asyncRoute(async (req, res) => res.status(201).json(await User.create(req.body))))
app.patch('/api/users/:id', asyncRoute(async (req, res) => res.json(await User.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true }))))
app.get('/api/orders', asyncRoute(async (req, res) => res.json(await Order.find().populate('coffee user').sort('-createdAt'))))
app.post('/api/orders', asyncRoute(async (req, res) => res.status(201).json(await Order.create(req.body))))
app.get('/api/favorites/:userId', asyncRoute(async (req, res) => res.json(await Favorite.find({ user: req.params.userId }).populate('coffee'))))
app.post('/api/favorites', asyncRoute(async (req, res) => res.status(201).json(await Favorite.create(req.body))))
app.get('/api/reviews', asyncRoute(async (req, res) => res.json(await Review.find().populate('user coffeeShop').sort('-createdAt'))))
app.post('/api/reviews', asyncRoute(async (req, res) => res.status(201).json(await Review.create(req.body))))
app.post('/api/seed', asyncRoute(async (req, res) => {
  if (await Coffee.countDocuments()) return res.status(409).json({ error: 'Database already contains coffee data; seed was not run.' })
  const coffees = await Coffee.insertMany([
    { name: 'Classic Latte', description: 'Smooth espresso with steamed milk.', category: 'Espresso', price: 165 },
    { name: 'Spanish Latte', description: 'Velvety espresso sweetened with condensed milk.', category: 'Espresso', price: 175 },
    { name: 'Vanilla Latte', description: 'A smooth latte with a fragrant vanilla finish.', category: 'Espresso', price: 175 },
    { name: 'Iced Caramel Latte', description: 'Creamy, sweet, and refreshing.', category: 'Iced', price: 185 },
    { name: 'Oat Milk Mocha', description: 'Chocolatey espresso with oat milk.', category: 'Espresso', price: 195 },
    { name: 'Iced Americano', description: 'Bold espresso over ice.', category: 'Iced', price: 145 },
    { name: 'Classic Cappuccino', description: 'Rich espresso topped with silky milk foam.', category: 'Espresso', price: 175 },
  ])
  const [user] = await User.create([{ name: 'Jay D.', email: 'jay@example.com', passwordHash: hashPassword('coffee123'), coffeeProfile: { temperature: 'Cold', flavor: 'Chocolatey', strength: 'Strong' }, passportStamps: 8, streak: 12, achievements: ['Early Bird', 'Latte Master', 'Explorer'] }])
  const [shop] = await CoffeeShop.create([{ name: 'Roastery', address: 'Downtown', hours: '7 AM – 8 PM', occupancy: 58, amenities: ['Wi-Fi', 'Outlets', 'Window bar'] }])
  await Favorite.create({ user: user._id, coffee: coffees[1]._id })
  await Review.create({ user: user._id, coffeeShop: shop._id, rating: 5, comment: 'Great spot for a slow morning.' })
  res.status(201).json({ message: 'Starter data added', coffees: coffees.length, user: user.name })
}))
app.use((error, req, res, next) => {
  if (error && error.code === 11000) return res.status(409).json({ error: 'That record already exists.' })
  res.status(400).json({ error: error.message || 'Request failed.' })
})

const port = process.env.PORT || 5000
const mongoUri = process.env.MONGODB_URI || process.env.MONGO_URI
app.listen(port, () => console.log(`CoffeeQuest API on http://localhost:${port}`))
if (!mongoUri) console.error('MongoDB connection failed: set MONGO_URI in .env')
else mongoose.connect(mongoUri, { dbName: process.env.MONGODB_DB || 'ayskeopi', serverSelectionTimeoutMS: 10000 })
  .then(() => console.log('MongoDB connected to ayskeopi'))
  .catch((error) => console.error('MongoDB connection failed:', error.message))
