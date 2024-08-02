function isAuthenticated(req, res, next) {
  if (req.session.admin) {
    return next();
  }
  res.redirect('/login');
}

function authLogin(req, res, next) {
  // Verifica se a sessão está definida e se o usuário está logado
  if (req.session && req.session.loggedIn) {
      // Se o usuário estiver logado, redirecione para a página principal ou outra página desejada
      return res.redirect('/');
  } else {
      // Se o usuário não estiver logado, permita o acesso à página de login
      next();
  }
}


module.exports = { isAuthenticated, authLogin };
