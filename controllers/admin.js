const Product = require('../models/product');

exports.postAddProduct = (req, res, next) => {
  const title = req.body.title;
  const imageUrl = req.body.imageUrl;
  const price = req.body.price;
  const description = req.body.description;
  const product = new Product({title: title, price: price, description: description, imageUrl: imageUrl, userId: req.user._id})
  .save()
    .then(result => {
      res.redirect('/admin/products');
      console.log(result);
    })
    .catch(err => console.log(err));
};

exports.getAddProduct = (req, res, next) => {
    res.render('admin/edit-product', {
      pageTitle: 'Add Products', 
      path: '/admin/add-product', 
      editing: false,
      isAuthenticated: req.isLoggedIn
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
      product: product,
      isAuthenticated: req.isLoggedIn
    });
  })
  .catch(err => {console.log(err)});
};

exports.postEditProduct = (req, res, next) => {
  const productId = req.body.productId;
  const updatedTitle = req.body.title;
  const updatedImageURL = req.body.imageUrl;
  const updatedPrice = req.body.price;  
  const updatedDescription = req.body.description;

  Product.findById(productId)
  .then(product => {
    product.title = updatedTitle;
    product.price = updatedPrice;
    product.description = updatedDescription;
    product.imageUrl = updatedImageURL;
    return product.save()
  })
  .then(result => {
    console.log(result)
    res.redirect('/admin/products')
  })
  .catch(err => {console.log(err)});  
};

exports.postDeleteProduct = (req, res, next) => {
  const productId = req.body.productId;
  Product.findByIdAndRemove (productId)
  .then(() => {
    console.log('Destroyed product');
    res.redirect('/admin/products');
  })
  .then(result => console.log(result))
  .catch(err => {console.log(err)});
};

exports.getProducts = (req, res, next) => {
  Product.find()
  // .select('title price -_id')
  // .populate('userId', 'name')
  .then(products => {
    res.render('admin/products',{
      prods: products, 
      pageTitle: 'Admin Products', 
      path: '/admin/products', 
      isAuthenticated: req.isLoggedIn
    });
  })
  .catch(err => {console.log(err)});
};
