/*
Set up a method for users to register.
Authenticate registered users to enable them to access secure resources.
Enable clients to access secure resources on the server after authentication. */

var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var passportLocalMongoose = require('passport-local-mongoose');
//username and password as we added earlier will be removed as passportLocalMongoose plugin itself will handle it 
var User = new Schema({
   
    admin: {
        type : Boolean,
        default : false
    }
}); 
User.plugin(passportLocalMongoose);//adding support for username and hashed storage of the password using the hash and salt and adding additional methods on the user schema and the model which are useful for passport authentication. 

module.exports = mongoose.model('User', User);
