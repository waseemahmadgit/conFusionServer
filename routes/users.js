var express = require('express');
var bodyParser = require('body-parser');
var User = require ('../models/user');
var passport = require('passport');


var router = express.Router();
router.use(bodyParser.json());

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});/*First check to make sure that the user with that username doesn't exist within the system. 
If the user with that username exist,then you are trying to sign up a duplicate user and that should not be allowed in the system. 
 */

router.post('/signup', (req, res, next) =>{
  User.register(new User({username: req.body.username}), 
  req.body.password, (err, user) =>{
  if (err) {
    res.statusCode = 500;
    res.setHeader('Content-Type', 'application/json');
    res.json({err:err});
  }
  else{
      passport.authenticate('local')(req, res, () =>{
        res.statusCode = 200;
        res.setHeader ('Content-Type', 'Application/json');
        res.json({success: true, status: 'Registration Successful' }); 
      });
    }

  });
 
});

router.post('/login', passport.authenticate('local'),(req, res, next) =>{
  res.statusCode = 200;
        res.setHeader ('Content-Type', 'Application/json');
        res.json({success: true, status: 'Yo are Successfully logged in ' });
  
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
