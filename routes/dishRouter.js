/*Now imagine you have a thousand REST API endpoints, and you need to construct something like this. 
Your index.js file will explode with so many different REST API endpoints. And each one being handled 
using its own app.get, app.put, app.delete, and app.post. Now Wxpress supports a way of subdividing 
this work into multiple, many Express applications, which then can be combined together to form the 
overall, Express application. This is where we will make use of the Express Router to be able to 
construct a mini Express application. And then, inside a Express Router file, we will support the 
REST API endpoint for one group of REST API parts. So for example, for dishes, and dishes dishId, 
hey can all be supported in one file.*/

const express = require ('express'); // even router is mini express file bit we still need to require express module
const bodyParser = require('body-parser');

const dishRouter = express.Router(); //using express router module

dishRouter.use (bodyParser.json());
dishRouter.route('/')    //this router will be mount in index file. note ; is removed to attache chain  ops mention below

//the express router supports this route end point. On the route end point, you simply specify the end point on which this 
//router is going to work. And then, the get put post delete method, this simply chained into that. So it'll be one group of method 
//implementations all together. So that is the reason why they use a Express router. 


//Now as we moved to this file we need to remove app and end point as well. Remaining method will be chained in all this
.all((req,res,next) =>{
    res.statusCode = 200;
    res.setHeader('Content-Type', 'text/plain');
    next();
})
.get((req,res,next) => {
    res.end('Will send all the dishes to you');
})

.post((req,res,next) =>{ //post request from client will be json format which will be carrying some name and descripttion info
    res.end('Will add the dish: '+ req.body.name + ' with details: ' + req.body.description);   // so the server will respond this to client
})

.put((req,res,next) =>{ 
    res.statusCode = 403;
    res.end('PUT operations not supported');
})

.delete((req,res,next) =>{ 
     res.end('Deleting all the dishes');
}); //Note that ; comes at the end of this chain only


//////////////////////////////////////

dishRouter.route('/:dishId')
.get((req,res,next) => {
    res.end('Will send details of the dish: ' + req.params.dishId + ' to you');
})

.post((req,res,next) =>{ 
    res.statusCode = 403;
    res.end('POST operations not supported on /dishes/'+ req.params.dishId);   
})

.put((req,res,next) =>{ 
                                           //since this is a PUT operation, and if the body contains the JSON string, which contains the details of the dish, I can extract the JSON string because we are using the body parser
    res.write('updating the dish: ' + req.params.dishId + '\n'); //  \n for new line
    res.end('Will update the dish: ' +req.body.name + 'with details: ' + req.body.description);
})

.delete((req,res,next) =>{ 
     res.end('Deleting dish: ' + req.params.dishId);
});


//all of the above operation will be done bye dishRouter and hence will be required in main file
module.exports = dishRouter;