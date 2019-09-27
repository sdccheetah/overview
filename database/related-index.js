const mongoose = require('mongoose');
const fs = require('fs');
const csv = require('csv-parser');
// const productsSchema = require('./Schema.js');
var Schema = mongoose.Schema;

mongoose.connect('mongodb://localhost/products', {
  useNewUrlParser: true
});

const db = mongoose.connection;

let related_model = new Schema({
  current_product_id: { type: String, index: true },
  related_product_id: String
});

let related = mongoose.model('related_products', related_model);

db.on('error', console.error.bind(console, 'Error connecting to MongoDB:'));
db.once('open', function() {
  console.log('Connected to MongoDB with Mongoose...');
  console.time('database');
  let results = [];
  let count = 0;
  let insert = 0;
  var lineReader = fs
    .createReadStream('./data_files/related.csv')
    .pipe(csv())
    .on('data', data => {
      // console.log('data from database', data);
      results.push({
        id: data.id,
        current_product_id: data['current_product_id'],
        related_product_id: data['related_product_id']
      });
      count++;
      if (count === 1000) {
        related.insertMany(results);
        count = 0;
        results = [];
        insert++;
        console.timeLog('database');
        console.log('insert amount', insert);
      }
    })
    .on('end', () => {
      related.insertMany(results);
      db.related_products.createIndex({ id: 1 });
      console.timeEnd('database');
      console.log('related products inserted!');
    });
});

//1mil entries in 92,500ms (92 seconds)
//around ~38 minutes for 26mil entries
