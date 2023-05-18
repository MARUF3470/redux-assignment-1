const express = require('express')
var cors = require('cors')
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const app = express()
const port = process.env.PORT || 5000;
app.use(cors())
app.use(express.json())
require('dotenv').config()


const uri = `mongodb+srv://${process.env.USER}:${process.env.PASSWORD}@cluster0.z1xe9fw.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });
async function run() {
    const productCollection = client.db('redux').collection('products')
    try {
        app.post('/products', async (req, res) => {
            const products = req.body;
            const result = await productCollection.insertOne(products)
            res.send(result)
        })
        app.get('/products', async (req, res) => {
            const query = {}
            const result = await productCollection.find(query).toArray()
            res.send(result)
        })
        app.get('/products/:id', async (req, res) => {
            const id = req.params.id
            const query = { _id: new ObjectId(id) }
            const result = await productCollection.findOne(query)
            res.send(result)
        })
        app.delete('/products/:id', async (req, res) => {
            const id = req.params.id
            const query = { _id: new ObjectId(id) }
            const result = await productCollection.deleteOne(query)
            res.send(result)
        })
        app.patch('/products/:id', async (req, res) => {
            const id = req.params.id
            const product = req.body
            const query = { _id: new ObjectId(id) }
            const options = { upsert: true };
            const updateDoc = {
                $set: product
            };
            const result = await productCollection.updateOne(query, updateDoc, options)
            res.send(result)
        })
    }
    finally {

    }
}
run().catch(err => console.log(err))

app.get('/', (req, res) => {
    res.send('Hello World!')
})

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})