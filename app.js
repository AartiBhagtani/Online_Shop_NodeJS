const express = require('express');
const bodyParser = require('body-parser')
// const expressHbs = require('express-handlebars');

const mongoose = require('mongoose');
const path = require('path');

const app = express();

const productsController = require('./controllers/error.js')
// app.engine('hbs', expressHbs({layoutsDir: 'views/layouts/', defaultLayout: 'main-layouts', extname: 'hbs'}));

app.set('view engine', 'ejs');
app.set('views', 'views');

const shopRoutes = require('./routes/shop');
const adminRoutes = require('./routes/admin');
const User = require('./models/user');

app.use(bodyParser.urlencoded({extended: false}));
app.use(express.static(path.join(__dirname, 'public')));

app.use((req, res, next) => {
  User.findById('5ff1ec3c3200c31ef35c1646')
  .then((user) => {
    req.user = new User(user);
    next();
  })
  .catch((err) => console.log(err));
});

app.use('/admin', adminRoutes);
app.use(shopRoutes);

app.use(productsController.get404);

mongoose.connect('mongodb+srv://aarti:GOMongo890@cluster0.k8mns.mongodb.net/shop?retryWrites=true&w=majority', {useUnifiedTopology: true, useNewUrlParser: true})
  .then(result => {
    console.log('connected');
    User.findOne().then(user => {
      if(!user) {
        const user = new User({
        name: 'aarti',
        email: 'aarti@test.com',
        cart: {items: []}
      })
      user.save()
      }
    })
    app.listen(3000);
  })
  .catch(err => console.log(err));