const express = require('express')
const cors = require('cors');
const bodyParser = require('body-parser');
require('dotenv').config()
const MongoClient = require('mongodb').MongoClient;
const ObjectId = require('mongodb').ObjectId

const app = express()
const port = process.env.PORT || 5000

app.use(cors());
app.use(bodyParser.json())

app.get('/', (req, res) => {
  res.send('Hello World!')
})



const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.clvrh.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;
console.log(uri)
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
client.connect(err => {
  const eventsCollection = client.db("eventManagement").collection("events");
  const reviewCollection = client.db("eventManagement").collection("reviews");
  const ordersCollection = client.db("eventManagement").collection("orders");
  const adminCollection = client.db("eventManagement").collection("admin");
  console.log('connected')

  app.post('/addEvent', (req, res) => {
    const newEvent = req.body;
    eventsCollection.insertOne(newEvent)
      .then(result => {
        console.log(result.insertedCount)
        res.redirect('/')
      })
  })

  app.get('/events', (req, res) => {
    eventsCollection.find()
      .toArray((err, events) => {
        res.send(events)
      })
  })

  app.get('/event/:id', (req, res) => {
    eventsCollection.find({ _id: ObjectId(req.params.id) })
      .toArray((err, documents) => {
        res.send(documents[0])
      })
  })

  app.post('/addReview', (req, res) => {
    const newReview = req.body;
    reviewCollection.insertOne(newReview)
      .then(result => {
        console.log(result.insertedCount)
        res.redirect('/')
      })
  })

  app.get('/reviews', (req, res) => {
    reviewCollection.find()
      .toArray((err, reviews) => {
        res.send(reviews)
      })
  })


  app.post('/addOrder', (req, res) => {
    const newOrder = req.body;
    ordersCollection.insertOne(newOrder)
      .then(result => {
        console.log(result.insertedCount)
      })
  })

  app.get('/orders', (req, res) => {
    ordersCollection.find({ email: req.query.email })
      .toArray((err, reviews) => {
        res.send(reviews)
      })
  })

  app.post('/addAdmin', (req, res) => {
    const newAdmin = req.body;
    adminCollection.insertOne(newAdmin)
      .then(result => {
        console.log(result.insertedCount)
      })
  })

  app.post('/isAdmin', (req, res) => {
    const email = req.body.email;
    adminCollection.find({ email: email })
      .toArray((err, admin) => {
        res.send(admin.length > 0)
      })
  })




});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})