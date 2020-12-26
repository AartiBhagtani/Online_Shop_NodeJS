const express = require('express');
const bodyParser = require('body-parser')
// const expressHbs = require('express-handlebars');

const path = require('path');

const app = express();

const productsController = require('./controllers/error.js')
// app.engine('hbs', expressHbs({layoutsDir: 'views/layouts/', defaultLayout: 'main-layouts', extname: 'hbs'}));

app.set('view engine', 'ejs');
app.set('views', 'views');

const shopRoutes = require('./routes/shop')
const adminRoutes = require('./routes/admin')
const db = require('./util/database')


app.use(bodyParser.urlencoded({extended: false}));
app.use(express.static(path.join(__dirname, 'public')));

app.use('/admin', adminRoutes);
app.use(shopRoutes);

app.use(productsController.get404);

app.listen(3000);
