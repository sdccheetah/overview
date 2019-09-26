const mongoose = require('mongoose');
const fs = require('fs');
const csv = require('csv-parser');
const readline = require('readline');
const productsSchema = require('./Schema.js');
var Schema = mongoose.Schema;

mongoose.connect('mongodb://localhost/products', {
  useNewUrlParser: true
});

const db = mongoose.connection;

let product_list = new Schema({
  id: { type: String, unique: true, index: true },
  name: String,
  slogan: String,
  description: String,
  category: String,
  default_price: Number
});

let product = mongoose.model('product_lists', product_list);
db.on('error', console.error.bind(console, 'Error connecting to MongoDB:'));
db.once('open', function() {
  console.log('Connected to MongoDB with Mongoose...');
  console.time('database');
  let results = [];
  let count = 0;
  let insert = 0;
  var lineReader = fs
    .createReadStream('./data_files/product_list.csv')
    .pipe(csv())
    .on('data', data => {
      results.push({
        id: data.id,
        name: data[' name'],
        slogan: data[' slogan'],
        description: data[' description'],
        asker_email: data[' asker_email'],
        category: data[' category'],
        default_price: data[' default_price']
      });
      count++;
      if (count === 10000) {
        product.insertMany(results);
        count = 0;
        results = [];
        insert++;
        console.log('count', insert);
      }
    })
    .on('end', () => {
      product.insertMany(results);
      console.log('products inserted');
      console.timeEnd('database');
    });
});

//65k (full csv) inserted at 462.366ms (.46 seconds)
