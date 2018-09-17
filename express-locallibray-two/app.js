/**
 * Module dependencies.
 */
// const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');

// for user login
const compression = require('compression');
const session = require('express-session');
const bodyParser = require('body-parser');
const errorHandler = require('errorhandler');
const lusca = require('lusca');
const dotenv = require('dotenv');
const MongoStore = require('connect-mongo')(session);
const flash = require('express-flash');
const mongoose = require('mongoose');
const passport = require('passport');
const expressValidator = require('express-validator');
const expressStatusMonitor = require('express-status-monitor');


const sass = require('node-sass-middleware');

/**
 * Load environment variables from .env file, where API keys and passwords are configured.
 */
dotenv.load({
  path: '.env'
});

const indexRouter = require('./routes/index');
const usersRouter = require('./routes/users');
const libraryRouter = require('./routes/libraryRouter');



const app = express();

/**
 * Connect to MongoDB.
 */
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true
});
mongoose.connection.on('error', (err) => {
  console.error(err);
  console.log('%s MongoDB connection error. Please make sure MongoDB is running.', chalk.red('✗'));
  process.exit();
});

/**
 * Express configuration.
 */

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');
app.use(expressStatusMonitor());
app.use(compression());
app.use(sass({
  src: path.join(__dirname, 'public'),
  dest: path.join(__dirname, 'public'),
  outputStyle: 'compressed',
  prefix: '/prefix'
}));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: false
}));
app.use(expressValidator());
app.use(session({
  resave: true,
  saveUninitialized: true,
  secret: process.env.SESSION_SECRET,
  cookie: {
    maxAge: 1209600000
  }, // two weeks in milliseconds
  store: new MongoStore({
    url: process.env.MONGODB_URI,
    autoReconnect: true,
  })
}));

app.use(passport.initialize());
app.use(passport.session());
app.use(flash());
// app.use((req, res, next) => {
//   if (req.path === '/api/upload') {
//     next();
//   } else {
//     lusca.csrf()(req, res, next);
//   }
// });
// app.use(lusca.xframe('SAMEORIGIN'));
// app.use(lusca.xssProtection(true));
app.disable('x-powered-by');
app.use((req, res, next) => {
  res.locals.user = req.user;
  next();
});
app.use(cookieParser());

app.use((req, res, next) => {
  // After successful login, redirect back to the intended page
  if (!req.user && req.path !== '/users/login' && req.path !== '/users/signup' && !req.path.match(/\./)) {
    req.session.returnTo = req.originalUrl;
  } else if (req.user && (req.path === '/users/account')) {
    req.session.returnTo = req.originalUrl;
  }
  next();
});

app.use('/', express.static(path.join(__dirname, 'public'), {
  maxAge: 31557600000
}));
app.use('/js/lib', express.static(path.join(__dirname, 'node_modules/popper.js/dist/umd'), {
  maxAge: 31557600000
}));
app.use('/js/lib', express.static(path.join(__dirname, 'node_modules/bootstrap/dist/js'), {
  maxAge: 31557600000
}));
app.use('/js/lib', express.static(path.join(__dirname, 'node_modules/jquery/dist'), {
  maxAge: 31557600000
}));
app.use('/webfonts', express.static(path.join(__dirname, 'node_modules/@fortawesome/fontawesome-free/webfonts'), {
  maxAge: 31557600000
}));

// Route declaration
app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/genre', libraryRouter);

// catch 404 and forward to error handler
// app.use(function (req, res, next) {
//   next(createError(404));
// });


/**
 * Error Handler.
 */
if (process.env.NODE_ENV === 'development') {
  // only use in development
  app.use(errorHandler());
}

/**
 * Start Express server.
 */

module.exports = app;