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
    // "id": "1",
    // "name": "Camo Onesie",
    // "slogan": "Blend in to your crowd",
    // "description": "The So Fatigues will wake you up and fit you in. This high energy camo will have you blending in to even the wildest surroundings.",
    // "category": "Jackets",
    // "default_price": 140

    app.get('/products/:product_id', (req, res) => {
      let results = {};
      // get the product detail and add features
      db.collection('product_lists')
        .find({ id: req.params.product_id })
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
    }); //TODO: chain together from features collection
    //sample data:
    //   {
    //     "id": "3",
    //     "name": "Morning Joggers",
    //     "slogan": "Make yourself a morning person",
    //     "description": "Whether you're a morning person or not.  Whether you're gym bound or not.  Everyone looks good in joggers.",
    //     "category": "Pants",
    //     "default_price": 40
    // }

    app.get('/products/:product_id/styles', (req, res) => {
      let style = Number(req.params.product_id);
      let results = {
        product_id: req.params.product_id
      };
      // get the product detail and add features
      db.collection('styles')
        .find({ productId: style })
        .project({
          _id: 0,
          id: 1,
          style_id: 1,
          name: 1,
          original_price: 1,
          default_style: 1
        })
        .toArray()
        .then(data => {
          results['results'] = data;
          // let inner = () => {
          //   return db.collections('photos')
          //   .find({})
          // }
          res.send(results);
        }); //TODO: chain together from photos & skus collection
    });
    //sample data:
    // "product_id": "3",
    // "results": [
    //     {
    //         "default_style": 1,
    //         "style_id": "11",
    //         "name": "Black",
    //         "original_price": "40"
    //     },
    app.get('/products/:product_id/related', (req, res) => {
      let related = req.params.product_id;
      let results = [];
      // get the product detail and add features
      db.collection('related_products')
        .find({ current_product_id: related })
        .project({
          _id: 0,
          related_product_id: 1
        })
        .toArray()
        .then(data => {
          data.map(each => {
            let num = Number(each['related_product_id']);
            if (!results.includes(num)) {
              results.push(num);
            }
          });
          res.send(results.sort());
        });
    });
  }
);

app.listen(port, () => console.log(`App listening on port ${port}!`));
