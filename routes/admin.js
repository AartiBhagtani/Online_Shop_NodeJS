const express = require('express');

const path = require('path');

const rootDir = require('../util/path.js')

const adminController = require('../controllers/admin.js')

const router = express.Router();

// starts with /admin

router.get('/add-product', adminController.getAddProduct);

router.post('/add-product', adminController.postAddProduct);

router.get('/products', adminController.getProducts);

router.get('/edit-product/:productId', adminController.getEditProduct);

router.post('/edit-product', adminController.postEditProduct);

router.post('/delete-product', adminController.postDeleteProduct);

module.exports = router;
