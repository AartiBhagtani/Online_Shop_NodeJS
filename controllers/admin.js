const Product = require('../models/product');

exports.postAddProduct = (req, res, next) => {
  const title = req.body.title;
  const description = req.description;
  const price = req.body.price;
  const imageUrl = req.body.imageUrl;
  const product = new Product(title, imageUrl, price, description);
  product.save(); 
  // console.log(req.body);
  res.redirect('/');
};

exports.getAddProduct = (req, res, next) => {
    res.render('admin/add-product', {
      pageTitle: 'Add Products', 
      path: '/admin/add-product'
    });
};

exports.getProducts = (req, res, next) => {
  res.render('admin/products', {
      pageTitle: 'Admin Products', 
      path: '/admin/products'
  });
};
