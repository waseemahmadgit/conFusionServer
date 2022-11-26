
const express = require('express'); // even router is mini express file bit we still need to require express module
const bodyParser = require('body-parser');

const mongoose = require('mongoose');
const authenticate = require('../authenticate');

const Dishes = require('../models/dishes');

[Comments, ] = require('../models/comments');

const User = require('../models/user');
const router = require('./users');
const dishRouter = express.Router(); //using express router module

dishRouter.use(bodyParser.json());



dishRouter.route('/')

    .get((req, res, next) => { // So when you do a get operation on the slash dishes endpoint, you're expecting all the dishes to be returned to the client in response to the get request
        Dishes.find({})
            .populate('comments.author') //when the dishes document has been constructed to send back the reply to the user, we're going to populate the author field inside there from the user document in there.
            .then((dishes) => {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json'); //Since we are going to be returning the value as a json, so we'll set that to application json. Okay, this will return an array of dishes.
                res.json(dishes);//  we'll say res.json. So the res.json will take as an input in json string and then send it back over to my client. So, when you call res.json and supply the value and then it will simply take the parameter that you give here and then send it back as a json response. It will put this dishes into the body of the reply message and then send it back to the server. 
            }, (err) => next(err))
            .catch((err) => next(err)); // if an error is returned, then that'll simply pass off the error to the overall error handler for my application and the let that worry about how to handle the error
    })

    .post(authenticate.verifyUser, (req, res, next) => { //post request from client will be json format which will be carrying some name and descripttion info
        if (req.user.admin){
        Dishes.create(req.body)
            .then((dish) => {
                console.log('Dish Created', dish);
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json'); //Since we are going to be returning the value as a json, so we'll set that to application json. Okay, this will return an array of dishes.
                res.json(dish);
            }, (err) => next(err))
            .catch((err) => next(err));
        }
        else {
            res.statusCode = 403;
            res.end('You are not Authorized/allowed for this operation');
        }
    })

    .put(authenticate.verifyUser, (req, res, next) => {
        res.statusCode = 403;
        res.end('PUT operations not supported');
    })

    .delete(authenticate.verifyUser, (req, res, next) => {
        if (req.user.admin){
        Dishes.remove({})
            .then((resp) => {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json'); //Since we are going to be returning the value as a json, so we'll set that to application json. Okay, this will return an array of dishes.
                res.json(resp);
            }, (err) => next(err))
            .catch((err) => next(err));
        }
        else {
            res.statusCode = 403;
            res.end('You are not Authorized/Allowed for this operation');
        }
    }); //Note that ; comes at the end of this chain only


//////////////////////////////////////

dishRouter.route('/:dishId')
    .get((req, res, next) => {
        Dishes.findById(req.params.dishId)
            .populate('comments.author')
            .then((dish) => {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json'); //Since we are going to be returning the value as a json, so we'll set that to application json. Okay, this will return an array of dishes.
                res.json(dish);//  we'll say res.json. So the res.json will take as an input in json string and then send it back over to my client. So, when you call res.json and supply the value and then it will simply take the parameter that you give here and then send it back as a json response. It will put this dishes into the body of the reply message and then send it back to the server. 
            }, (err) => next(err))
            .catch((err) => next(err)); // if an error is returned, then that'll simply pass off the error to the overall error handler for my application and the let that worry about how to handle the error
    })

    .post(authenticate.verifyUser, (req, res, next) => {
        if (req.user.admin){
        res.statusCode = 403;
        res.end('POST operations not supported on /dishes/' + req.params.dishId);
        }
        else {
            res.statusCode = 403;
            res.end('You are not Authorized/Allowed for this operation');
        }
    })

    .put(authenticate.verifyUser, (req, res, next) => {
        //since this is a PUT operation, and if the body contains the JSON string, which contains the details of the dish, I can extract the JSON string because we are using the body parser
        if (req.user.admin){
        Dishes.findByIdAndUpdate(req.params.dishId, {
            $set: req.body

        }, { new: true })
            .then((dish) => {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(dish);
            }, (err) => next(err))
            .catch((err) => next(err));
        }
        else {
            res.statusCode = 403;
            res.end('You are not Authorized/Allowed for this operation');
        }
    })

    .delete(authenticate.verifyUser, (req, res, next) => {
        if (req.user.admin){
        Dishes.findByIdAndRemove(req.params.dishId)
            .then((resp) => {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json'); //Since we are going to be returning the value as a json, so we'll set that to application json. Okay, this will return an array of dishes.
                res.json(resp);
            }, (err) => next(err))
            .catch((err) => next(err));
        }
        else {
            res.statusCode = 403;
            res.end('You are not Authorized/Allowed for this operation');
        }
    });


