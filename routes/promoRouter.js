const express = require ('express');
const bodyParser = require ('body-parser');
const authenticate = require('../authenticate');
const Promotions = require('../models/promotions');

const promoRouter = express.Router();
promoRouter.use (bodyParser.json());


promoRouter.route('/')

 .get((req, res, next) => { // So when you do a get operation on the slash dishes endpoint, you're expecting all the dishes to be returned to the client in response to the get request
        Promotions.find({})
            .then((promotions) => {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json'); //Since we are going to be returning the value as a json, so we'll set that to application json. Okay, this will return an array of dishes.
                res.json(promotions);//  we'll say res.json. So the res.json will take as an input in json string and then send it back over to my client. So, when you call res.json and supply the value and then it will simply take the parameter that you give here and then send it back as a json response. It will put this dishes into the body of the reply message and then send it back to the server. 
            }, (err) => next(err))
            .catch((err) => next(err)); // if an error is returned, then that'll simply pass off the error to the overall error handler for my application and the let that worry about how to handle the error
    })

.put(authenticate.verifyUser, (req,res,next) => {
    res.statusCode = 403
    res.end('Operation not allowed on localhost/3000:' + req.body);
    
})

.post(authenticate.verifyUser, (req, res, next) => { //post request from client will be json format which will be carrying some name and descripttion info
    Promotions.create(req.body)
        .then((promotion) => {
            console.log('Promotion Created', promotion);
            res.statusCode = 200;
            res.setHeader('Content-Type', 'application/json'); //Since we are going to be returning the value as a json, so we'll set that to application json. Okay, this will return an array of dishes.
            res.json(promotion);
        }, (err) => next(err))
        .catch((err) => next(err));
})

.delete(authenticate.verifyUser, (req, res, next) => {
    Promotions.remove({})
        .then((resp) => {
            res.statusCode = 200;
            res.setHeader('Content-Type', 'application/json'); //Since we are going to be returning the value as a json, so we'll set that to application json. Okay, this will return an array of dishes.
            res.json(resp);
        }, (err) => next(err))
        .catch((err) => next(err));
}); 

////////////////////////////////
///////////////////////////////

promoRouter.route('/:promoId')
.get((req, res, next) => {
    Promotions.findById(req.params.promoId)
        .then((promotion) => {
            res.statusCode = 200;
            res.setHeader('Content-Type', 'application/json'); //Since we are going to be returning the value as a json, so we'll set that to application json. Okay, this will return an array of dishes.
            res.json(promotion);//  we'll say res.json. So the res.json will take as an input in json string and then send it back over to my client. So, when you call res.json and supply the value and then it will simply take the parameter that you give here and then send it back as a json response. It will put this dishes into the body of the reply message and then send it back to the server. 
        }, (err) => next(err))
        .catch((err) => next(err)); // if an error is returned, then that'll simply pass off the error to the overall error handler for my application and the let that worry about how to handle the error
})

    .post(authenticate.verifyUser, (req,res,next) => {
        res.statusCode = 403;
        res.end('Post Operation is not supported on promotion ' + req.params.promoId);
    })

    .put(authenticate.verifyUser, (req, res, next) =>{
        Promotions.findByIdAndUpdate(req.params.promoId,{
          $set: req.body  
        }, {new : true})
        .then((promotion) => {
        res.statusCode = 200;
        res.setHeader ('Content-Type', 'application/json');
        res.json(promotion);
    }, (err) => next (err))
    .catch ((err) => next(err));

    })

    .delete(authenticate.verifyUser, (req,res,next) => {
        Promotions.findByIdAndRemove(req.params.promoId)
        .then((resp) => {
            res.statusCode = 200;
            res.setHeader('Content-Type', 'application/json'); //Since we are going to be returning the value as a json, so we'll set that to application json. Okay, this will return an array of dishes.
            res.json(resp);
        }, (err) => next(err))
        .catch((err) => next(err));
});

module.exports = promoRouter;

// .all((req,res,next) =>{
//     res.statusCode = 200;
//     res.setHeader = ('Content-Type','text/plain');
//     next();
// })

// .get((req,res,next) => {
//     res.end("We are going to show you list of promotions");
// })

// .put((req,res,next) => {
//     res.end("We will update the person: " + req.body.name + " to position " +req.body.description);
// })

// .post((req,res,next) => {
//     res.statusCode = 403
//     res.end("Operation not allowed");
// })
// .delete((req,res,next) => {
//     res.end("Deleting All Promotions");
// });

//////////////////////////////////////


// ////////////////////////////
// ////////////////////////////




