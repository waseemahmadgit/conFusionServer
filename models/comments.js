
const mongoose = require('mongoose');
const Schema = mongoose.Schema;
require('mongoose-currency').loadType(mongoose); //, what this will do is to load this new currency type into Mongoose
const Currency = mongoose.Types.Currency;
/*That's it. So, this new type, the currency type is added into Mongoose and that will add in a new type called currency and 
then so I'm going to declare this constant currency as the Mongoose's types currency. So that I can make use of this in defining the schema in my application*/

var commentSchema = new Schema({
    rating: {
        type: Number,
        min: 1,
        max: 5,
        required: true
    },
    comment: {
        type: String,
        required : true
    },
    author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }
},{
    timestamps: true  //created and updated time 
  
});


var Comments = mongoose.model('Comment', commentSchema);
module.exports = [Comments, commentSchema];