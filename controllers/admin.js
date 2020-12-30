const Product = require('../models/product');

exports.postAddProduct = (req, res, next) => {
  const title = req.body.title;
  const imageUrl = req.body.imageUrl;
  const price = req.body.price;
  const description = req.body.description;
  req.user.createProduct({
    title: title, 
    imageUrl: imageUrl,
    price: price,
    description: description
  })
  .then(result => {
    res.redirect('/products');
    console.log(result);
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

  req.user
  .getProducts({where: {id: prodId}})
  // Product.findByPk()
  .then(products => {
    const product = products[0];
    if (!product) {
        return res.redirect('/');
      }
      res.render('admin/edit-product', {
      pageTitle: 'Edit Products', 
      path: '/admin/edit-product',
      editing: true,
      product: product
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
  Product.findByPk(productId)
  .then(product => {
    product.title = updatedTitle,
    product.imageUrl = updatedImageURL,
    product.price = updatedPrice,
    product.description = updatedDescription
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
  Product.findByPk(productId)
  .then(product => {
    product.destroy();
    res.redirect('/admin/products');
  })
  .then(result => console.log(result))
  .catch(err => {console.log(err)});
};

exports.getProducts = (req, res, next) => {
  req.user
  .getProducts()
  .then(products => {
    res.render('admin/products',{
    prods: products, 
    pageTitle: 'Admin Products', 
    path: '/admin/products', 
    });
  })
  .catch(err => {console.log(err)});
};
