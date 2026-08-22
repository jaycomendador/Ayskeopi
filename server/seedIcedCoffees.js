require('dotenv').config()
const mongoose = require('mongoose')

const coffeeSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  description: String,
  category: String,
  price: { type: Number, required: true },
  rewardPoints: { type: Number, min: 0 },
  image: String,
  available: { type: Boolean, default: true }
}, { timestamps: true })

const Coffee = mongoose.model('Coffee', coffeeSchema)

const icedCoffees = [
  {
    name: 'Vanilla Bean Cold Brew',
    description: 'Slow-steeped cold brew topped with a float of rich vanilla sweet cream.',
    category: 'Cold Brew',
    price: 155,
    rewardPoints: 160,
    image: '/menu/01_Vanilla_Bean_Cold_Brew.png',
    available: true
  },
  {
    name: 'Pistachio Cream Iced Coffee',
    description: 'Signature iced coffee crowned with silky pistachio-infused cream cold foam.',
    category: 'Iced Coffee',
    price: 175,
    rewardPoints: 180,
    image: '/menu/02_Pistachio_Cream_Cold_Coffee.png',
    available: true
  },
  {
    name: 'Salted Caramel Frappé',
    description: 'Blended iced espresso with salted caramel ribbons and whipped cream.',
    category: 'Frappé',
    price: 185,
    rewardPoints: 190,
    image: '/menu/03_Salted_Caramel_Frappe.png',
    available: true
  },
  {
    name: 'Brown Sugar Oat Milk Shaken Espresso',
    description: 'Blonde espresso shaken with brown sugar and cinnamon, topped with oat milk.',
    category: 'Iced Espresso',
    price: 180,
    rewardPoints: 180,
    image: '/menu/04_Brown_Sugar_Oat_Milk_Shaken_Espresso.png',
    available: true
  },
  {
    name: 'Mocha Crunch Iced Coffee',
    description: 'Rich dark chocolate mocha over ice with crushed cacao cookie crumble.',
    category: 'Iced Coffee',
    price: 175,
    rewardPoints: 180,
    image: '/menu/05_Mocha_Crunch_Iced_Coffee.png',
    available: true
  },
  {
    name: 'Toasted Coconut Cold Brew',
    description: 'Tropical cold brew infused with toasted coconut and coconut milk foam.',
    category: 'Cold Brew',
    price: 165,
    rewardPoints: 170,
    image: '/menu/06_Toasted_Coconut_Cold_Brew.png',
    available: true
  },
  {
    name: 'Lavender Honey Iced Latte',
    description: 'Floral French lavender and wild honey layered with espresso and chilled milk.',
    category: 'Iced Latte',
    price: 175,
    rewardPoints: 180,
    image: '/menu/07_Lavender_Honey_Iced_Latte.png',
    available: true
  },
  {
    name: 'Cinnamon Dolce Iced Coffee',
    description: 'Sweet cinnamon brown sugar syrup with bold espresso and creamy cold milk.',
    category: 'Iced Coffee',
    price: 165,
    rewardPoints: 170,
    image: '/menu/08_Cinnamon_Dolce_Iced_Coffee.png',
    available: true
  },
  {
    name: 'Maple Pecan Iced Latte',
    description: 'Roasted pecan notes and pure maple syrup paired with smooth chilled espresso.',
    category: 'Iced Latte',
    price: 170,
    rewardPoints: 170,
    image: '/menu/09_Maple_Pecan_Iced_Latte.png',
    available: true
  },
  {
    name: 'Cardamom Spice Cold Brew',
    description: 'Aromatic crushed cardamom and subtle warm spices brewed in cold brew.',
    category: 'Cold Brew',
    price: 160,
    rewardPoints: 160,
    image: '/menu/10_Cardamom_Spice_Cold_Brew.png',
    available: true
  }
]

async function seed() {
  const mongoUri = process.env.MONGODB_URI || process.env.MONGO_URI
  if (!mongoUri) {
    console.error('MONGO_URI is missing in .env')
    process.exit(1)
  }

  try {
    await mongoose.connect(mongoUri, { dbName: process.env.MONGODB_DB || 'ayskeopi', serverSelectionTimeoutMS: 10000 })
    console.log('MongoDB connected!')

    for (const coffee of icedCoffees) {
      await Coffee.findOneAndUpdate(
        { name: coffee.name },
        { $set: coffee },
        { upsert: true, new: true }
      )
      console.log(`Upserted: ${coffee.name}`)
    }

    const count = await Coffee.countDocuments()
    console.log(`\nSuccessfully seeded iced coffees into DB! Total coffees in database: ${count}`)
    await mongoose.disconnect()
    process.exit(0)
  } catch (err) {
    console.error('Seed error:', err)
    process.exit(1)
  }
}

seed()
