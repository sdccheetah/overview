const mongoose = require('mongoose');
const fs = require('fs');
const csv = require('csv-parser');
const readline = require('readline');
// const productsSchema = require('./Schema.js');
var Schema = mongoose.Schema;

mongoose.connect('mongodb://localhost/products', {
  useNewUrlParser: true
});

const db = mongoose.connection;

let products_list = new Schema({
  id: { type: Number, unique: true },
  styleId: Number,
  size: String,
  quantity: Number
});

let skus = mongoose.model('skus', skus);
db.on('error', console.error.bind(console, 'Error connecting to MongoDB:'));
db.once('open', function() {
  console.log('Connected to MongoDB with Mongoose...');
  let results = [];
  let count = 0;
  let insert = 0;
  var lineReader = fs
    .createReadStream('./product_list.csv')
    .pipe(csv())
    .on('data', data => {
      results.push({
        id: data.id,
        styleId: data.styleID,
        size: data.size,
        quantity: data.quantity
      });
      count++;
      if (count === 10000) {
        product.insertMany(results);
        count = 0;
        results = [];
        insert++;
      }
    })
    .on('end', () => {
      product.insertMany(results);
      console.log('products inserted');
    });
});
