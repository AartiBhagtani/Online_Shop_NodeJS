const Product = require('../models/product');

exports.postAddProduct = (req, res, next) => {
  const title = req.body.title;
  const imageUrl = req.body.imageUrl;
  const price = req.body.price;
  const description = req.body.description;
  const product = new Product(null, title, imageUrl, description, price);
  product
    .save()
    .then(() => {
      res.redirect('/');
    })
    .catch(err => console.log(err));
};

exports.getAddProduct = (req, res, next) => {
    res.render('admin/edit-product', {
      pageTitle: 'Add Products', 
      path: '/admin/add-product', 
      editing: false,
    });
};

exports.getEditProduct = (req, res, next) => {
  const editMode = req.query.edit;
  if(!editMode) {
    return res.redirect('/');
  }
  const prodId = req.params.productId;

  Product.findById(prodId, product => {
      if (!product) {
        return res.redirect('/');
      }
      res.render('admin/edit-product', {
      pageTitle: 'Edit Products', 
      path: '/admin/edit-product',
      editing: true,
      product: product
    });
  });
};

exports.postEditProduct = (req, res, next) => {
  const productId = req.body.productId;
  const updatedTitle = req.body.title;
  const updatedImageURL = req.body.imageUrl;
  const updatedPrice = req.body.price;
  const updatedDescription = req.body.description;
  const updatedProduct = new Product(productId, updatedTitle, updatedImageURL, updatedPrice, updatedDescription);
  updatedProduct.save(); 
  // console.log(req.body);
  res.redirect('/admin/products');
};

exports.postDeleteProduct = (req, res, next) => {
  const productId = req.body.productId;
  // Product.deleteById(productId, (product) => {
  //   res.redirect('/admin/products');
  // });
  Product.deleteById(productId);
  res.redirect('/admin/products');
};

exports.getProducts = (req, res, next) => {
  Product.fetchAll( (products) => {
    res.render('admin/products',{
      prods: products, 
      pageTitle: 'Admin Products', 
      path: '/admin/products', 
      });
    });
  };
