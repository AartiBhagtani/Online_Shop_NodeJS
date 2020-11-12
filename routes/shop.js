const express = require('express');

const path = require('path');

const rootDir = require('../util/path');

const shopController = require('../controllers/shop.js')

const router = express.Router();
const adminData = require('./admin');

router.get('/', shopController.getIndex);

router.get('/products', shopController.getProducts);
// router.get('products');
router.get('/checkcout', shopController.getCheckout);
router.get('/cart', shopController.getCart);
router.get('/order', shopController.getOrder);

module.exports = router;