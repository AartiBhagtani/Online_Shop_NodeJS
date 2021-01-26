const User = require('../models/user');
const bcrypt = require('bcryptjs');

exports.getLogin = (req, res, next) => {
  // const isLoggedIn = req.get('Cookie').split('=')[1] == 'true';
  let message = req.flash('error');
  message = message.length > 0 ? message[0] : null;
  res.render('auth/login', {
    pageTitle: 'Login', 
    path: '/login',
    errorMessage: message
  });
};

exports.postLogin = (req, res, next) => {
  // res.setHeader('Set-Cookie', 'loggedIn=true; Max-Age=10');
  const email = req.body.email;
  const password = req.body.password;
  
  User.findOne({email: email}) 
  .then((user) => {
    if(!user) {
      req.flash('error', 'Invalid Email or Password');
      return res.redirect('/login');
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
      req.flash('error', 'Invalid Email or Password');
      return res.redirect('/login');
    })
    .catch(err => {
      console.log(err);
      req.flash('error', 'Invalid Email or Password');
      res.redirect('/login');
    })
  })
  .catch((err) => console.log(err));
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

  User.findOne({email: email})
  .then(userDoc => {
    if(userDoc){
      req.flash('error', 'Email already exists, please ping another one!');
      return res.redirect('/signup')
    }
    return bcrypt.hash(password, 12)
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
    })
  })
  .catch(err => console.log(err))
}

exports.getSignup = (req, res, next) => {
  let message = req.flash('error');
  message = message.length > 0 ? message[0] : null;
  res.render('auth/signup', {
    path: '/signup',
    pageTitle: 'Signup',
    errorMessage: message
  })
}
