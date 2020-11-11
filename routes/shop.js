const express = require('express');

const path = require('path');

const rootDir = require('../util/path');

const productsController = require('../controllers/products.js')

const router = express.Router();
const adminData = require('./admin');

router.get('/', productsController.getProducts);

module.exports = router;