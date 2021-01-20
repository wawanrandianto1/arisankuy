const express = require('express');

// read .env file for config settings
require('dotenv').config();

const app = express();
const path = require('path');
const bodyParser = require('body-parser');
const expressValidator = require('express-validator');
const cors = require('cors');
const logger = require('morgan');
const passport = require('passport');
const routeApi = require('./routes/index');

const port = process.env.PORT || 3000;

// Initializing passport
require('./config/passport')(passport);

// Enable the CORS
app.use(cors());

// Enable body parser for express
app.use(logger('dev'));
app.use(bodyParser.json({ limit: '50mb' }));
app.use(
  bodyParser.urlencoded({
    limit: '50mb',
    extended: true,
    parameterLimit: 50000,
  })
);
app.use(expressValidator());

// set static folder
app.use('/public', express.static(path.join(__dirname, 'public')));

app.use(passport.initialize());
app.use(passport.session());

app.use('/api', routeApi);

app.get('/', (req, res) =>
  res.sendFile(path.join(__dirname, 'public/main.html'))
);
app.get('/*', (req, res) =>
  res.sendFile(path.join(__dirname, 'public/404.html'))
);

// CRONJOB
// require('./cron/ExpiredMenurunItem');
// require('./cron/NotifikasiMenurun');

app.listen(port, () => console.log(`Backend listening on port ${port}!`));
