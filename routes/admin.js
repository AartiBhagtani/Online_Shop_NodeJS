const express = require('express');

const path = require('path');

const rootDir = require('../util/path.js')

const router = express.Router();

const products = [];

router.get('/add-product', (req, res, next) => {
    console.log('add product');
    res.render('add-product', 
    {pageTitle: 'Add Products', 
    path: '/admin/add-product',
    productCSS: true,
    activeProduct: true})
});

router.post('/add-product',(req, res, next) => {
    products.push({title: req.body.title});
    console.log(req.body);
    res.redirect('/');
});

exports.routes = router; 
exports.products = products; 
