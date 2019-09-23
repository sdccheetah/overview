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

let styles_model = new Schema({
  style_id: { type: String, unique: true },
  productId: Number,
  name: String,
  sale_price: String,
  original_price: String,
  default_style: { type: Number, default: 0 }
});

let styles = mongoose.model('styles', styles_model);
db.on('error', console.error.bind(console, 'Error connecting to MongoDB:'));
db.once('open', function() {
  console.log('Connected to MongoDB with Mongoose...');
  console.time('database');
  let results = [];
  let count = 0;
  let insert = 0;
  var lineReader = fs
    .createReadStream('./styles.csv')
    .pipe(csv())
    .on('data', data => {
      results.push({
        style_id: data.id,
        productId: data['productId'],
        name: data['name'],
        sale_price: data['sale_price'],
        original_price: data['original_price'],
        default_style: data['default_style']
      });
      count++;
      if (count === 10000) {
        styles.insertMany(results);
        count = 0;
        results = [];
        insert++;
        console.timeLog('database');
        console.log('insert amount', insert);
      }
    })
    .on('end', () => {
      styles.insertMany(results);
      console.timeEnd('database');
      console.log('styles inserted');
    });
});
//4,660,000 in 488874 (488 sec or 8.13 min)
//582,500 per minute
