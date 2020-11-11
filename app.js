const express = require('express');
const bodyParser = require('body-parser')
const expressHbs = require('express-handlebars');

const path = require('path');

const app = express();

app.engine('hbs', expressHbs({layoutsDir: 'views/layouts/', defaultLayout: 'main-layouts', extname: 'hbs'}));

app.set('view engine', 'hbs');
app.set('views', 'views');

const shopRoutes = require('./routes/shop')
const adminData = require('./routes/admin')

app.use(bodyParser.urlencoded({extended: false}));
app.use(express.static(path.join(__dirname, 'public')));

app.use('/admin', adminData.routes);
app.use(shopRoutes);

app.use((req, res, next) => {
  res.status(400).render('404', {pageTitle: '404 page'});
});

app.listen(3000);
