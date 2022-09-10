const express = require ('express');
const bodyParser = require ('body-parser');
const Leaders = require('../models/leaders');
const Promotions = require('../models/promotions');
const leadersRouter = express.Router();
leadersRouter.use (bodyParser.json());

leadersRouter.route('/')

.get((req,res,next) =>{
    Leaders.find({})
    .then((leaders) =>{
        res.statusCode = 200;
        res.setHeader ('Content-Type','application/json');
        res.json(leaders);
    }, (err) => next(err))
   .catch ((err) => next(err));
})

.put((req,res,next) =>{
    res.statusCode = 403;
    res.end('PUT operation is not allowed on /localhost/leaders ');

})

.post((req,res,next) =>{
    Leaders.create(req.body)
    .then((leaders) =>{
        console.log('Leader Created ', Leaders);
        res.statusCode = 200;
        res.setHeader ('Content-Type','application/json');
        res.json(leaders);
    }, (err) => next(err))
   .catch ((err) => next(err));
})

.delete((req,res,next) =>{
    Leaders.remove ({})
    .then((resp) =>{
        console.log('Removing all the Promotions');
        res.statusCode = 200;
        res.setHeader ('Content-Type','application/json');
        res.json(resp);
    }, (err) => next(err))
   .catch ((err) => next(err));
})
///////////////////////

leadersRouter.route('/:leadersId')

.get((req,res,next) =>{
    Leaders.findById(req.params.leadersId)
    .then((leader) =>{
        res.statusCode = 200;
        res.setHeader ('Content-Type','application/json');
        res.json(leader);
    }, (err) => next(err))
   .catch ((err) => next(err));
})

.put((req,res,next) =>{
    Leaders.findByIdAndUpdate(req.params.leadersId, {
        $set: req.body
    }, {new : true})
    .then((leader) =>{
        res.statusCode = 200;
        res.setHeader ('Content-Type','application/json');
        res.json(leader);
    }, (err) => next(err))
   .catch ((err) => next(err));
    })

    .post((req, res, next) => {
        res.statusCode = 403;
        res.end('POST operations not supported on /leaders/' + req.params.leadersId);
    })

    .delete ((req,res,next) =>{
        Leaders.findByIdAndRemove(req.params.leadersId)
        .then((resp) =>{
            res.statusCode = 200;
            res.setHeader ('Content-Type','application/json');
            res.json(resp);
        }, (err) => next(err))
       .catch ((err) => next(err));
        })
    


// .all((req,res,next) =>{
//     res.statusCode = 200;
//     res.setHeader = ('Content-Type','text/plain');
//     next();
// })

// .get((req,res,next) => {
//     res.end("We are processing the leader: " + req.params.leadersId + " regarding leaders status");
// })

// .put((req,res,next) => {
//     res.statusCode = 403
//     res.end("Operation not allowed");
    
// })

// .post((req,res,next) => {
//     res.write("Updating the leader: " + req.params.leadersId + "\n");
//     res.end("The leader: " + req.params.leadersId + " is currently position: " +req.body.description);
// })
// .delete((req,res,next) => {
//     res.end("Deleting Leaders: " +req.params.leadersId);
// });


module.exports = leadersRouter;