const express = require('express');

const path = require('path');

const rootDir = require('../util/path.js')

const adminController = require('../controllers/admin.js')

const router = express.Router();

// starts with /admin

router.get('/add-product', adminController.getAddProduct);

router.post('/add-product', adminController.postAddProduct);

router.get('/products', adminController.getProducts)

module.exports = router;
