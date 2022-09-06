const dotenv = require('dotenv');
const express = require('express');
const logger = require('morgan');
const path = require('path');
const router = require('./src/routes/index');
const { auth } = require('express-openid-connect');

dotenv.config();

const app = express();

app.set('views', path.join(__dirname, 'src/views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json());



// Env variables

const PORT = process.env.PORT || 8080;
const BASE_URL = process.env.baseURL || 'http://localhost:8080'
const CLIENT_ID = process.env.CLIENT_ID;
const issuerBaseURL = process.env.AUTH0_ISSUER_BASE_URL;
const SECRET = process.env.SECRET || 'my_secret'

const config = {
  authRequired: false,
  auth0Logout: true,
  baseURL: `${BASE_URL}`,
  clientID: `${CLIENT_ID}`,
  issuerBaseURL: `${issuerBaseURL}`,
  secret: `${SECRET}`,
};



// auth router attaches /login, /logout, and /callback routes to the baseURL
app.use(auth(config));

// Middleware to make the `user` object available for all views
app.use(function (req, res, next) {
  res.locals.user = req.oidc.user;
  next();
});

app.use('/', router);

// Catch 404 and forward to error handler
app.use(function (req, res, next) {
  const err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// Error handlers
app.use(function (err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: process.env.NODE_ENV !== 'production' ? err : {}
  });
});

// PORT
app.listen(PORT, function() {
    console.log(`Listening on http://localhost:${PORT}`);
});
