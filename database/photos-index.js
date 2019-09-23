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

let photos_model = new Schema({
  id: String,
  styleId: String,
  url: String,
  thumbnail_url: String
});

let photos = mongoose.model('photos', photos_model);
db.on('error', console.error.bind(console, 'Error connecting to MongoDB:'));
db.once('open', function() {
  console.log('Connected to MongoDB with Mongoose...');
  console.time('database');
  let results = [];
  let count = 0;
  let insert = 0;
  var lineReader = fs
    .createReadStream('./photos.csv')
    .pipe(csv())
    .on('data', data => {
      console.log(data);
      results.push({
        id: data.id,
        styleId: data[' styleId'],
        url: data[' url'],
        thumbnail_url: data[' thumbnail_url']
      });
      count++;
      if (count === 10000) {
        photos.insertMany(results);
        count = 0;
        results = [];
        insert++;
        console.timeLog('database');
        console.log('insert amount', insert);
      }
    })
    .on('end', () => {
      photos.insertMany(results);
      console.timeEnd('database');
      console.log('photos inserted');
    });
});
//730000 in 65905.644ms (65 seconds)
