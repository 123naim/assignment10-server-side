const express = require('express')
const cors = require('cors');
require('dotenv').config();
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const app = express();
const port = process.env.PORT || 5000;


// midlewere
app.use(cors());
app.use(express.json());

// brandShop
// 91SgN5RSYqOJtPHH



const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.kfkrivy.mongodb.net/?retryWrites=true&w=majority`;

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
        await client.connect();


        const brandDataCollection = client.db("brandData").collection("data")
        const topRatedData = client.db("topRatedData").collection("topData")
        const userCollection = client.db("brandDB").collection("brand");
        const addToCartData = client.db("cartData").collection("cart");


        app.get('/data', async (req, res) => {
            const cursor = brandDataCollection.find();
            const result = await cursor.toArray();
            res.send(result)
        })
        app.get('/post', async (req, res) => {
            const cursor = userCollection.find();
            const result = await cursor.toArray();
            res.send(result)
        })
        app.get('/cart', async (req, res) => {
            const cursor = addToCartData.find();
            const result = await cursor.toArray();
            res.send(result)
        })
        app.get('/post/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: new ObjectId(id) };
            const user = await userCollection.findOne(query)
            res.send(user)
        })
        app.get('/topRateProduct', async(req, res) => {
            const cursor = topRatedData.find();
            const result = await cursor.toArray();
            res.send(result)
        })

        app.post('/post', async (req, res) => {
            const post = req.body;
            console.log('New Post', post);
            const result = await userCollection.insertOne(post);
            res.send(result);
        })
        app.post('/cart', async (req, res) => {
            const post = req.body;
            console.log('New Post', post);
            const result = await addToCartData.insertOne(post);
            res.send(result);
        })
        app.put('/post/:id', async(req, res) => {
            const id = req.params.id;
            const user = req.body;
            const query = { _id: new ObjectId(id) };
            const option = { upsert: true };
            const updatedUser = {
                $set: {
                    name: user.name,
                    image: user.image,
                    brand: user.brand,
                    type: user.type,
                    price: user.price,
                    rating: user.rating,
                    description: user.description,
                    model: user.model,
                    processor: user.processor,
                    ram: user.ram,
                    display: user.display
                }
            }
            const result = await userCollection.updateOne(query, updatedUser, option);
            res.send(result)

        })
        app.delete('/cart/:id', async (req, res) => {
            const id = req.params.id;
            console.log("Please delete from database", id);
            const query = { _id: new ObjectId(id) }
            const result = await addToCartData.deleteOne(query)
            res.send(result)

        })


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
    res.send('server is running')
})

app.listen(port, () => {
    console.log(`ser running port in ${port}`)
})