//modulo terceros
const express = require('express');
//const mongoose = require('mongoose');
const bodyParser = require('body-parser'); // req.body
var cors = require('cors')

const app = express();

app.use(cors({
    credentials: true,
    origin: true
  }))
  
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

//////// handler /////////////
app.use( (error, req, res, next) =>{
    console.log(error);
    
    const status= error.statusCode || 500;
    const message = error.message;
    const data = error.data;
  
    res.status(status).json({
      result: false,
      message: message,
      data: data
    })  
});

app.listen(5000, () => {
    console.log('Server Ok');
})