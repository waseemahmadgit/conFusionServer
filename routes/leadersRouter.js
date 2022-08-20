const express = require ('express');
const bodyParser = require ('body-parser');
const leadersRouter = express.Router();
leadersRouter.use (bodyParser.json());

leadersRouter.route('/')

.all((req,res,next) =>{
    res.statusCode = 200;
    res.setHeader = ('Content-Type', 'text/plain');
    next();
})

.get((req,res,next) =>{
    res.end ("We have all the list of Leaders of all Counteries");
})

.put((req,res,next) =>{
    res.end ("We shall add: " + req.body.name +"to the list of leader with description: " +req.body.description);
})

.post((req,res,next) =>{
    res.statusCode = 403
    res.end("Operation not allowed");
})

.delete((req,res,next) =>{
    res.end ("Deleting All the Enteries");
});
///////////////////////

leadersRouter.route('/:leadersId')


.all((req,res,next) =>{
    res.statusCode = 200;
    res.setHeader = ('Content-Type','text/plain');
    next();
})

.get((req,res,next) => {
    res.end("We are processing the leader: " + req.params.leadersId + " regarding leaders status");
})

.put((req,res,next) => {
    res.statusCode = 403
    res.end("Operation not allowed");
    
})

.post((req,res,next) => {
    res.write("Updating the leader: " + req.params.leadersId + "\n");
    res.end("The leader: " + req.params.leadersId + " is currently position: " +req.body.description);
})
.delete((req,res,next) => {
    res.end("Deleting Leaders: " +req.params.leadersId);
});


module.exports = leadersRouter;