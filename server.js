const express = require('express');
const bodyParser = require('body-parser');
const productsRouter = require('./routes/productsAPI');
const morgan = require('morgan');
const app = express();
const port = process.env.PORT || 3000;

app.use(express.static('./client/dist'));
app.use(bodyParser.json());
app.use(morgan('combined'));

// app.get('/', (req, res) => res.send('Hello World!'));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(morgan('combined'));
app.use(function(req, res, next) {
  res.header('Access-Control-Allow-Origin', '*');
  res.header(
    'Access-Control-Allow-Headers',
    'Origin, X-Requested-With, Content-Type, Accept'
  );
  next();
});

app.use('/products', productsRouter);

app.listen(port, () => console.log(`App listening on port ${port}!`));
