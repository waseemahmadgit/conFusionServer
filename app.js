var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var session = require('express-session');
var FileStore = require('session-file-store')(session);//this takes the session as its parameters, this session referring to this that we've just imported
var passport = require('passport');
var authenticate = require ('./authenticate');
var config = require('./config');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var dishRouter = require('./routes/dishRouter');
var promoRouter = require('./routes/promoRouter');
var leadersRouter = require('./routes/leadersRouter');
var uploadRouter = require('./routes/uploadRouter');

const mongoose = require('mongoose');
mongoose.Promise = require ('bluebird');

const Dishes = require('./models/dishes');
const promotions = require('./models/promotions');
const leaders = require('./models/leaders');
const { signedCookies } = require('cookie-parser');
const { initialize } = require('passport');


const url = config.mongoUrl;
const connect = mongoose.connect(url,{
  useMongoClient: true
});

connect.then((db) => {
  console.log('connected correctly to server');
}, (err) => { console.log(err); });

var app = express();

app.all('*', (req, res, next) =>{
  if (req.secure){ // this is secure check flag, if tur simpley return next
    return next();
  }
  else {
    res.redirect(307, 'https//' + req.hostname + ':' +app.get('secPort') + req.url);
  }//if you say a localhost:3000, that localhost:3000 will be covered by the first part and this will be redirected to localhost:3443 by this configuration here. And then, the rest of it, the req.url will contain the actual path on the server
}) //307 here represents that the target resource resides temporarily under different URL. And the user agent must not change the request method if it reforms in automatic redirection to that URL.

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use(passport.initialize());

app.use('/', indexRouter);//bringing these two up means one can access these two endpoints befor/without authentication
app.use('/users', usersRouter);
//Now, we want to do authentication right before we allow the client to be able to fetch data from our server. 

app.use(express.static(path.join(__dirname, 'public')));// enables us to serve static data from public folder


app.use('/dishes', dishRouter);
app.use('/promotions', promoRouter);
app.use('/leaders', leadersRouter);
app.use('/imageUpload', uploadRouter);



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
