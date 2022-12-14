const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion } = require('mongodb');
const app = express();
require('dotenv');
const port = process.env.PORT || 5000;
require('dotenv').config();

//* middleware
app.use(express.json());
app.use(cors());

//* routes
app.get('/', (req, res) => {
    res.send('Ema-John Server');
});


//! mongodb
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.4lqljgn.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });
async function run() {
    try {
        const productsCollection = client.db('emaJohn').collection('products');
        app.get('/products', async(req,res) => {
            const page = parseInt(req.query.page);
            const size = parseInt(req.query.size);
            const query = {};
            const cursor = productsCollection.find(query);
            const products = await cursor.skip(page*size).limit(size).toArray();
            const count = await productsCollection.estimatedDocumentCount();
            res.send({count, products});
        })
    }
    finally {

    }
}
run().catch(err => console.error(err));

app.listen(port, () => {
    console.log(`Server listening on port ${port}`);
})