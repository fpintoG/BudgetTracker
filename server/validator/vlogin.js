const { body, validationResult } = require('express-validator');
const { Promise } = require('mongoose');
const ModelUser = require('../models/model_user');

const pSignup = [

  body("email")
    .isEmail()
    .withMessage('enter a valid mail')

    .custom( (value) => {
      console.log(value); //email
      return ModelUser.findOne( { email: value } ).then( userDoc=>{
        console.log(userDoc);
        if (userDoc){
          return Promise.reject('email does not exist')
        }
      });
    })
    .normalizeEmail(),
    
  body("name").trim()
    .not()
    .isEmpty(),
  body("password").trim()
    .matches(/^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$.!%*#?&])/)
    .withMessage("debe tener numeros y caracteres minusculas y mayusculas y un caracter @$.!%*#?&")
    .isLength( {min : 5} )
    .withMessage("5 chars minimum")

];

const vSingup = (req, res, next) => {
  const errors = validationResult(req);
  console.log(errors);
  if(!errors.isEmpty()){
    const error = new Error('validation error');
    error.statusCode = 400;
    error.data = errors.array()
    return next(error);
  }
  
  next();
}

const validateSingup = [pSignup, vSingup ];

module.exports = {
  validateSingup
}