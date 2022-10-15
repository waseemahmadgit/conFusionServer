var express = require('express');

var bodyParser = require('body-parser');
var User = require('../models/user');
var passport = require('passport');
var authenticate = require('../authenticate');


var router = express.Router();
router.use(bodyParser.json());

/* GET users listing. */
router.get('/', function (req, res, next) {
  res.send('respond with a resource');
});/*First check to make sure that the user with that username doesn't exist within the system. 
If the user with that username exist,then you are trying to sign up a duplicate user and that should not be allowed in the system. 
 */

router.post('/signup', (req, res, next) => {
  User.register(new User({ username: req.body.username }),
    req.body.password, (err, user) => {
      if (err) {
        res.statusCode = 500;
        res.setHeader('Content-Type', 'application/json');
        res.json({ err: err });
      }
      else {
        if (req.body.firstname)
        user.firstname = req.body.firstname;
        if (req.body.lastname)
        user.lastname = req.body.lastname;
        user.save((err, user) =>{
          if (err){
            res.statusCode = 500;
            res.setHeader('Content-Type', 'application/json');
            res.json({ err: err });
        return;
          }
            passport.authenticate('local')(req, res, () => {
            res.statusCode = 200;
            res.setHeader('Content-Type', 'Application/json');
            res.json({success: true, status: 'Registration Successful' });
        })
        
        });
      }

    });

});

//Once the user is authenticated with the username and password, then we will issue the token to the user saying, "Okay, you are a valid user, I'm going to give you the token". All of the subsequent requests will simply carry the token in the header of the incoming request message
router.post('/login', passport.authenticate('local'), (req, res) => {

  var token = authenticate.getToken({_id: req.user._id}); //if you need to search for the user, the user ID is enough to search in the MongoDB for the user
  res.statusCode = 200;
  res.setHeader('Content-Type', 'application/json');
  res.json({success: true, token: token, status: 'You are successfully logged in!'});
// If there is any error in the authentication, this passport authenticate local will automatically send back a reply to the client about the failure of the authentication. So that is already taken care of
});

router.get('/logout', (req, res) => {
  if (req.session) { // for log out session must exist otherwise it does not make sense
    req.session.destroy();
    res.clearCookie('session-id') //cookie stored as session-id, we are asking client to delete the cookie from client side through reply message
    res.redirect('/');
  }
  else {
    var err = new Error('You are not logged in');
    err.status = 403;
    next(err);
  }
});


module.exports = router;
