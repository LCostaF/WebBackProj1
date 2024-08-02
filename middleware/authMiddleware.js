function isAuthenticated(req, res, next) {
  if (req.session.admin) {
    return next();
  }
  res.redirect('/login');
}

module.exports = { isAuthenticated };
