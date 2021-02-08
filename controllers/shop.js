const Product = require('../models/product');
const Order = require('../models/order');
const fs = require('fs');
const path = require('path');
const PDFDocument = require('pdfkit');

const ITEMS_PER_PAGE = 2;

exports.getProducts = (req, res, next) => {
let totalItems;
  const page = +req.query.page || 1;
  Product.find().countDocuments()
  .then(numProducts => {
    totalItems = numProducts;
    return Product.find()
    .skip((page - 1) * ITEMS_PER_PAGE)
    .limit(ITEMS_PER_PAGE)
  })
  .then(products => {
    res.render('shop/product-list',{
        prods: products, 
        pageTitle: 'Shop', 
        path: '/products',
        csrfToken: req.csrfToken(),
        currentPage: page,
        hasNextPage: ITEMS_PER_PAGE * page < totalItems,
        hasPreviousPage: page > 1,
        previousPage: page - 1,
        nextPage: page + 1,
        lastPage: Math.ceil(totalItems / ITEMS_PER_PAGE)
    })
  })
  .catch(err => {
    console.log(err);
    const error = new Error(err);
    error.httpStatusCode = 500;
    return next(error);
  });
  // Product.find()
  // .then(products => {
  //   res.render('shop/product-list', {
  //     prods: products, 
  //     pageTitle: 'Shop', 
  //     path: '/products'
  //   })
  // })
  // .catch(err => {
  //   console.log(err);
  //   const error = new Error(err);
  //   error.httpStatusCode = 500;
  //   return next(error);
  // });  
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
      path: '/products'
    });
  })
  .catch(err => {
    console.log(err);
    const error = new Error(err);
    error.httpStatusCode = 500;
    return next(error);
  });  
};
 
exports.getIndex = (req, res, next) => {
  let totalItems;
  const page = +req.query.page || 1;
  Product.find().countDocuments()
  .then(numProducts => {
    totalItems = numProducts;
    return Product.find()
    .skip((page - 1) * ITEMS_PER_PAGE)
    .limit(ITEMS_PER_PAGE)
  })
  .then(products => {
    res.render('shop/index',{
        prods: products, 
        pageTitle: 'Index', 
        path: '/',
        csrfToken: req.csrfToken(),
        currentPage: page,
        hasNextPage: ITEMS_PER_PAGE * page < totalItems,
        hasPreviousPage: page > 1,
        previousPage: page - 1,
        nextPage: page + 1,
        lastPage: Math.ceil(totalItems / ITEMS_PER_PAGE)
      })
  })
  .catch(err => {
    console.log(err);
    const error = new Error(err);
    error.httpStatusCode = 500;
    return next(error);
  });  
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
        email: req.user.email, 
        userId: req.session.user
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
  .catch(err => {
    console.log(err);
    const error = new Error(err);
    error.httpStatusCode = 500;
    return next(error);
  });  
}

exports.getOrder = (req, res, next) =>   {
  Order.find({ 'user.userId': req.session.user._id })
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
    const error = new Error(err);
    error.httpStatusCode = 500;
    return next(error);
  });  
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
  .catch(err => {
    console.log(err);
    const error = new Error(err);
    error.httpStatusCode = 500;
    return next(error);
  });  
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
  .catch(err => {
    console.log(err);
    const error = new Error(err);
    error.httpStatusCode = 500;
    return next(error);
  });  
};

exports.postCartDeleteProduct = (req, res, next) => {
  const prodId = req.body.productId;
  req.user
    .removeFromCart(prodId)
    .then(result => {
       res.redirect('/cart');   
    })
    .catch(err => {
      console.log(err);
      const error = new Error(err);
      error.httpStatusCode = 500;
      return next(error);
    });  
}

exports.getInvoice = (req, res, next) => {
  const orderId = req.params.orderId; 
  Order.findById(orderId).then(order => {
    if(!order) {
      return next(new Error('No order found.'));
    }
    if(order.user.userId.toString() !== req.user._id.toString()) {
      return next(new Error('Unauthorized.')); 
    }
    const invoiceName = 'invoice-' + orderId + '.pdf';
    const invoicePath = path.join('data', 'invoices', invoiceName);
    // -------here we are reading all data from pdf and storing in memory first and thenn browser renders it from memory 
    // -------this will slow down our server when we have multi requests of very big files.
    // -------pre-loaded data
    // fs.readFile(invoicePath, (err, data) => {
    //   if(err) {
    //     return next(err);
    //   }
    //   res.setHeader('Content-Type', 'application/pdf');
    //   res.setHeader('Content-Disposition', 'inline; filename="' + invoiceName + '"')
    //   res.send(data);
    // });

    // -------streamed data
    // const file = fs.createReadStream(invoicePath);
    // res.setHeader('Content-Type', 'application/pdf');
    // res.setHeader('Content-Disposition', 'inline; filename= "' + invoiceName + '"');
    // file.pipe(res);

    // -------generating dynamic pdf
    const pdfDoc = new PDFDocument();
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', 'inline; filename= "' + invoiceName + '"');
    pdfDoc.pipe(fs.createWriteStream(invoicePath));
    pdfDoc.pipe(res);

    pdfDoc.fontSize(26).text('Invoice', {
      underline: false
    })
    pdfDoc.fontSize(14).text('___________________________');
    let totalPrice = 0; 
    order.products.forEach(prod => {
      totalPrice += prod.quantity * prod.product.price;
      pdfDoc.text(prod.product.title + ' - ' + prod.quantity + ' * ' + prod.product.price);
    })
    pdfDoc.fontSize(14).text('___________________________');
    pdfDoc.fontSize(20).text('Total Price $' + totalPrice);
    pdfDoc.end();
  })
  .catch(err => next(err));
}