/*
Set up a method for users to register.
Authenticate registered users to enable them to access secure resources.
Enable clients to access secure resources on the server after authentication. */

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var User = new Schema({
    username: {
        type : String,
        required : true,
        unique : true
    },
    password: {
        type : String,
        required : true 
    },
    admin: {
        type : Boolean,
        default : false
    }
}); /*by default when a user is created, a new user is created, the admin flag will be set to false. You 
can explicitly set it to true from within your code in order to mark a user as an administrative user. */

module.exports = mongoose.model('User', User);
