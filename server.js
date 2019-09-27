const express = require('express');
const MongoClient = require('mongodb').MongoClient;
const bodyParser = require('body-parser');
const app = express();
const port = 3000;

app.use(express.static('./client/dist'));
app.use(bodyParser.json());

MongoClient.connect(
  'mongodb://localhost:27017/products',
  { useNewUrlParser: true, useUnifiedTopology: true },
  function(err, client) {
    if (err) throw err;
    const db = client.db('products');
    console.log('connected to database');

    app.get('/products/list', (req, res) => {
      // get list of all products
      // let count = req.params.limit || 3;
      // let page = req.params.page || 3;
      let results = {};
      db.collection('product_lists')
        // .find()
        // .toArray()
        // .then(data => {
        //   res.send(data);
        // });
        // .aggregate({
        //   $project: {
        //     product_id: '$id',
        //     name: '$name'
        //   }
        // })
        .find()
        .project({
          _id: 0,
          id: 1,
          name: 1,
          slogan: 1,
          description: 1,
          category: 1,
          default_price: 1
        })
        .toArray()
        .then(data => {
          results['results'] = data;
          res.send(results['results']);
        });
    });
    //example data:
    // "_id": "5d8909d8541d51125ed16581",
    // "id": "1",
    // "name": "Camo Onesie",
    // "slogan": "Blend in to your crowd",
    // "description": "The So Fatigues will wake you up and fit you in. This high energy camo will have you blending in to even the wildest surroundings.",
    // "category": "Jackets",
    // "default_price": 140,
    // "__v": 0

    app.get('/products/:product_id', (req, res) => {
      // get the product detail and add features
      db.collection('product_lists')
        .find({ id: req.params.product_id })
        .toArray()
        .then(data => {
          res.send(data);
        }); //TODO: chain together from features collection
    });
    //sample data:
    // "_id": "5d8909d8541d51125ed16581",
    // "id": "1",
    // "name": "Camo Onesie",
    // "slogan": "Blend in to your crowd",
    // "description": "The So Fatigues will wake you up and fit you in. This high energy camo will have you blending in to even the wildest surroundings.",
    // "category": "Jackets",
    // "default_price": 140,
    // "__v": 0

    app.get('/products/:product_id/styles', (req, res) => {
      let style = Number(req.params.product_id);
      // get the product detail and add features
      db.collection('styles')
        .find({ productId: style })
        .toArray()
        .then(data => {
          res.send(data);
        }); //TODO: chain together from photos & skus collection
    });
    //sample data:
    // "_id": "5d856586ebc7df2213585c51",
    // "default_style": 1,
    // "style_id": "1",
    // "productId": 1,
    // "name": "Forest Green & Black",
    // "sale_price": "null",
    // "original_price": "140",
    // "__v": 0
  }
);

app.listen(port, () => console.log(`App listening on port ${port}!`));
