
const express = require('express'); // even router is mini express file bit we still need to require express module
const bodyParser = require('body-parser');

const mongoose = require('mongoose');
const authenticate = require('../authenticate');

const Dishes = require('../models/dishes');

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
        Dishes.create(req.body)
            .then((dish) => {
                console.log('Dish Created', dish);
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json'); //Since we are going to be returning the value as a json, so we'll set that to application json. Okay, this will return an array of dishes.
                res.json(dish);
            }, (err) => next(err))
            .catch((err) => next(err));
    })

    .put(authenticate.verifyUser, (req, res, next) => {
        res.statusCode = 403;
        res.end('PUT operations not supported');
    })

    .delete(authenticate.verifyUser, (req, res, next) => {
        Dishes.remove({})
            .then((resp) => {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json'); //Since we are going to be returning the value as a json, so we'll set that to application json. Okay, this will return an array of dishes.
                res.json(resp);
            }, (err) => next(err))
            .catch((err) => next(err));
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
        res.statusCode = 403;
        res.end('POST operations not supported on /dishes/' + req.params.dishId);
    })

    .put(authenticate.verifyUser, (req, res, next) => {
        //since this is a PUT operation, and if the body contains the JSON string, which contains the details of the dish, I can extract the JSON string because we are using the body parser
        Dishes.findByIdAndUpdate(req.params.dishId, {
            $set: req.body

        }, { new: true })
            .then((dish) => {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(dish);
            }, (err) => next(err))
            .catch((err) => next(err));
    })

    .delete(authenticate.verifyUser, (req, res, next) => {
        Dishes.findByIdAndRemove(req.params.dishId)
            .then((resp) => {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json'); //Since we are going to be returning the value as a json, so we'll set that to application json. Okay, this will return an array of dishes.
                res.json(resp);
            }, (err) => next(err))
            .catch((err) => next(err));
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

    .delete(authenticate.verifyUser, (req, res, next) => { //removing all the comments only from dish and not dish itself 
        Dishes.findById(req.params.dishId) // we are looking for the dish to which the comments will be pushed
            .then((dish) => {
                if (dish != null) {
                    for (var i = (dish.comments.length - 1); i >= 0; i--) {   /*all the comments from the array when you have a sub-document. 
                                                                    So, you have to go in and delete each sub-document one by one*/
                        dish.comments.id(dish.comments[i]._id).remove(); //whenever u are in subdocument u have to follow this same process
                        /* I'm looking at the array of comments and then starting from 
                            the last comment in that array all the way to the very first comment, 
                            I'm going in and then deleting comment by comment here by using 
                            the remove operation on the subdocument. 
                            So, the way we will access a subdocument is by saying 
                            dish and then comments is the field name and then I say id here. 
                            So, this is how you access a subdocument, 
                            and inside here you will specify the id of the subdocuments that you're trying to access. 
                            So, this whole thing will give you access to the subdocument, 
                            and then we call the remove method on the subdocument, 
                            and so that subdocument will be removed from the array of subdocuments. 
                            Then after that, after we have deleted all the comments, 
                            I'll save the changes and that's it.*/
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
            }, (err) => next(err))
            .catch((err) => next(err));
    }); //Note that ; comes at the end of this chain only


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
                if (dish != null && dish.comments.id(req.params.commentId) != null) { // it means dish exists and also comments exists
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

    .delete(authenticate.verifyUser, (req, res, next) => {
        Dishes.findById(req.params.dishId)
            .then((dish) => {
                if (dish != null && dish.comments.id(req.params.commentId) != null) {
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