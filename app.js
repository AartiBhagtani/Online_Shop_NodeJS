const express = require('express');
const bodyParser = require('body-parser')
const path = require('path');

const app = express();

const shopRoutes = require('./routes/shop')
const adminData = require('./routes/admin')

app.use(bodyParser.urlencoded({extended: false}));
app.use(express.static(path.join(__dirname, 'public')));

app.use('/admin', adminData.routes);
app.use(shopRoutes);

app.use((req, res, next) => {
  res.status(400).sendFile(path.join(__dirname, 'views', '404.html'));
});

app.listen(3000);
