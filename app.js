const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const routesUsers = require('./routes/users');
const routesCards = require('./routes/cards');


const { PORT = 3000 } = process.env;
const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use((req, res, next) => {
  req.user = {
    _id: '62eacdfb0be98746b69144e2'
  };

  next();
});

app.use(routesUsers);
app.use(routesCards);

mongoose.connect('mongodb://localhost:27017/mestodb');

app.listen(PORT, () => {
    console.log('Сервер экспресс запущен')
});

