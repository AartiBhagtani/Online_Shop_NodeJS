const express = require('express');

const path = require('path');

const rootDir = require('../util/path');

const shopController = require('../controllers/shop.js')
const isAuth = require('../middleware/is-auth');

const router = express.Router();
const adminData = require('./admin');

router.get('/', shopController.getIndex);

router.get('/products', shopController.getProducts);

// router.get('/checkcout', shopController.getCheckout);

router.get('/cart', isAuth, shopController.getCart);

router.post('/cart', isAuth, shopController.postCart);

router.get('/products/:productId', isAuth, shopController.getProduct);

router.post('/cart-delete-item', isAuth, shopController.postCartDeleteProduct);

router.get('/orders', isAuth, shopController.getOrder);

router.post('/create-order', isAuth, shopController.postOrder);

router.get('/orders/:orderId', isAuth, shopController.getInvoice);

module.exports = router;