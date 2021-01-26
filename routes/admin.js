const express = require('express');

const path = require('path');

const rootDir = require('../util/path.js')

const adminController = require('../controllers/admin.js')
const isAuth = require('../middleware/is-auth');

const router = express.Router();

// starts with /admin

router.get('/add-product', isAuth, adminController.getAddProduct);

router.post('/add-product', isAuth, adminController.postAddProduct);

router.get('/products', isAuth, adminController.getProducts);

router.get('/edit-product/:productId', isAuth, adminController.getEditProduct);

router.post('/edit-product', isAuth, adminController.postEditProduct);

router.post('/delete-product', isAuth, adminController.postDeleteProduct);

module.exports = router;
