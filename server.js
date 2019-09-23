const express = require('express');
const app = express();
const port = 3000;
const db = require('database'); // get the database

app.use(express.static('./client/dist'));
app.get('/', (req, res) => res.send('Hello World!'));

app.listen(port, () => console.log(`Example app listening on port ${port}!`));

app.get('/products', (req, res) => {
  //     let results = {}
  //     db.find(productId = req.params) // join tables together
  //     .then(data => {
  //         results: {
  //             productId = data.productId,
  //             name = data.name,
  //         }
  //     })
  //     .then(()=> {
  //         res.send(results)
  //     })
  //     .catch((err) => {
  //         console.log(err)
  //     })
});
