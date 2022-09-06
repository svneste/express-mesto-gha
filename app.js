const express = require('express');

const { PORT = 3000 } = process.env;
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const routerUsers = require('./routes/users');
const routerCards = require('./routes/cards');
const routerNotFound = require('./routes/error-not-found');

const app = express();

app.use((req, res, next) => {
  req.user = {
    _id: '631397f52610b6d35e70a844',
  };
  next();
});
app.use(bodyParser.json());
app.use('/users', routerUsers);
app.use('/cards', routerCards);
app.use('*', routerNotFound);

mongoose.connect('mongodb://localhost:27017/mestodb', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  family: 4,
}).then(() => console.log('yes'))
  .catch((e) => console.log(e));

app.listen(PORT, () => {
});
