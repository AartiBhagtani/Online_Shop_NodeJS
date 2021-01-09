const Product = require('../models/product');
const Order = require('../models/order');

exports.getProducts = (req, res, next) => {
  Product.find()
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
  Product.find()
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
  req.user
  .populate('cart.items.productId')
  .execPopulate()
  .then(user => {
    const products = user.cart.items.map(i =>{
      return {quantity: i.quantity, product: { ...i.productId._doc } }
    })
    const order = new Order({
      user: {
        name: req.user.name,
        userId: req.user
      },
      products: products
    })
    return order.save();
  })
  .then(result => {
    return req.user.clearCart();
  })
  .then(() => {
    res.redirect('/orders')
  })
  .catch(err => console.log(err))
}

exports.getOrder = (req, res, next) =>   {
  Order.find({ 'user.userId': req.user._id })
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
  .populate('cart.items.productId')
  .execPopulate()
  .then(user => {
    const products = user.cart.items;
    console.log(products)
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
    .removeFromCart(prodId)
    .then(result => {
       res.redirect('/cart');   
    })
    .catch(err => console.log(err))
}
