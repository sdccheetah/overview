var mongoose = require('mongoose');
var Schema = mongoose.Schema;

let products_list = new Schema({
  id: { type: String, unique: true },
  name: String,
  slogan: String,
  description: String,
  category: String,
  default_price: Number
});

let features = new Schema({
  feature: String,
  value: String
});

let styles = new Schema({
  style_id: { type: String, unique: true },
  productId: Number,
  name: String,
  sale_price: String,
  original_price: String,
  default_style: { type: Number, default: 0 }
});

let photos = new Schema({
  thumbnail_url: String,
  url: String
});

let related = new Schema({
  product_id: Number,
  related_products: { default: [] }
});

let skus = new Schema({
  XS: Number,
  S: Number,
  M: Number,
  L: Number,
  XL: Number
});
