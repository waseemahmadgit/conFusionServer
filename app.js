var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var session = require('express-session');
var FileStore = require('session-file-store')(session);//this takes the session as its parameters, this session referring to this that we've just imported
var passport = require('passport');
var authenticate = require ('./authenticate');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var dishRouter = require('./routes/dishRouter');
var promoRouter = require('./routes/promoRouter');
var leadersRouter = require('./routes/leadersRouter');

var app = express();

const mongoose = require('mongoose');
mongoose.Promise = require ('bluebird');

const Dishes = require('./models/dishes');
const promotions = require('./models/promotions');
const leaders = require('./models/leaders');
const { signedCookies } = require('cookie-parser');
const { initialize } = require('passport');

const url = 'mongodb://localhost:27017/conFusion'
const connect = mongoose.connect(url);

connect.then((db) => {
  console.log('connected correctly to server');
}, (err) => { console.log(err); });

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
//app.use(cookieParser('12345-67890-09876-54321'));//no parameter was there before. secret key is for signed cookie
app.use(session({
  name: 'session-id',
  secret: '12345-67890-09876-54321',
  saveUninitialized: false,
  store: new FileStore()
}));

app.use(passport.initialize());
app.use(passport.session());

app.use('/', indexRouter);//bringing these two up means one can access these two endpoints befor/without authentication
app.use('/users', usersRouter);
//Now, we want to do authentication right before we allow the client to be able to fetch data from our server. 

function auth(req, res, next) {
  console.log(req.session); // we're going to modify this authorization middleware to make use of cookies instead of the authorization header.

  if (!req.user) {

      var err = new Error('You are not authenticated');
      err.status = 403;
      next(err);
      return;
    }
    //Buffer will split authheaders 1nto 2. first contains basic second a string. then .tostring will furthe split into 2 as user name and password
    //notice that I am loading two splits here, one on the space and the second one is :, using the colon which separates the username and password.
    else {
     
      next();
  }

}
app.use(auth);

app.use(express.static(path.join(__dirname, 'public')));// enables us to serve static data from public folder



app.use('/dishes', dishRouter);
app.use('/promotions', promoRouter);
app.use('/leaders', leadersRouter);



// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
