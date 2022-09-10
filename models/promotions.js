const mongoose = require('mongoose');
const Schema = mongoose.Schema;
require('mongoose-currency').loadType(mongoose); //, what this will do is to load this new currency type into Mongoose
const Currency = mongoose.Types.Currency;
/*That's it. So, this new type, the currency type is added into Mongoose and that will add in a new type called currency and 
then so I'm going to declare this constant currency as the Mongoose's types currency. So that I can make use of this in defining the schema in my application*/


const promotionSchema = new Schema({
    name: {
        type: String,
        required: true,
        unique: true
    },
    image: {
        type: String,
        required: true
    },
    label: {
        type: String,
        default: '' //I would say that this is not required but instead I can also specify a default value if I want. So I can specify a default value like that. Default value is an empty string
    },
    price: {
        type: Currency,
        required: true,
        min: 0
    },   
    featured: {
        type: Boolean, // if my document is missing that, then the default value will be added into the document here
        default:false      
    },
    description:{
        type: String,
        required: true
    },
},{
    timestamps: true  //created and updated time 
  
});


var Promotions = mongoose.model('Promotion', promotionSchema);
module.exports = Promotions;

/*var commentSchema = new Schema({
    rating: {
        type : Number,
        min : 1,
        max : 5,
        required: true
    },
    comment : {
        type : String,
        required : true
    },
    author : {
        type : String,
        required : true
    }
},{
    timestamps: true  //created and updated time 
  
});
*/

/*means that every dish object, dish document can have multiple comments stored 
within an array inside the dish document. So, this is the comment documents becomes 
sub-documents inside a dish document. So, we're storing all the comments about the 
dish inside the dish itself as an array of comment documents.*/

