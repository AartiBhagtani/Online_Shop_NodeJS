const Product = require('../models/product');

exports.getProducts = (req, res, next) => {
  Product.fetchAll()
  .then(products => {
    res.render('shop/product-list', {
    prods: products, 
    pageTitle: 'Shop', 
    path: '/products', 
    })
  })
  .catch(err => {console.log(err)});
};  

exports.getProduct = (req, res, next) => {
  const productId = req.params.productId
  Product.findById
  (productId)
  .then((product) => {
    console.log(product)
    res.render('shop/product-detail', {
      product: product, 
      pageTitle: 'Product Details', 
      path: '/products', 
    });
  })
  .catch(err => {console.log(err)});
};
 
exports.getIndex = (req, res, next) => {
  Product.fetchAll()
  .then(products => {
    res.render('shop/index',{
      prods: products, 
      pageTitle: 'Index', 
      path: '/', 
      })
  })
  .catch(err => {console.log(err)});
 };  

// exports.getCheckout = (req, res, next) => {
//   res.render('shop/checkout', {
//     pageTitle: 'Checkout',
//     path: '/checkout'
//   });
// };

exports.postOrder = (req, res, next) => {
  let fetchedCart;
  req.user.addOrder( )
    .then(result => {
      res.redirect('/orders')
    })
    .catch(err => console.log(err))
}

exports.getOrder = (req, res, next) =>   {
  req.user
    .getOrders()
    .then(orders => {
      console.log(orders);
      res.render('shop/orders', {
        pageTitle: 'Orders',
        path: '/orders',
        orders: orders
      });
    })
    .catch(err => {
      console.log(err);
    })
};

exports.getCart = (req, res, next) => {
  req.user
  .getCart()
  .then(products => {
    res.render('shop/cart', {
      pageTitle: 'Cart',
      path: '/cart', 
      products: products
    })
  })   
  .catch(err => {console.log(err)})
};

exports.postCart = (req, res, next) => {
  const prodId = req.body.productId;
  Product.findById(prodId)
  .then(product => {
    return req.user.addToCart(product);
  })
  .then(result => {
    console.log(result)
    res.redirect('/cart');
  })
  .catch(err => console.log(err));
};

exports.postCartDeleteProduct = (req, res, next) => {
  const prodId = req.body.productId;
  req.user
    .deleteItemFromCart(prodId)
    .then(result => {
       res.redirect('/cart');   
    })
    .catch(err => console.log(err))
}
