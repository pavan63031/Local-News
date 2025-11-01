const express = require('express');
const router = express.Router();
const {body} = require('express-validator');

const { register,login,logout } = require('../controllers/authController');

router.post('/register',[
    body('name')
    .trim()
    .notEmpty().withMessage('Username is required')
    .isLength({min : 3}).withMessage('Username must be at least 3 characters long'),

    body('email').trim()
    .isEmail().withMessage('Enter a valid email address')
      .normalizeEmail(),

   body('password')
    .matches(/^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{6,}$/)
    .withMessage('Password must include uppercase, lowercase, number, and special character'),

    body('confirmPassword')
    .custom((value , {req}) =>  {
        if(value != req.body.password){
            throw new Error('Passwords do not match');
        }
        return true;
    }),
],register);
router.post('/login',[
    body('email')
      .trim()
      .isEmail().withMessage('Enter a valid email address'),

    body('password')
      .notEmpty().withMessage('Password is required'),
  ],login);
router.post('/logout', logout);


module.exports = router;