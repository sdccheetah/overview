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
  id: { type: Number, index: true },
  styleId: Number,
  size: String,
  quantity: Number
});

let related = mongoose.model('related', related_model);

db.on('error', console.error.bind(console, 'Error connecting to MongoDB:'));
db.once('open', function() {
  console.log('Connected to MongoDB with Mongoose...');
  console.time('database');
  let results = [];
  let count = 0;
  let insert = 0;
  var lineReader = fs
    .createReadStream('./data-files/related.csv')
    .pipe(csv())
    .on('data', data => {
      results.push({
        id: data.id,
        styleId: data[' styleId'],
        size: data[' size'],
        quantity: data[' quantity']
      });
      count++;
      if (count === 10000) {
        skus.insertMany(results);
        count = 0;
        results = [];
        insert++;
        console.timeLog('database');
        console.log('insert amount', insert);
      }
    })
    .on('end', () => {
      skus.insertMany(results);
      console.timeEnd('database');
      console.log('skus inserted!');
    });
});

//1mil entries in 92,500ms (92 seconds)
//around ~38 minutes for 26mil entries
