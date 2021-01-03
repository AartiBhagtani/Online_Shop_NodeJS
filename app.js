const express = require('express');
const bodyParser = require('body-parser')
// const expressHbs = require('express-handlebars');

const path = require('path');

const app = express();

const productsController = require('./controllers/error.js')
// app.engine('hbs', expressHbs({layoutsDir: 'views/layouts/', defaultLayout: 'main-layouts', extname: 'hbs'}));

app.set('view engine', 'ejs');
app.set('views', 'views');

const shopRoutes = require('./routes/shop');
const adminRoutes = require('./routes/admin');
const mongoConnect = require('./util/database').mongoConnect; 
const User = require('./models/user');

app.use(bodyParser.urlencoded({extended: false}));
app.use(express.static(path.join(__dirname, 'public')));

app.use((req, res, next) => {
  User.findById('5ff0d308985e994433f1ddb6')
  .then((user) => {
    if (!user.cart) {
      console.log("No cart.");
      user.cart = { items: [] };
    }
    console.log(user._id);
    req.user = new User(user.name, user.email, user.cart, user._id);
    next();
  })
  .catch((err) => console.log(err));
});

app.use('/admin', adminRoutes);
app.use(shopRoutes);

app.use(productsController.get404);

mongoConnect( () => { 
  app.listen(3000);
});