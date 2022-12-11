/*
our user document will contain, in addition to the username and password, 
username and hash and salt that we have seen earlier, 
that is automatically added by the passport local Mongoose module. 
We will also have the first name and last name for the user being defined here.
 */

var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var passportLocalMongoose = require('passport-local-mongoose');

//username and password as we added earlier will be removed as passportLocalMongoose plugin itself will handle it 
var User = new Schema({
    firstname: {
        type: String,
        default: ''
    },
    lastname: {
        type: String,
        default: ''
    },
    
    facebookId: String,
   
    admin: {
        type : Boolean,
        default : false
    }
    
}); 
// to use mongoose local schema as plugin
User.plugin(passportLocalMongoose);//adding support for username and hashed storage of the password using the hash and salt and adding additional methods on the user schema and the model which are useful for passport authentication. 

module.exports = mongoose.model('User', User);