/////////////////////


dishRouter.route('/:dishId/comments')

    .get((req, res, next) => {
         
        Dishes.findById(req.params.dishId)
            .populate('comments.author')
            .then((dish) => {
                if (dish != null) {
                    res.statusCode = 200;
                    res.setHeader('Content-Type', 'application/json');
                    res.json(dish.comments);      
                    
                }
                else {
                    err = new Error('Dish ' + req.params.dishId + 'not found');
                    err.status = 404;
                    return next(err); //Because if you return this as an error, as you'll recall, this will be handled by your app.js file, so in the app.js file, right at the bottom here, we have the error handler here. So when it comes in here, this will set the rest or status to error dot status, which we had set to 404, so that is what will be returned
                }
            }, (err) => next(err))
            .catch((err) => next(err));
    })

    .post(authenticate.verifyUser, (req, res, next) => {
        Dishes.findById(req.params.dishId)
        .then((dish) => {
            if (dish != null) {
                req.body.author = req.user._id;
                dish.comments.push(req.body);
                dish.save()
                .then((dish) => {
                    Dishes.findById(dish._id)
                    .populate('comments.author')
                    .then((dish) => {
                        res.statusCode = 200;
                        res.setHeader('Content-Type', 'application/json');
                        res.json(dish);
                    })            
                }, (err) => next(err));
            }
            else {
                err = new Error('Dish ' + req.params.dishId + ' not found');
                err.status = 404;
                return next(err);
            }
        }, (err) => next(err))
        .catch((err) => next(err));
    })

    .put(authenticate.verifyUser, (req, res, next) => {
        res.statusCode = 403;
        res.end('PUT operations not supported on dishes/' + req.params.dishId + '/comments');
    })
/////****/////// */
////BREAK POINT/////
  /*  .delete(authenticate.verifyUser, (req, res, next) => { //removing all the comments only from dish and not dish itself 
        Dishes.findById(req.params.dishId) // we are looking for the dish to which the comments will be pushed
            .then((dish) => {
                if (req.userId == dish.comments.author) {
                    if (dish != null && dish.comments.id(req.params.commentId) != null) {
                        {

                            dish.comments.id(req.params.commentId).remove();
                        }

                        dish.save()
                            .then((dish) => {
                                res.statusCode = 200;
                                res.setHeader('Content-Type', 'application/json');
                                res.json(dish);
                            }, (err) => next(err));
                    }
                    else {
                        err = new Error('Dish ' + req.params.dishId + 'not found');
                        err.status = 404;
                        return next(err); //Because if you return this as an error, as you'll recall, this will be handled by your app.js file, so in the app.js file, right at the bottom here, we have the error handler here. So when it comes in here, this will set the rest or status to error dot status, which we had set to 404, so that is what will be returned
                    }
                }

                else {
                    res.statusCode = 403;
                    res.end('You are not Authorized/Allowed for this operation');
                }

            }, (err) => next(err))
            .catch((err) => next(err));
    }); //Note that ; comes at the end of this chain only

*/
//////////////////////////////////////
/////////////////////////////////////

