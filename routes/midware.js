function checkLogin(req, res, next) {
    // Verifica se a sessão está definida e se o usuário está logado
    if (req.session && req.session.loggedIn) {
        // Se o usuário estiver logado, permita o acesso à página 
        next();
    } else {
        // Se o usuário não estiver logado, redirecione para o Login
        return res.redirect('/');
    }
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


module.exports = { checkLogin, authLogin };