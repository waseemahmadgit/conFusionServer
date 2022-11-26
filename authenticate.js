//we shall use this file to configure authenticating strategy
var passport = require('passport');
var session = require('express-session');
var LocalStrategy = require('passport-local').Strategy;     //it means the passport local module exports a strategy that we can use for our application
var User = require('./models/user');
var JwtStartegy = require('passport-jwt').Strategy;
var ExtractJwt = require('passport-jwt').ExtractJwt;
var jwt = require('jsonwebtoken');

var config = require('./config');

exports.local = passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser()); //These two functions they serialize user and deserialize user are provided on the user schema and model by the use of the passport-local-mongoose plugin here
passport.deserializeUser(User.deserializeUser());   //this 2steps will take care of wahteveris required for sessions

exports.getToken = function(user) { // this will create the token and give it for us. To create the token, we will be using the jsonwebtoken module that we just imported
    return jwt.sign(user, config.secretkey, {expiresIn: 13600} );
};
/*Now, we will also next configure the jsonwebtoken based strategy for our passport application. 
So, let me declare a variable called opts, which is nothing but the options that I'm going to specify for my JWT based strategy.*/

var opts = {};
opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken(); // this option specifies how the jsonwebtoken should be extracted from the incoming request message
opts.secretOrKey = config.secretkey;

exports.jwtPassport = passport.use(new JwtStartegy(opts, 
    (jwt_payload, done) => {/* whenever you have passport which you're configuring with a new strategy, you need to supply the second parameter done. 
    Through this done parameter, you will be passing back information to passport which it will then 
    use for loading things onto the request message.*/
        console.log("JWT payload: ", jwt_payload);
        User.findOne({_id: jwt_payload._id}, (err, user) => {  // I know that in the jwt.payload, there is a ID field that comes in. So, that is what I am going to be assigning as the ID field here. So, I will say, User.findOne and the second one is a callback function.
            if (err){
                return done(err, false); //This done in passport takes three parameters.i.e error,user &info. if no user then its false
            }
            else if (user){
                return done(null, user);
            }
            else {
                return done(null,false);
        }
        });
    }));

    exports.verifyUser = passport.authenticate('jwt', {session: false});



/* we're not going to be creating sessions. So, that's why I set this option session to false here, 
and of course, the first one specified the strategy that I'm going to be using. 
So, for verifying a user, I will use the JWT strategy. How does the JWT strategy work? In the incoming request, 
the token will be included in the authentication header as we saw here. We said authentication header as bearer token. 
If that is included, then that'll be extracted and that will be used to authenticate the user based upon the token.
*/ 

/*second part that we need to do is that we need to create the token somewhere. Now, where do we create the token? 
So, this is where something that we are doing in the users.js file is very useful for us. In the users.js file, 
recall that you already have this endpoint called login. In the login endpoint, 
you were using the username and password to authenticate the user. So, even with the JsonWebToken to issue 
the JsonWebToken, you first need to authenticate the user using one of the other strategies, and if you're going to be using the 
local strategy first, we will authenticate the user using the username and password. Once the user is authenticated with the username and assword, 
then we will issue the token to the user saying, "Okay, you are a valid user, I'm going to give you the token". 
All of the subsequent requests will simply carry the token in the header of the incoming request message. So, earlier, we used to create sessions. When the user is authenticated, 
we're not going to be using sessions anymore. Instead, when the user is authenticated using the local strategy, we will issue a token to the user. So, inside this router.POST method that we have done on that /login endpoint, I'm going to create a token and pass this token back to the user
 */