dishRouter.route('/:dishId/comments/:commentId')
    .get((req, res, next) => {
        Dishes.findById(req.params.dishId)
            .populate('comments.author')
            .then((dish) => {
                if (dish != null && dish.comments.id(req.params.commentId) != null) { // it means dish exists and also comments exists
                    res.statusCode = 200;
                    res.setHeader('Content-Type', 'application/json');
                    res.json(dish.comments.id(req.params.commentId)); //this will allow us to retrieve a specific comment from the set of comments.
                }
                else if (dish == null) {
                    err = new Error('Dish ' + req.params.dishId + 'not found');
                    err.status = 404;
                    return next(err); //Because if you return this as an error, as you'll recall, this will be handled by your app.js file, so in the app.js file, right at the bottom here, we have the error handler here. So when it comes in here, this will set the rest or status to error dot status, which we had set to 404, so that is what will be returned
                }
                else {
                    err = new Error('Comment ' + req.params.commentId + 'not found');
                    err.status = 404;
                    return next(err);
                }
            }, (err) => next(err))
            .catch((err) => next(err)); // if an error is returned, then that'll simply pass off the error to the overall error handler for my application and the let that worry about how to handle the error
    })

    .post(authenticate.verifyUser, (req, res, next) => {
        res.statusCode = 403;
        res.end('POST operations not supported on /dishes/' + req.params.dishId
            + '/comments/' + req.params.commentId);
    })

    .put(authenticate.verifyUser, (req, res, next) => {
        Dishes.findById(req.params.dishId)
            .then((dish) => {
                console.log(dish.comments.id(req.params.commentId).author);
                console.log(req.user);
                
                if (dish != null && dish.comments.id(req.params.commentId) != null) { // it means dish exists and also comments exists
                    console.log('check 01');
                    if (req.user == dish.comments.id(req.params.commentId).author){
                        console.log('check 02');
                        if (req.body.rating) {  //rating and comment are the only two things that I will allow the user to change.
                        dish.comments.id(req.params.commentId).rating = req.body.rating;
                    }
                    if (req.body.comment) { //if the comments update exists
                        dish.comments.id(req.params.commentId).comment = req.body.comment;
                    }
                    dish.save()
                        .then((dish) => {
                            Dishes.findById(dish._id)
                            .populate('comments.author')
                            .then((dish) =>{
                                res.statusCode = 200;
                                res.setHeader('Content-Type', 'application/json');
                                res.json(dish);
                            })                            
                        }, (err) => next(err));
                    }
                    else if(dish.comments.id(req.params.commentId).author != req.user._id){
                        console.log('check 03');
                        res.statusCode = 403;
                        res.end('You are not Authorized/Allowed for this operation');
                }
                
                }
                else if (dish == null) {
                    err = new Error('Comment ' + req.params.commentId + 'not found');
                    err.status = 404;
                    return next(err); //Because if you return this as an error, as you'll recall, this will be handled by your app.js file, so in the app.js file, right at the bottom here, we have the error handler here. So when it comes in here, this will set the rest or status to error dot status, which we had set to 404, so that is what will be returned
                }
                else {
                    err = new Error('Dish ' + req.params.dishId + 'not found');
                    err.status = 404;
                    return next(err);
                }
            }, (err) => next(err))
            .catch((err) => next(err));
    })

    
       
      /*  if(
         Comments.findById(req.params.commentId).authorId == req.userId){
           // Comments.Id(req.params.commentId).remove();
           Comments.id(req.params.commentId).comment.remove();
           // Comments.findByIdAndRemove(req.params.commentId);
            res.statusCode = 200;
        } else
            err = new Error('Unauthorized User');
            err.status = 503;
            return next(err); 
        }, (err) => next(err)
        .catch((err) => next(err))); */
        .delete(authenticate.verifyUser, (req, res, next) => {
        Dishes.findById(req.params.dishId)
            .then((dish) => {
            
                if (dish != null && dish.comments.id(req.params.commentId) != null) {
                    if (dish.comments.id(req.params.commentId).author == req.user._id){   
                    dish.comments.id(req.params.commentId).remove();
                    dish.save()
                        .then((dish) => {
                            Dishes.findById(dish._id)
                            .populate('comments.author')
                            .then((dish) =>{
                                res.statusCode = 200;
                                res.setHeader('Content-Type', 'application/json');
                                res.json(dish);
                            })                            
                        }, (err) => next(err));
                    }
                    else if(dish.comments.id(req.params.commentId).author != req.user._id){
                        res.statusCode = 403;
                        res.end('You are not Authorized/Allowed for this operation');
                }
                }
                else if (dish == null) {
                    err = new Error('Dish ' + req.params.dishId + ' not found');
                    err.status = 404;
                    return next(err);
                }
                else {
                    err = new Error('Comment ' + req.params.commentId + ' not found');
                    err.status = 404;
                    return next(err);
                }
            }, (err) => next(err))
            .catch((err) => next(err));
        });
        
//all of the above operation will be done bye dishRouter and hence will be required in main file
module.exports = dishRouter;