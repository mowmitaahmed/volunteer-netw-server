const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const MongoClient = require('mongodb').MongoClient;
const ObjectId = require('mongodb').ObjectID;
const multer = require('multer');

const uri = "mongodb+srv://volunteer-network:volunteer123@cluster0.pweys.mongodb.net/volunteerdb?retryWrites=true&w=majority";
const client = new MongoClient(uri, { useNewUrlParser: true ,useUnifiedTopology: true});

const port = 5000;

const app = express();
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));

app.get('/', (req, res) => {
  res.send('Hello World!');
});


client.connect(err => {
  const eventCollection = client.db('volunteerdb').collection('events');
  const eventListCollection = client.db('volunteerdb').collection('eventList');
  console.log('Database is connected');

  app.post('/volunteerRegistration', (req, res)=> {
    const eventNew = JSON.parse(JSON.stringify(req.body));
    eventCollection.insertOne(eventNew)
    .then(result => {
        res.send(result.insertedCount>0);
    })
});
app.post('/adminEventCreate', (req, res)=> {
  const eventCreate = JSON.parse(JSON.stringify(req.body));
  console.log(eventCreate);
  eventListCollection.insertOne(eventCreate)
  .then(result => {
      res.send(result.insertedCount>0);
  })
});
app.get('/eventHomeList',(req, res)=>{
  eventListCollection.find({ })
    .toArray((err, documents)=>{
        res.send(documents);
    })
});

  app.get("/events",(req, res)=>{
      eventCollection.find({email: req.query.email})
      .toArray((err, documents)=>{
          res.send(documents);
      })
  });
  app.get('/eventList',(req, res)=>{
      eventCollection.find({ })
      .toArray((err, documents)=>{
          res.send(documents);
      })
  });

  app.delete("/delete/:id", (req, res)=> {
      eventCollection.deleteOne({_id: ObjectId(req.params.id)})
      .then(result => {
          console.log(result);
          res.send(result.deletedCount > 0);
        })
  });
});


app.listen(port);