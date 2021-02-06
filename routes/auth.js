const express = require('express');

const User = require('../models/user');
const authController = require('../controllers/auth');
const { check, body } = require('express-validator');

const router = express.Router();

router.get('/login', authController.getLogin)

router.post('/login', 
  [
    check('email')
    .isEmail()
    .withMessage('Please enter a valid email')
    .normalizeEmail(), 
    
    body('password', 'Please enter a valid Password')
    .isLength({min: 5})
    .isAlphanumeric()
    .trim()
  ]
  , authController.postLogin
);

router.post('/logout', authController.postLogout)

router.post('/signup', 
  [
    check('email')
    .isEmail()
    .withMessage('Please enter a valid email.')
    .custom((value, {req}) => {
      // if(value === 'test@test.com') {
      //   throw new Error('This email address is forbidden.');
      // }
      // return true;
      return User.findOne({email: value})
      .then(userDoc => {
        if(userDoc){
          return Promise.reject('Email already exists, please pick another one!')
        }
      })  
    })
    .normalizeEmail(), 
    body('password', 
      'Please enter a password with only numbers and text and atleast 5 characters'
    )
    .isLength({min: 5})
    .isAlphanumeric()
    .trim(),
    body('confirmPassword').trim().custom((value, {req}) => {
      if(value !== req.body.password) {
        throw new Error('Passwords do not match');
      }
      return true;
    })
  ], 
  authController.postSignup
);

router.get('/signup', authController.getSignup)

router.get('/reset', authController.getResetPassword)

router.post('/reset', authController.postResetPassword)

router.get('/reset/:token', authController.getNewPassword)

router.post('/new-password', authController.postNewPassword)

module.exports = router;