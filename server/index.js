require('dotenv').config()
const express = require('express')
const cors = require('cors')
const mongoose = require('mongoose')

const app = express()
app.use(cors())
app.use(express.json())

const customerSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  coffeeProfile: { temperature: String, flavor: String, strength: String },
  passportStamps: { type: Number, default: 0 },
  streak: { type: Number, default: 0 },
  achievements: [String],
  sustainability: { reusableCups: { type: Number, default: 0 }, co2AvoidedKg: { type: Number, default: 0 } },
}, { timestamps: true })

const orderSchema = new mongoose.Schema({
  customer: { type: mongoose.Schema.Types.ObjectId, ref: 'Customer' },
  drink: { type: String, required: true },
  customizations: { size: String, milk: String, extraShot: Boolean, syrup: String },
  total: { type: Number, required: true },
  status: { type: String, enum: ['received', 'preparing', 'ready', 'picked-up'], default: 'received' },
  pickupMinutes: { type: Number, default: 4 },
}, { timestamps: true })

const Customer = mongoose.model('Customer', customerSchema)
const Order = mongoose.model('Order', orderSchema)

app.get('/api/cafe-status', (req, res) => res.json({ occupancy: 58, crowd: 'Just right', music: 'Lo-fi & slow', volume: 'Low', wifi: 'Excellent' }))
app.post('/api/orders', async (req, res, next) => { try { res.status(201).json(await Order.create(req.body)) } catch (error) { next(error) } })
app.get('/api/orders/:id', async (req, res, next) => { try { res.json(await Order.findById(req.params.id)) } catch (error) { next(error) } })
app.post('/api/customers', async (req, res, next) => { try { res.status(201).json(await Customer.create(req.body)) } catch (error) { next(error) } })
app.patch('/api/customers/:id', async (req, res, next) => { try { res.json(await Customer.findByIdAndUpdate(req.params.id, req.body, { new: true })) } catch (error) { next(error) } })
app.use((error, req, res, next) => res.status(400).json({ error: error.message }))

const port = process.env.PORT || 5000
mongoose.connect(process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/coffeequest')
  .then(() => app.listen(port, () => console.log(`CoffeeQuest API on http://localhost:${port}`)))
  .catch((error) => { console.error('MongoDB connection failed:', error.message); process.exit(1) })
