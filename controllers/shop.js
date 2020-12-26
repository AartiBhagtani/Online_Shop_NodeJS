const Product = require('../models/product');
const Cart = require('../models/cart');

exports.getProducts = (req, res, next) => {
  Product.fetchAll()
    .then(([rows, fieldData]) => {
      res.render('shop/product-list', {
        prods: rows, 
        pageTitle: 'Shop', 
        path: '/products', 
        });
    })
    .catch(err => console.log(err));
  };

exports.getProduct = (req, res, next) => {
  const productId = req.params.productId
  Product.findById(productId)
  .then(([product]) => {
    console.log(product)
    res.render('shop/product-detail', {
      product: product[0], 
      pageTitle: 'Product Details', 
      path: '/products', 
    });
  })
  .catch(err => console.log(err));
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

 
exports.getIndex = (req, res, next) => {
  Product.fetchAll()
    .then(([rows, fieldData]) => {
      console.log(rows);
      res.render('shop/index',{ 
        prods: rows, 
        pageTitle: 'Index', 
        path: '/', 
      });
    })
    .catch(err => console.log(err));
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
  Cart.getCart(cart => {
    Product.fetchAll(products => {
      const cartProducts = [];
      for (product of products) {
        const cartProductData = cart.products.find(prod => prod.id === product.id);
        if (cartProductData) {
          cartProducts.push({productData: product, qty: cartProductData.qty}); 
        } 
      }
    });
    res.render('shop/cart', {
      pageTitle: 'Cart',
      path: '/cart', 
      products: cartProducts
    });
  }); 
};

exports.postCart = (req, res, next) => {
  const prodId = req.body.productId;
  Product.findById(prodId, product => {
    Cart.addProduct(prodId, product.price);
  }); 
  res.redirect('/cart');
};