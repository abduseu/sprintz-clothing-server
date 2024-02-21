const express = require('express');
const cors = require('cors');
require('dotenv').config();
const app = express();
const port = process.env.PORT || 5000;

app.use(cors())
app.use(express.json())


const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const uri = `mongodb+srv://${process.env.db_user}:${process.env.db_pass}@cluster0.rkpusfk.mongodb.net/?retryWrites=true&w=majority`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
    // await client.connect();
    //Users code start from here:
    const database = client.db('sprintz_DB')
    const products = database.collection('products')
    const shopping_cart = database.collection('shopping_cart')

    /* PRODUCTS START */
    //Products >> Read
    app.get('/products', async (req, res) => {
      const result = await products.find().toArray()
      res.send(result)
    })

    //Product/_id >> Read one
    app.get('/products/:id', async (req, res) => {
      const id = req.params.id

      const filter = { _id: new ObjectId(id) }
      const result = await products.findOne(filter)
      res.send(result)
    })

    //Product/_id >> Update
    app.put('/products/:id', async (req, res) => {
      const id = req.params.id
      const product = req.body

      const filter = { _id: new ObjectId(id) }
      const updateProduct = {
        $set: {
          name: product.name,
          brand: product.brand,
          type: product.type,
          price: product.price,
          description: product.description,
          rating: product.rating,
          image: product.image
        }
      }
      const result = await products.updateOne(filter, updateProduct)
      res.send(result)
    })

    //Products >> Create
    app.post('/products', async (req, res) => {
      const product = req.body

      const result = await products.insertOne(product)
      res.send(result)
    })




    /* PRODUCTS END */


    /* CART START */
    //Cart >> Create
    app.post('/cart', async (req, res) => {
      const cart = req.body

      const result = await shopping_cart.insertOne(cart)
      res.send(result)
    })

    //Cart >> Read
    app.get('/cart/:id', async (req, res) => {
      const email = req.params.id

      const filter = { userId: email }
      const result = await shopping_cart.find(filter).toArray()
      res.send(result)
    })

    //Cart/_id >> Delete
    app.delete('/cart/:id', async (req, res) => {
      const id = req.params.id

      const filter = { _id: new ObjectId(id) }
      const result = await shopping_cart.deleteOne(filter)
      res.send(result)
    })
    /* CART END */


    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);


app.get('/', (req, res) => {
  res.send('Welcome to express-server')
})

app.listen(port, () => {
  console.log(`express-server is running on ${port}`)
})