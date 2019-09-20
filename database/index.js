const mongoose = require('mongoose');
const fs = require('fs');
const csv = require('csv-parser');
const readline = require('readline');
const productsSchema = require('./Schema.js');

mongoose.connect('mongodb://localhost/27017', {
  useNewUrlParser: true
});
const db = mongoose.connection;

// const products = new mongoose.Schema(productsSchema);

let products_list = new Schema({
  id: { type: String, unique: true },
  name: String,
  slogan: String,
  description: String,
  category: String,
  default_price: Number
});

let product = mongoose.model('Product', productSchema);
db.on('error', console.error.bind(console, 'Error connecting to MongoDB:'));
db.once('open', function() {
  console.log('Connected to MongoDB with Mongoose...');
  let results = [];
  let count = 0;
  let insert = 0;
  var lineReader = fs
    .createReadStream('../products_list.csv')
    .pipe(csv())
    .on('data', data => {
      console.log(data);
      //   results.push({
      //     id: data.id,
      //     product_id: data[" product_id"],
      //     body: data[" body"],
      //     date_written: data[" date_written"],
      //     asker_name: data[" asker_name"],
      //     asker_email: data[" asker_email"],
      //     reported: data[" reported"],
      //     helpful: data[" helpful"]
      //   });
      //   count++;
      //   if (count === 1000) {
      //     Question.insertMany(results);
      //     count = 0;
      //     results = [];
      //     insert++;
      //     console.log(insert);
      //   }
      // })
      // .on("end", () => {
      //   console.log("questions inserted");
      // });
    });
});
