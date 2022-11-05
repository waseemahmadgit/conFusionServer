/*now that we have the information about the user in the user document, going into the dish schema, 
so going into dishes.js file. In the dish schema earlier, we were storing the author of the document in the form of a string here. Now we're going to be taking advantage of the fact that we 
have the support of mongoose population. So I'm going to turn the comment field from a string into 
mongoose schema types object ID. So, this way, sorry, wrong field. 
I meant to turn the author field into mongoose schema types object ID. So, the author field now instead of storing a string, will have a reference to the user document. 
So, when I turn the author field into this type, then the second property that I defined here will be a reference, which would be a reference to the user model
So, this way, we are now going to be connecting this author field and this author field will 
simply store a reference to the ID of the user document, instead of storing the details about the author in the form of a name. Now when we do that, we can use mongoose populate to populate 
this information into our dishes document whenever required. So, with this modification to the dishes schema, in dishes.js file, we'll now update the dish router to use the mongoose population. 
*/

const mongoose = require('mongoose');
const Schema = mongoose.Schema;
require('mongoose-currency').loadType(mongoose); //, what this will do is to load this new currency type into Mongoose
const Currency = mongoose.Types.Currency;
[, commentSchema] = require ("./comments.js");

/*That's it. So, this new type, the currency type is added into Mongoose and that will add in a new type called currency and 
then so I'm going to declare this constant currency as the Mongoose's types currency. So that I can make use of this in defining the schema in my application*/

/*
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
*/
const dishSchema = new Schema({
    name: {
        type: String,
        required: true,
        unique: true
    },
    description:{
        type: String,
        required: true
    },
    image: {
        type: String,
        required: true
    },
    category: {
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
    comments : {
        type: [commentSchema]
    }
},{
    timestamps: true, usePushEach: true //created and updated time 
  
});
/*means that every dish object, dish document can have multiple comments stored 
within an array inside the dish document. So, this is the comment documents becomes 
sub-documents inside a dish document. So, we're storing all the comments about the 
dish inside the dish itself as an array of comment documents.*/

var Dishes = mongoose.model('Dish', dishSchema);
module.exports = Dishes;