const express = require('express');
const cors = require('cors');
const app = express();

const whitelist = ['http://localhost:3000', 'https://localhost:3443'];
var corsOptionsDelegate = (req, callback) =>{
    var corsOptions;
                        //So if the incoming request header contains an origin feed, then we are going to check this whitelist. Looking for that particular origin
    if (whitelist.indexOf(req.header('Origin') !== -1)){ // if above list is present the index willl be greater or equal to zero 
            corsOptions = { origin: true}; //when I set origin is equal to true here, then my cors Module will reply back saying access control allow origin, and then include that origin into the headers with the access control allow origin key there. So that way my client side will be informed saying it's okay for the server to accept this request for this particular origin. Otherwise, so if that is not the case, so if the req.header's(' Origin') is not in the whitelist, then you will see corsOptions.
}
else {
    corsOptions = { origin: false};//hen you set origin to false, then the access controller allowOrigin will not be returned by my server site. And then once we have done that, then we'll say callback(null, corsOptions);
}
callback(null, corsOptions);
};

exports.cors = cors();
exports.corsWithOptions = cors(corsOptionsDelegate);
/*Now, if you configure the cors Module by simply saying cors without any options, then that means this will 
reply back with access control allowOrigin with the wild cards toll. There are certain rules on which this 
s acceptable to do, especially whenever we perform get operations. It's okay to accept that. Otherwise, we'll 
say, corsWithOptions = cors, and then we'll supply the )corsOptionsDelegate) function that we have just defined
earlier.
So that way, if you need to apply A cors with specific options to a particular route, we will use this function. 
Otherwise, we'll simply use the standard cors.
*/