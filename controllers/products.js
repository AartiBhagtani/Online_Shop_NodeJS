const Product = require('../models/product');

exports.getAddProduct = (req, res, next) => {
    res.render('add-product', 
    {pageTitle: 'Add Products', 
    path: '/admin/add-product',
    productCSS: true,
    activeProduct: true
    });
};

exports.postAddProduct = (req, res, next) => {
    const product = new Product(req.body.title);
    product.save(); 
    // console.log(req.body);
    res.redirect('/');
};

exports.getProducts = (req, res, next) => {
    Product.fetchAll( (products) => {
      res.render('shop',
      {prods: products, 
      pageTitle: 'Shop', 
      path: '/', 
      hasProducts: products.length > 0,
      productCSS: true,
      activeProduct: true
      });
    });
};