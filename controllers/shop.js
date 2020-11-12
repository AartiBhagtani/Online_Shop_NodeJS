const Product = require('../models/product');

exports.getProducts = (req, res, next) => {
    Product.fetchAll( (products) => {
      res.render('shop/product-list', {
      prods: products, 
      pageTitle: 'Shop', 
      path: '/products', 
      });
    });
  };

exports.getIndex = (req, res, next) => {
  Product.fetchAll( (products) => {
    res.render('shop/index',{
      prods: products, 
      pageTitle: 'Index', 
      path: '/', 
      });
    });
  };

exports.getCheckout = (req, res, next) => {
  res.render('shop/checkout', {
    pageTitle: 'Checkout',
    path: '/checkout'
  });
};

exports.getOrder = (req, res, next) =>   {
  res.render('shop/order', {
    pageTitle: 'Orders',
    path: '/order'
  });
};

exports.getCart = (req, res, next) => {
  res.render('shop/cart', {
    pageTitle: 'Cart',
    path: '/cart'
  });
};