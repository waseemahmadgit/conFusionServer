const mongoose = require('mongoose');
const Schema = mongoose.Schema;
require('mongoose-currency').loadType(mongoose); //, what this will do is to load this new currency type into Mongoose
const Currency = mongoose.Types.Currency;

const leaderSchema = new Schema({
    name: {
        type: String,
        required: true,
        unique: true
    },
    image: {
        type: String,
        required: true
    },
    designation: {
        type: String,
        required: true
       
    },
    abbr: {
        type: String,
        required: true
    },
    featured: {
        type: Boolean, // if my document is missing that, then the default value will be added into the document here
        default:false      
    },
    description: {
        type: String,
        required: true
    }},
    {
        timestamps: true  //created and updated time 
      
    })

var Leaders = mongoose.model('Leader',leaderSchema);
module.exports = Leaders;