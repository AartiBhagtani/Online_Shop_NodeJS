const Product = require('../models/product');
const { validationResult } = require('express-validator');

exports.postAddProduct = (req, res, next) => {
  const title = req.body.title;
  const imageUrl = req.body.imageUrl;
  const price = req.body.price;
  const description = req.body.description;
  const errors = validationResult(req);

  if(!errors.isEmpty()) {
    console.log(errors.array());
    return res.status(422).render('admin/edit-product', {
      pageTitle: 'Add Products', 
      path: '/admin/edit-product', 
      editing: false,
      hasError: true,
      errorMessage: errors.array()[0].msg,
      product: {title: title, imageUrl: imageUrl, price: price, description: description},
      validationErrors: errors.array()
    });
  }
  const product = new Product({title: title, price: price, description: description, imageUrl: imageUrl, userId: req.user._id})
  .save()
    .then(result => {
      res.redirect('/admin/products');
      console.log(result);
    })
    .catch(err => {
      // res.redirect('/500');
      console.log(err);
      const error = new Error(err);
      error.httpStatusCode = 500;
      return next(error);
    });
};

exports.getAddProduct = (req, res, next) => {
    // if(!req.session.isLoggedIn) {
    //   return res.redirect('/login')
    // }
    res.render('admin/edit-product', {
      pageTitle: 'Add Products', 
      path: '/admin/add-product', 
      editing: false,
      errorMessage: null,
      hasError: false,
      validationErrors: []
    });
};

exports.getEditProduct = (req, res, next) => {
  const editMode = req.query.edit;
  if(!editMode) {
    return res.redirect('/');
  }
  const prodId = req.params.productId;

  Product.findById(prodId)
  .then(product => {
    if (!product) {
        return res.redirect('/');
      }
      res.render('admin/edit-product', {
      pageTitle: 'Edit Products', 
      path: '/admin/edit-product',
      editing: true,
      hasError: false,
      errorMessage: null,
      product: product,
      validationErrors: []
    });
  })
  .catch(err => {
    console.log(err);
    const error = new Error(err);
    error.httpStatusCode = 500;
    return next(error);
  });  
};

exports.postEditProduct = (req, res, next) => {
  const productId = req.body.productId;
  const updatedTitle = req.body.title;
  const updatedImageURL = req.body.imageUrl;
  const updatedPrice = req.body.price;  
  const updatedDescription = req.body.description;

  const errors = validationResult(req);

  if(!errors.isEmpty()) {
    console.log(errors.array());
    return res.status(422).render('admin/edit-product', {
      pageTitle: 'Add Products', 
      path: '/admin/edit-product', 
      editing: false,
      hasError: true,
      errorMessage: errors.array()[0].msg,
      product: {title: updatedTitle, imageUrl: updatedImageURL, price: updatedPrice, description: updatedDescription, _id: productId},
      validationErrors: errors.array()
    });
  }

  Product.findById(productId)
  .then(product => {
    // throw new Error('Dummy');  
    if(product.userId.toString() !== req.user._id.toString()) {
      console.log('Cannoto update as book was not found');
      return res.redirect('/');
    }
    product.title = updatedTitle;
    product.price = updatedPrice;
    product.description = updatedDescription;
    product.imageUrl = updatedImageURL;

    console.log(product.title);
    return product.save()
      .then(result => {
      console.log(result)
      res.redirect('/admin/products')
    })
  })
  .catch(err => {
    console.log(err);
    const error = new Error(err);
    error.httpStatusCode = 500;
    return next(error);
  });  
};

exports.postDeleteProduct = (req, res, next) => {
  const productId = req.body.productId;
  Product.deleteOne({_id: productId, userId: req.user._id})
  .then(() => {
    console.log('Destroyed product');
    res.redirect('/admin/products');
  })
  .then(result => console.log(result))
  .catch(err => {
    console.log(err);
    const error = new Error(err);
    error.httpStatusCode = 500;
    return next(error);
  });  
};

exports.getProducts = (req, res, next) => {
  Product.find({userId: req.user._id})
  // .select('title price -_id')
  // .populate('userId', 'name')
  .then(products => {
    res.render('admin/products',{
      prods: products, 
      pageTitle: 'Admin Products', 
      path: '/admin/products'
    });
  })
  .catch(err => {
    console.log(err);
    const error = new Error(err);
    error.httpStatusCode = 500;
    return next(error);
  });  
};
