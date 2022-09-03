
const express = require ('express'); // even router is mini express file bit we still need to require express module
const bodyParser = require('body-parser');

const mongoose = require('mongoose');
const Dishes = require('../models/dishes');

const dishRouter = express.Router(); //using express router module

dishRouter.use (bodyParser.json());
dishRouter.route('/')    //this router will be mount in index file. note ; is removed to attache chain  ops mention below

//the express router supports this route end point. On the route end point, you simply specify the end point on which this 
//router is going to work. And then, the get put post delete method, this simply chained into that. So it'll be one group of method 
//implementations all together. So that is the reason why they use a Express router. 


// .all is removed from here, instead, I'm going to explicitly declare all the various endpoints. 
//in get method res is replaced as below
.get((req,res,next) => { // So when you do a get operation on the slash dishes endpoint, you're expecting all the dishes to be returned to the client in response to the get request
    Dishes.find({})
    .then((dishes) =>{
        res.statusCode = 200;
        res.setHeader ('Content-Type', 'application/json'); //Since we are going to be returning the value as a json, so we'll set that to application json. Okay, this will return an array of dishes.
        res.json(dishes);//  we'll say res.json. So the res.json will take as an input in json string and then send it back over to my client. So, when you call res.json and supply the value and then it will simply take the parameter that you give here and then send it back as a json response. It will put this dishes into the body of the reply message and then send it back to the server. 
    }, (err) => next(err))
    .catch((err) => next(err)); // if an error is returned, then that'll simply pass off the error to the overall error handler for my application and the let that worry about how to handle the error
})

.post((req,res,next) =>{ //post request from client will be json format which will be carrying some name and descripttion info
    Dishes.create(req.body)
    .then((dish) =>{
        console.log('Dish Created', dish);
        res.statusCode = 200;
        res.setHeader ('Content-Type', 'application/json'); //Since we are going to be returning the value as a json, so we'll set that to application json. Okay, this will return an array of dishes.
        res.json(dish);
    }, (err) => next(err))
    .catch((err) => next(err));
})

.put((req,res,next) =>{ 
    res.statusCode = 403;
    res.end('PUT operations not supported');
})

.delete((req,res,next) =>{ 
     Dishes.remove({})
     .then((resp) =>{
        res.statusCode = 200;
        res.setHeader ('Content-Type', 'application/json'); //Since we are going to be returning the value as a json, so we'll set that to application json. Okay, this will return an array of dishes.
        res.json(resp);
     }, (err) => next(err))
     .catch((err) => next(err));
}); //Note that ; comes at the end of this chain only


//////////////////////////////////////

dishRouter.route('/:dishId')
.get((req,res,next) => {
    Dishes.findById(req.params.dishId)
    .then((dish) =>{
        res.statusCode = 200;
        res.setHeader ('Content-Type', 'application/json'); //Since we are going to be returning the value as a json, so we'll set that to application json. Okay, this will return an array of dishes.
        res.json(dish);//  we'll say res.json. So the res.json will take as an input in json string and then send it back over to my client. So, when you call res.json and supply the value and then it will simply take the parameter that you give here and then send it back as a json response. It will put this dishes into the body of the reply message and then send it back to the server. 
    }, (err) => next(err))
    .catch((err) => next(err)); // if an error is returned, then that'll simply pass off the error to the overall error handler for my application and the let that worry about how to handle the error
})

.post((req,res,next) =>{ 
    res.statusCode = 403;
    res.end('POST operations not supported on /dishes/'+ req.params.dishId);   
})

.put((req,res,next) =>{ 
                                           //since this is a PUT operation, and if the body contains the JSON string, which contains the details of the dish, I can extract the JSON string because we are using the body parser
    Dishes.findByIdAndUpdate(req.params.dishId, {
        $set: req.body

    }, {new: true})
    .then((dish) =>{
        res.statusCode = 200;
        res.setHeader ('Content-Type', 'application/json'); 
        res.json(dish);
    }, (err) => next(err))
    .catch((err) => next(err));   
})

.delete((req, res, next) =>{ 
     Dishes.findByIdAndRemove(req.params.dishId)
     .then((resp) =>{
        res.statusCode = 200;
        res.setHeader ('Content-Type', 'application/json'); //Since we are going to be returning the value as a json, so we'll set that to application json. Okay, this will return an array of dishes.
        res.json(resp);
     }, (err) => next(err))
     .catch((err) => next(err));
});

//all of the above operation will be done bye dishRouter and hence will be required in main file
module.exports = dishRouter;