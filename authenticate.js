var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;     //it means the passport local module exports a strategy that we can use for our application
var User = require('./models/user');

exports.local = passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());   //this 2steps will take care of wahteveris required for sessions


/* for  explanantion exports.local line
Let's now configure the passport with the new local strategy 
and then we will export this from this file because this is going to be a node module. 
So we'll say exports.local and we'll say passport use and say 
new LocalStrategy and then this is where 
the functions that are supported by the passport-local-mongoose comes to our help. 
So the local strategy will need to be supplied with the verify function. 
Inside this function we will verify the user. 
This verify function will be called with the username and password that 
passport will extract from our incoming request. 
Now in the incoming request for the LocalStrategy the username and password 
should be supplied in the body of the message in the form of a Json string. 
Again because we are doing body-parser so that'll be 
added into the body of the message and then from there passport 
we'll retrieve that and then use that and supply the username and password 
as parameters to the verify function that we will supply to the LocalStrategy. 
Since we are using passport mongoose plugin, 
the mongoose plugin itself adds this function called user.authenticate. 
So it adds this method to the user schema and the model. 
We're going to supply that as the function 
that will provide the authentication for the LocalStrategy. Now if you are not using passport-local-mongoose when you set up a mongoose plugin that we have done, 
if you're not using that, then you need to write your own user authentication function here.

 */