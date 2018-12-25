require('dotenv').config();
const express = require('express');

const app = express();

const bodyParser = require('body-parser');
const router = require('./routes/index');

app.use(bodyParser.json()); // support json encoded bodies
app.use(bodyParser.urlencoded({ extended: true })); // support encoded bodies
app.use('/', router);

app.listen(process.env.PORT, () => {
  console.log('Listening on port 3003!');
});
