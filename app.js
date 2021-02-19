const express = require('express');
const bodyParser = require('body-parser')
const session = require('express-session');
const mongoose = require('mongoose');
const csrf = require('csurf');
const path = require('path');
const flash = require('connect-flash');
const MongoDBStore = require('connect-mongodb-session')(session);
const multer = require('multer');

require('dotenv').config();

// const expressHbs = require('express-handlebars');

const MONGODB_URI = 'mongodb+srv://aarti:GOMongo890@cluster0.k8mns.mongodb.net/shop?retryWrites=true&w=majority'

const app = express();
const store = new MongoDBStore({
  uri: MONGODB_URI,
  collection: 'sessions'
})

const csrfProtection = csrf();

const errorController = require('./controllers/error.js')
// app.engine('hbs', expressHbs({layoutsDir: 'views/layouts/', defaultLayout: 'main-layouts', extname: 'hbs'}));

app.set('view engine', 'ejs');
app.set('views', 'views');

const shopRoutes = require('./routes/shop');
const authRoutes = require('./routes/auth');
const adminRoutes = require('./routes/admin');
const User = require('./models/user');

const fileStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'images');
  },
  filename: (req, file, cb) => {
    cb(null, new Date().toISOString() + '-' + file.originalname);
  }
}) 

const fileFilter = (req, file, cb) => {
  if (
    file.mimetype === 'image/png' || 
    file.mimetype === 'image/jpg' || 
    file.mimetype === 'image/jpeg' 
    ){
      cb(null, true);
    } else {
    cb(null, false);
  }
}

app.use(bodyParser.urlencoded({extended: false}));
app.use(multer({storage: fileStorage, fileFilter: fileFilter}).single('image'));
app.use(express.static(path.join(__dirname, 'public')));
app.use('/images', express.static(path.join(__dirname, 'images')));

app.use(
  session({secret: 'my secret', resave: false, saveUninitialized: false, store: store})
)

app.use(csrfProtection);
app.use(flash());

app.use((req, res, next) => {
  res.locals.isAuthenticated = req.session.isLoggedIn;
  res.locals.csrfToken = req.csrfToken();
  next();
});

app.use((req, res, next) => {
  if(!req.session.user) {
    return next();
  }
  User.findById(req.session.user._id)
  .then((user) => {
    if(!user) {
      return next();
    }
    req.user = user
    next();
  })
  .catch((err) => {
    next(new Error(err));
    // throw new Error(err);
  });
});

app.use('/admin', adminRoutes);
app.use(shopRoutes);
app.use(authRoutes);

app.get('/500', errorController.get500);

app.use(errorController.get404);

app.use((error, req, res, next) => {
  console.log(error);
  // res.status(error.httpStatusCode).render(...)
  res.status(500).render('500', {
    pageTitle: 'Error',
    path: '/500',
    isAuthenticated: req.session.isLoggedIn
  })
})

mongoose.connect(MONGODB_URI,{useUnifiedTopology: true, useNewUrlParser: true})
  .then(result => {
    // console.log(err)
    console.log('connected');
    // User.findOne().then(user => {
    //   if(!user) {
    //     const user = new User({
    //     name: 'aarti',
    //     email: 'aarti@test.com',
    //     cart: {items: []}
    //   })
    //   user.save()
    //   }
    // })
    app.listen(3000);
  })
  .catch(err => console.log(err));
