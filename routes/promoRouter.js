const express = require ('express');
const bodyParser = require ('body-parser');
const promoRouter = express.Router();
promoRouter.use (bodyParser.json());

promoRouter.route('/')

.all((req,res,next) =>{
    res.statusCode = 200;
    res.setHeader = ('Content-Type','text/plain');
    next();
})

.get((req,res,next) => {
    res.end("We are going to show you list of promotions");
})

.put((req,res,next) => {
    res.end("We will update the person: " + req.body.name + " to position " +req.body.description);
})

.post((req,res,next) => {
    res.statusCode = 403
    res.end("Operation not allowed");
})
.delete((req,res,next) => {
    res.end("Deleting All Promotions");
});

//////////////////////////////////////
promoRouter.route('/:promoId')

.all((req,res,next) =>{
    res.statusCode = 200;
    res.setHeader = ('Content-Type','text/plain');
    next();
})

.get((req,res,next) => {
    res.end("We are processing the person: " + req.params.promoId + " regarding promotion status");
})

.put((req,res,next) => {
    res.statusCode = 403
    res.end("Operation not allowed");
    
})

.post((req,res,next) => {
    res.write("Updating the person: " + req.params.promoId + "\n");
    res.end("The person: " + req.params.promoId + " is promoted to position: " +req.body.description);
})
.delete((req,res,next) => {
    res.end("Deleting Promotions: " +req.params.promoId);
});



module.exports = promoRouter;