const express = require('express');

const path = require('path');

const rootDir = require('../util/path');

const shopController = require('../controllers/shop.js')

const router = express.Router();
const adminData = require('./admin');

router.get('/', shopController.getIndex);

router.get('/products', shopController.getProducts);

router.get('/checkcout', shopController.getCheckout);

router.get('/cart', shopController.getCart);

router.post('/cart', shopController.postCart);

router.get('/orders', shopController.getOrder);

router.get('/products/:productId', shopController.getProduct);

router.post('/cart-delete-item', shopController.postCartDeleteProduct);

router.post('/create-order', shopController.postOrder);

module.exports = router;