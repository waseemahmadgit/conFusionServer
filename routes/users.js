var express = require('express');
var bodyParser = require('body-parser');
var User = require ('../models/user');


var router = express.Router();
router.use(bodyParser.json());

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});/*First check to make sure that the user with that username doesn't exist within the system. 
If the user with that username exist,then you are trying to sign up a duplicate user and that should not be allowed in the system. 
 */

router.post('/signup', (req, res, next) =>{
  User.findOne({username: req.body.username})
  .then((user) => {
    if (user != null) { //if user is not equal to null means user already exists
      var err = new Error('User ' +req.body.username + ' already EXISTS!');
      err.status = 403;  //forbidden
      next (err);
    }
    else{
      return User.create({ 
        username: req.body.username,
        password: req.body.password

      })
    }

  })
  .then((user) =>{ // this promise is to handle above else statement i.e user.create....
    res.statusCode = 200;
    res.setHeader ('Content-Type', 'Application/json');
    res.json({status: 'Registration Successful', user: user});
  }, (err) => next(err)) //if promise does not resolve succefully then will be handled by this.
  .catch((err) => next(err));
});

router.post('/login', (req, res, next) =>{

  if (!req.session.user) {

    var authHeader = req.headers.authorization;

    if (!authHeader) {
      var err = new Error('You are not authenticated');
      res.setHeader('WWW-Authenticate', 'Basic');
      err.status = 401;
      next(err);
      return;
    }
    //Buffer will split authheaders 1nto 2. first contains basic second a string. then .tostring will furthe split into 2 as user name and password
    //notice that I am loading two splits here, one on the space and the second one is :, using the colon which separates the username and password.
    var auth = new Buffer.from(authHeader.split(' ')[1], 'base64').toString().split(':');
    var username = auth[0];
    var password = auth[1];
    User.findOne({username: username})
    .then((user) => {
      if (user == null) {
        var err = new Error('User ' + username + 'does not exists');
        err.status = 403;
        return next(err);
      }
      else if (user.password !== password) { //user exists but password does not match
        var err = new Error('Your Password is Incorrect');
        err.status = 403;
        return next(err);
      }
    
    else if (user.username == username && user.password == password) {
      req.session.user = 'authenticated';
      res.statusCode = 200;
      res.setHeader ('Content-Type','Text/Plain');
      res.end('You are Authenticated');
    } 
  })
    .catch((err) => next(err));
}
else {
      res.statusCode = 200;
      res.setHeader ('Content-Type','Text/Plain');
      res.end('You are already Authenticated');
  }
});

router.get('/logout', (req, res) =>{
  if (req.session){ // for log out session must exist otherwise it does not make sense
    req.session.destroy();
    res.clearCookie('session-id') //cookie stored as session-id, we are asking client to delete the cookie from client side through reply message
    res.redirect('/');
  }
  else{
    var err = new Error ('You are not logged in');
    err.status = 403;
    next (err);
  }
});
    

module.exports = router;
