const { MongoClient } = require('mongodb');
const express = require('express');
const cors = require('cors');

const app = express()
require('dotenv').config()
const ObjectId = require('mongodb').ObjectId
app.use(cors())
app.use(express.json())

const port = process.env.PORT || 7000;

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.ew1rb.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });


const run = async() => {

    try{
        await client.connect();
        const database = client.db("travellBD");
        const cardCollection = database.collection("cards");
        const travellerCollection = database.collection("travellers");
        console.log('connected')

        app.get('/cards', async(req,res)=>{
            const cursor = cardCollection.find({})
            const result = await cursor.toArray()
            res.send(result)
        })

        app.post('/cards', async(req,res)=>{
            const newEvent = req.body
            const result = await cardCollection.insertOne(newEvent)
            res.json(result)
        })

        app.delete('/cards/:id', async(req,res)=>{
            const id = req.params.id
            const cursor = {_id : ObjectId(id)}
            const result = await cardCollection.deleteOne(cursor)
            res.json(result)
          })

        app.post('/travellers', async(req,res)=>{
            const newPlan = req.body
            const result = await travellerCollection.insertOne(newPlan)
            res.json(result)
        })

        app.get('/travellers', async(req,res)=>{
            const cursor = travellerCollection.find({})
            const result = await cursor.toArray()
            res.send(result)
        })

        app.delete('/travellers/:id', async(req,res)=>{
            const id = req.params.id
            const cursor = {_id : ObjectId(id)}
            const result = await travellerCollection.deleteOne(cursor)
            res.json(result)
          })

        app.put('/travellers/:id', async(req,res)=>{
            const id = req.params.id;
            const status = req.body.status;
            const filter = {_id :ObjectId(id)};
            const options = { upsert: true };
            const updateDoc = {
                $set: {
                  status: status
                },
              };
            const result = await travellerCollection.updateOne(filter, updateDoc, options);
            res.json(result)
        })

    }
    finally{

    }
}
run().catch(console.dir)

app.get('/',(req,res)=>{
    res.send('home page')
})

app.listen(port,()=>{
    console.log('running server on',port)
})