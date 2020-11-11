exports.get404 = (req, res, next) => {
  res.status(400).render('404', {pageTitle: '404 page', path: false });
};