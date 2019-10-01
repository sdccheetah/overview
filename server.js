const express = require('express');
const MongoClient = require('mongodb').MongoClient;
const bodyParser = require('body-parser');
const app = express();
const port = 8000;

app.use(express.static('./client/dist'));
app.use(bodyParser.json());

MongoClient.connect(
  'mongodb://mongo:27017/products',
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
        product_id: req.params.product_id,
        skus: []
      };
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
          let promises = results['results'].map(style => {
            return db
              .collection('photos')
              .find({ styleId: style['style_id'] })
              .project({
                _id: 0,
                thumbnail_url: 1,
                url: 1
              })
              .toArray()
              .then(image => {
                style['photos'] = image;
                results['skus'] = [];
                let secondPromises = results['results'].map(sku1 => {
                  return db
                    .collection('skus')
                    .find({ styleId: Number(style['style_id']) })
                    .project({ _id: 0, size: 1, quantity: 1 })
                    .toArray()
                    .then(sku1 => {
                      results['skus'].push(sku1);
                    });
                });
              })
              .catch(err => {
                console.log(err);
              });
          });
          Promise.all(promises).then(data => {
            res.send(results);
          });
        });
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
    //example data: [
    //     1,
    //     3,
    //     6,
    //     8,
    //     9
    // ]
  }
);
app.listen(port, () => {
  console.log('this is working, this is the port', port);
  console.log(`WHY ARE YOU NOT WORKING ${port}!`);
});
