const User = require('../models/user');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');

const nodemailer = require('nodemailer');
const sendgridTransport = require('nodemailer-sendgrid-transport');
const { validationResult } = require('express-validator');

const transporter = nodemailer.createTransport(sendgridTransport({
  auth: {
    api_key: process.env.SEND_GRID_API_KEY
  }
}))

exports.getLogin = (req, res, next) => {
  // const isLoggedIn = req.get('Cookie').split('=')[1] == 'true';
  let message = req.flash('error');
  message = message.length > 0 ? message[0] : null;
  res.render('auth/login', {
    pageTitle: 'Login', 
    path: '/login',
    errorMessage: message,
    oldData: {email: '', password: ''}, 
    validationErrors: []
  });
};

exports.postLogin = (req, res, next) => {
  // res.setHeader('Set-Cookie', 'loggedIn=true; Max-Age=10');
  const email = req.body.email;
  const password = req.body.password;
  const errors = validationResult(req);
  
  if(!errors.isEmpty()) {
    console.log(errors.array());
    return res.status(422).render('auth/login', {
      pageTitle: 'Login', 
      path: '/login',
      errorMessage: errors.array()[0].msg,
      oldData: {email: email, password: password},
      validationErrors: errors.array()  
    });
  }
  User.findOne({email: email}) 
  .then((user) => { 
    if(!user) {
      return res.status(422).render('auth/login', {
        pageTitle: 'Login', 
        path: '/login',
        errorMessage: 'Invalid Email or Password', 
        oldData: {email: email, password: password},
        validationErrors: []  
      });
      // req.flash('error', 'Invalid Email or Password');
      // return res.redirect('/login');
    }
    bcrypt.compare(password, user.password)
    .then(doMatch => {
      if(doMatch) {
        req.session.user = new User(user);
        req.session.isLoggedIn = true;
        return req.session.save((err) => {
          console.log(err);
          res.redirect('/');
        })
      }
      return res.status(422).render('auth/login', {
        pageTitle: 'Login', 
        path: '/login',
        errorMessage: 'Invalid Email or Password', 
        oldData: {email: email, password: password},
        validationErrors: []  
      });
      // req.flash('error', 'Invalid Email or Password');
      // return res.redirect('/login');
    })
    .catch(err => {
      console.log(err);
      req.flash('error', 'Invalid Email or Password');
      res.redirect('/login');
    })
  })
  .catch(err => {
    console.log(err);
    const error = new Error(err);
    error.httpStatusCode = 500;
    return next(error);
  });  
}

exports.postLogout = (req, res, next) => {
  req.session.destroy(err => {
    console.log(err);
    
    res.redirect('/');
  })
}

exports.postSignup = (req, res, next) => {
  const email = req.body.email;
  const password = req.body.password;
  const confirmPassword = req.body.confirmPassword;
  const errors = validationResult(req);

  if(!errors.isEmpty()) {
    console.log(errors.array());
    return res.status(422).render('auth/signup', {
      path: '/signup',
      pageTitle: 'Signup',
      errorMessage: errors.array()[0].msg,
      oldData: {email: email, password: password, confirmPassword: req.body.confirmPassword},
      validationErrors: errors.array()  
    });
  }

  bcrypt.hash(password, 12)
  .then(hashedPassword => {
    const user = new User({
      email: email,
      password: hashedPassword,
      cart: {items: []}
    })
    return user.save()
  })
  .then(result => {
    res.redirect('/login')
    return transporter.sendMail({
      to: email,
      from: process.env.SHOP_EMAIL,
      subject: 'Signup Succeeded', 
      html : '<h1>You successfully Signed Up!!</h1>'  
    })
  })
  .catch(err => {
    console.log(err);
    const error = new Error(err);
    error.httpStatusCode = 500;
    return next(error);
  });  
}

exports.getSignup = (req, res, next) => {
  let message = req.flash('error');
  message = message.length > 0 ? message[0] : null;
  res.render('auth/signup', {
    path: '/signup',
    pageTitle: 'Signup',
    errorMessage: message,
    oldData: {email: '', password: '', confirmPassword: ''}, 
    validationErrors: []
  })
}

exports.getResetPassword = (req, res, next) => {
  let message = req.flash('error');
  message = message.length > 0 ? message[0] : null;
  res.render('auth/reset', {
    pageTitle: 'Reset Password', 
    path: '/reset',
    errorMessage: message
  });
}

exports.postResetPassword = (req, res, next) => {
  crypto.randomBytes(32, (err, buffer) => {
    if(err) {
      console.log('err is #{err}');
      return res.redirect('/reset');
    }
    const token = buffer.toString('hex');
    User.findOne({email: req.body.email})
    .then(user => {
      if(!user) {
        req.flash('error', `No account with given email - ${req.body.email} id found`);
        return res.redirect('/reset');
      }
      user.resetToken = token;
      // set expiration to next 1 hour
      user.resetTokenExpiration = Date.now() + 3600000;
      return user.save()
      .then(result => {
        res.redirect('/')
        transporter.sendMail({
          to: req.body.email,
          from: process.env.SHOP_EMAIL,
          subject: 'Password Reset', 
          html : `
            <p>You request for password reset</p>
            <p>Click this <a href='http://localhost:3000/reset/${token}'>link</a> to set your new password</p>
          `
        })
      })
    })  
    .catch(err => {
      console.log(err);
      const error = new Error(err);
      error.httpStatusCode = 500;
      return next(error);
    });  
  })
}

exports.getNewPassword = (req, res, next) => {
  const token = req.params.token;
  User.findOne({resetToken: token, resetTokenExpiration: {$gt: Date.now()}})
  .then(user => {
    if(!user) {
      console.log('user not found with correct token or reset token expired')
      return res.redirect('/');
    }
    let message = req.flash('error');
    message = message.length > 0 ? message[0] : null;
    res.render('auth/new-password', {
      pageTitle: 'New Password', 
      path: '/new-password',
      token: token,
      userId: user._id.toString(),
      errorMessage: message
    });
  })
  .catch(err => {
    console.log(err);
    const error = new Error(err);
    error.httpStatusCode = 500;
    return next(error);
  });  
}

exports.postNewPassword = (req, res, next) => {
  const newPassword = req.body.password;
  const token = req.body.token;
  const userId = req.body.userId;

  let extractedUser; 

  User.findOne({resetToken: token, resetTokenExpiration: {$gt: Date.now()}})
  .then(user => {
    extractedUser = user;
    return bcrypt.hash(newPassword, 12)
    // if(!user) {
    //   console.log('user not found with correct token or reset token expired')
    //   return res.redirect('/');
    // }
  })
  .then(hashedPassword => {
    extractedUser.password = hashedPassword;
    extractedUser.resetToken = undefined;
    extractedUser.resetTokenExpiration = undefined;
    return extractedUser.save();
  })
  .then(result => {
    res.redirect('/login');
  })
  .catch(err => {
    console.log(err);
    const error = new Error(err);
    error.httpStatusCode = 500;
    return next(error);
  });  
}