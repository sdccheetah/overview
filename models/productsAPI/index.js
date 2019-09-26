const { product } = require('../../database/index.js');

exports.retrieve = (count, page) => {
  return product
    .find({})
    .skip(count * page)
    .limit(count)
    .select({
      _id: 0,
      __v: 0
    });
};
