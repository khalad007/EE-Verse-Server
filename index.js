const express = require('express');
const cors = require('cors');
require('dotenv').config();
const app = express();
const port = process.env.PORT || 5000;
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');


//Middleware

app.use(cors());
app.use(express.json());


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.pcnyajy.mongodb.net/?retryWrites=true&w=majority`;


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
        // Connect the client to the server	(optional starting in v4.7)
        // await client.connect(); as instructed

        const productCollection = client.db('brandDB').collection('products');
        const brandCollection = client.db('brandDB').collection('brand');
        const curtCollection = client.db('brandDB').collection('curt');

        //  const query = { brandName: brandName};

        // for sending data to backend
        app.post('/products', async (req, res) => {
            const newProduct = req.body;
            console.log(newProduct);
            const result = await productCollection.insertOne(newProduct);
            res.send(result);
        })

        // for test 
        app
        // for brand name
        app.get('/brand', async (req, res) => {
            const cursor = brandCollection.find();
            const result = await cursor.toArray();
            res.send(result);
        })

        // for 6 brand
        app.get('/brand/:name', async (req, res) => {
            const name = req.params.name
            const query = { brandName: name }
            const result = await brandCollection.findOne(query)
            res.send(result);
        })

        // for one brand

        app.get('/products/:name', async (req, res) => {
            const name = req.params.name;
            const query = { brandName: name }
            const cursor = productCollection.find(query)
            const result = await cursor.toArray()
            res.send(result);
        })

        // for details single item 
        app.get('/productdetails/:id', async (req, res) => {
            const id = req.params.id
            const query = { _id: new ObjectId(id) }
            const result = await productCollection.findOne(query);
            res.send(result);
        })
        // get details for single item to update 
        app.get('/update/:id', async (req, res) => {
            const id = req.params.id
            const query = { _id: new ObjectId(id) }
            const result = await productCollection.findOne(query);
            res.send(result);
        })

        app.put('/update/:id', async (req, res) => {
            const id = req.params.id
            const filter = { _id: new ObjectId(id) }
            const options = { upsert: true }
            const updateProduct = req.body
            const product = {
                $set: {
                    name: updateProduct.name,
                    brandName: updateProduct.brandName,
                    description: updateProduct.description,
                    photoURL: updateProduct.photoURL,
                    price: updateProduct.price,
                    rating: updateProduct.rating,
                    type: updateProduct.type
                }
            }
            const result = await productCollection.updateOne(filter, product, options)
            res.send(result)
        })

        // cart read 
        app.get('/curt', async (req, res) => {
            const cursor = curtCollection.find()
            const result = await cursor.toArray()
            res.send(result);
        })

        // cart post
        app.post('/curt', async (req, res) => {
            const product = req.body
            const result = await curtCollection.insertOne(product)
            console.log(product)
            res.send(result)
        })

        // my cart delete 
        app.delete('/curt/:id', async (req, res) => {
            const id = req.params.id
            const query = { _id: new ObjectId(id) }
            const result = await curtCollection.deleteOne(query);
            res.send(result);
        })

        // Send a ping to confirm a successful connection
        // await client.db("admin").command({ ping: 1 });
        // console.log("Pinged your deployment. You successfully connected to MongoDB!");
    } finally {
        // Ensures that the client will close when you finish/error
        // await client.close();
    }
}
run().catch(console.dir);


app.get('/', (req, res) => {
    res.send('Server is running ')
})

app.listen(port, () => {
    console.log(`server is running on Port : ${port} `)
})