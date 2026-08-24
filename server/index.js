require('dotenv').config()
const express = require('express')
const cors = require('cors')
const mongoose = require('mongoose')
const crypto = require('crypto')

const app = express()
app.use(cors())
app.use(express.json())

const coffeeSchema = new mongoose.Schema({ name: { type: String, required: true }, description: String, category: String, price: { type: Number, required: true }, rewardPoints: { type: Number, min: 0 }, image: String, available: { type: Boolean, default: true } }, { timestamps: true })
const coffeeShopSchema = new mongoose.Schema({ name: String, address: String, hours: String, occupancy: Number, amenities: [String] }, { timestamps: true })
const userSchema = new mongoose.Schema({ name: { type: String, required: true, trim: true }, email: { type: String, required: true, unique: true, trim: true, lowercase: true }, passwordHash: { type: String, required: true, select: false }, coffeeProfile: { temperature: String, flavor: String, strength: String }, passportStamps: { type: Number, default: 0 }, loyaltyPoints: { type: Number, default: 0 }, streak: { type: Number, default: 0 }, achievements: [String] }, { timestamps: true })
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
const pointsForCoffee = (coffee) => coffee.rewardPoints ?? Math.ceil(coffee.price / 10) * 10
const userPoints = (user) => Math.max(0, user.loyaltyPoints ?? (user.passportStamps || 0) * 10)
const publicUser = (user) => ({ id: user._id, name: user.name, email: user.email, passportStamps: user.passportStamps, loyaltyPoints: userPoints(user), streak: user.streak, achievements: user.achievements })

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
app.get('/api/coffees', asyncRoute(async (req, res) => {
  const filter = req.query.all === 'true' ? {} : { available: true }
  const coffees = await Coffee.find(filter).sort('name')
  res.json(coffees.map(coffee => ({ ...coffee.toObject(), rewardPoints: pointsForCoffee(coffee) })))
}))
app.post('/api/coffees', asyncRoute(async (req, res) => res.status(201).json(await Coffee.create(req.body))))
app.patch('/api/coffees/:id', asyncRoute(async (req, res) => res.json(await Coffee.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true }))))
app.get('/api/coffeeshops', asyncRoute(async (req, res) => res.json(await CoffeeShop.find().sort('name'))))
app.get('/api/users/demo', asyncRoute(async (req, res) => res.json(await User.findOne({ email: 'jay@example.com' }))))
app.get('/api/users/:id/coffeequest', asyncRoute(async (req, res) => {
  const user = await User.findById(req.params.id)
  if (!user) return res.status(404).json({ error: 'User not found.' })
  const points = userPoints(user)
  const coffees = await Coffee.find({ available: true }).sort('name')
  res.json({
    user: publicUser(user),
    points,
    pointsPerCoffee: 10,
    coffees: coffees.map(coffee => ({ id: coffee._id, name: coffee.name, rewardPoints: pointsForCoffee(coffee), available: points >= pointsForCoffee(coffee) })),
  })
}))
app.get('/api/users', asyncRoute(async (req, res) => res.json(await User.find().sort('name'))))
app.post('/api/users', asyncRoute(async (req, res) => res.status(201).json(await User.create(req.body))))
app.patch('/api/users/:id', asyncRoute(async (req, res) => res.json(await User.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true }))))
app.get('/api/orders', asyncRoute(async (req, res) => res.json(await Order.find().populate('coffee user').sort('-createdAt'))))
app.patch('/api/orders/:id', asyncRoute(async (req, res) => res.json(await Order.findByIdAndUpdate(req.params.id, req.body, { new: true }))))
app.post('/api/orders', asyncRoute(async (req, res) => {
  const { user: userId, ...orderDetails } = req.body
  if (!userId || !mongoose.isValidObjectId(userId)) return res.status(400).json({ error: 'A valid signed-in user is required to create an order.' })
  const user = await User.findById(userId)
  if (!user) return res.status(404).json({ error: 'User not found.' })
  const order = await Order.create({ ...orderDetails, user: user._id })
  user.passportStamps = Math.max(0, user.passportStamps || 0) + 1
  user.loyaltyPoints = userPoints(user) + 10
  await user.save()
  res.status(201).json({ order, passportStamps: user.passportStamps, loyaltyPoints: user.loyaltyPoints, pointsEarned: 10 })
}))
app.get('/api/favorites/:userId', asyncRoute(async (req, res) => res.json(await Favorite.find({ user: req.params.userId }).populate('coffee'))))
app.post('/api/favorites', asyncRoute(async (req, res) => res.status(201).json(await Favorite.create(req.body))))
app.get('/api/reviews', asyncRoute(async (req, res) => res.json(await Review.find().populate('user coffeeShop').sort('-createdAt'))))
app.post('/api/reviews', asyncRoute(async (req, res) => res.status(201).json(await Review.create(req.body))))
app.post('/api/seed', asyncRoute(async (req, res) => {
  if (await Coffee.countDocuments()) return res.status(409).json({ error: 'Database already contains coffee data; seed was not run.' })
  const coffees = await Coffee.insertMany([
    { name: 'Vanilla Bean Cold Brew', description: 'Slow-steeped cold brew topped with a float of rich vanilla sweet cream.', category: 'Cold Brew', price: 155, rewardPoints: 160, image: '/menu/01_Vanilla_Bean_Cold_Brew.png' },
    { name: 'Pistachio Cream Iced Coffee', description: 'Signature iced coffee crowned with silky pistachio-infused cream cold foam.', category: 'Iced Coffee', price: 175, rewardPoints: 180, image: '/menu/02_Pistachio_Cream_Cold_Coffee.png' },
    { name: 'Salted Caramel Frappé', description: 'Blended iced espresso with salted caramel ribbons and whipped cream.', category: 'Frappé', price: 185, rewardPoints: 190, image: '/menu/03_Salted_Caramel_Frappe.png' },
    { name: 'Brown Sugar Oat Milk Shaken Espresso', description: 'Blonde espresso shaken with brown sugar and cinnamon, topped with oat milk.', category: 'Iced Espresso', price: 180, rewardPoints: 180, image: '/menu/04_Brown_Sugar_Oat_Milk_Shaken_Espresso.png' },
    { name: 'Mocha Crunch Iced Coffee', description: 'Rich dark chocolate mocha over ice with crushed cacao cookie crumble.', category: 'Iced Coffee', price: 175, rewardPoints: 180, image: '/menu/05_Mocha_Crunch_Iced_Coffee.png' },
    { name: 'Toasted Coconut Cold Brew', description: 'Tropical cold brew infused with toasted coconut and coconut milk foam.', category: 'Cold Brew', price: 165, rewardPoints: 170, image: '/menu/06_Toasted_Coconut_Cold_Brew.png' },
    { name: 'Lavender Honey Iced Latte', description: 'Floral French lavender and wild honey layered with espresso and chilled milk.', category: 'Iced Latte', price: 175, rewardPoints: 180, image: '/menu/07_Lavender_Honey_Iced_Latte.png' },
    { name: 'Cinnamon Dolce Iced Coffee', description: 'Sweet cinnamon brown sugar syrup with bold espresso and creamy cold milk.', category: 'Iced Coffee', price: 165, rewardPoints: 170, image: '/menu/08_Cinnamon_Dolce_Iced_Coffee.png' },
    { name: 'Maple Pecan Iced Latte', description: 'Roasted pecan notes and pure maple syrup paired with smooth chilled espresso.', category: 'Iced Latte', price: 170, rewardPoints: 170, image: '/menu/09_Maple_Pecan_Iced_Latte.png' },
    { name: 'Cardamom Spice Cold Brew', description: 'Aromatic crushed cardamom and subtle warm spices brewed in cold brew.', category: 'Cold Brew', price: 160, rewardPoints: 160, image: '/menu/10_Cardamom_Spice_Cold_Brew.png' },
    { name: 'Classic Latte', description: 'Smooth espresso with steamed milk.', category: 'Espresso', price: 165, rewardPoints: 170 },
    { name: 'Spanish Latte', description: 'Velvety espresso sweetened with condensed milk.', category: 'Espresso', price: 175, rewardPoints: 180 },
  ])
  const [user] = await User.create([{ name: 'Jay D.', email: 'jay@example.com', passwordHash: hashPassword('coffee123'), coffeeProfile: { temperature: 'Cold', flavor: 'Chocolatey', strength: 'Strong' }, passportStamps: 8, loyaltyPoints: 80, streak: 12, achievements: ['Early Bird', 'Latte Master', 'Explorer'] }])
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
