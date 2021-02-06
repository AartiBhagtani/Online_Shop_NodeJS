const express = require('express');

const path = require('path');

const rootDir = require('../util/path.js')

const adminController = require('../controllers/admin.js')
const isAuth = require('../middleware/is-auth');

const { body } = require('express-validator');

const router = express.Router();

// starts with /admin

router.get('/add-product', isAuth, adminController.getAddProduct);

router.post('/add-product', isAuth,  
  [
    body('title', 'Title should be atleast 3 character long and not contain any special characters')
      .isString()
      .isLength({min: 3})
      .trim(),
    body('imageUrl', 'URL should be valid')
      .isURL(), 
    body('price', 'Price should be in decimal')
      .isFloat(),
    body('description', 'Description should be atleast 5 characters')
      .isLength({min: 5, max: 400})
      .trim()
  ], 
  adminController.postAddProduct);

router.get('/products', isAuth, adminController.getProducts);

router.get('/edit-product/:productId', isAuth, adminController.getEditProduct);

router.post('/edit-product', isAuth, 
  [
    body('title', 'Title should be atleast 3 character long')
      .isString()
      .isLength({min: 3})
      .trim(),
    body('imageUrl', 'URL should be valid')
      .isURL(), 
    body('price', 'Price should be in decimal')
      .isFloat(),
    body('description', 'Description should be atleast 5 characters')
      .isLength({min: 5, max: 400})
      .trim()
  ],
  adminController.postEditProduct);

router.post('/delete-product', isAuth, adminController.postDeleteProduct);

module.exports = router;
