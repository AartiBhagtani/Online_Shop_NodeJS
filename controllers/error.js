exports.get404 = (req, res, next) => {
  res.status(400).render('404', {
    pageTitle: '404 page', 
    path: '/400',
    isAuthenticated: req.session.isLoggedIn
  });
};

// not useful
exports.get500 = (req, res, next) => {
  res.status(500).render('500', {
    pageTitle: 'Error',
    path: '/500',
    isAuthenticated: req.session.isLoggedIn
  })
}