const express = require('express');
const MongoClient = require('mongodb').MongoClient;
const bodyParser = require('body-parser');
const app = express();
const port = 3000;

app.use(express.static('./client/dist'));
app.use(bodyParser.json());

// app.get('/', (req, res) => res.send('Hello World!'));
MongoClient.connect(
  'mongodb://localhost:27017/products',
  { useNewUrlParser: true, useUnifiedTopology: true },
  function(err, client) {
    if (err) throw err;
    const db = client.db('products');
    console.log('connected to database');

    app.get('/', (req, res) => {
      res.send('inside of the get request');
    });
  }
);

app.listen(port, () => console.log(`App listening on port ${port}!`));
