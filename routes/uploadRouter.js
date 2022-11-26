const express = require('express'); // even router is mini express file bit we still need to require express module
const bodyParser = require('body-parser');
const authenticate = require('../authenticate');
const multer = require ('multer');

var storage = multer.diskStorage({
    destination: (req, file, cb) =>{  //cb is call back func
            cb(null, 'public/images'); // frst parametr is err which is we have set to null 
    },

    filename: (req, file, cb) => {
        cb(null, file.originalname)
    } 

});

const imageFileFilter = (req, file, cb) => {
    if (!file.originalname.match(/\.(jpg|jpeg|png|gif)$/)){
        return cb(new Error('You can upload only image files'), false); // bcz we are supplying here the error so 2nd parametr is set to false
    }
    cb(null, true); //otherwise it matches the our condition of extension so let it be and it ll be true while error will be null 
};

// multer module configuration
const upload = multer({ storage: storage, fileFilter:
imageFileFilter}); 

const uploadRouter = express.Router(); //using express router module

uploadRouter.use(bodyParser.json());

uploadRouter.route('/') // only post methods allowed

.get(authenticate.verifyUser, (req, res, next) => {
    res.statusCode = 403;
    res.end('GET operations not supported on /imageUpload');
})

.post(authenticate.verifyUser, 
upload.single('imageFile'),(req, res) => {  //upload comes from multer line and allows to uplad single img file. That single file will specify in the upload form from the client side in the multi-part form upload by using that name there
    res.statusCode = 200;
    res.setHeader('Content-Type','application/json');
    res.json(req.file); //For example, if you are trying to upload a dish to the server side and the details of the dish to the server side, you might upload the image to the server and then you get back the URL of that image and then you maybe including the URL of that image into the json object that describes the dish. Then upload the dish json document to the server side. Then the req.file is passed back to the client                     
})


.put(authenticate.verifyUser, (req, res, next) => {
    res.statusCode = 403;
    res.end('PUT operations not supported on /imageUplaod');
})
.delete(authenticate.verifyUser, (req, res, next) => {
    res.statusCode = 403;
    res.end('DELETE operations not supported on /imageUpload');
})


module.exports = uploadRouter;
