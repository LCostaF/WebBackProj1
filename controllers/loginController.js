const fs = require('fs');
const path = require('path');
const {login} = require('../authentication/loginManagement');
const { loginDb } = require('../authentication/bd');

function loginGet(req, res) {
    req.session.loggedIn = false;
    res.render("login");
}

function logoutGet(req, res) {
    req.session.loggedIn = false;
    res.redirect("login");
}

function admPost(req, res) {
    const { login: text, senha: password } = req.body; 
    if (login(text, password)) {
        console.log("true");
        req.session.loggedIn = true;
        req.session.admin = true;
        res.redirect("/");
    } else {
        loginDb(text, password, function(success) {
            if (success) {
                console.log("Login bem-sucedido:");
                req.session.loggedIn = true;
                req.session.admin = false;
                res.redirect("/");
            } else {
                console.log("false");
                res.redirect("login");
            }
        });
    }
}

module.exports = { loginGet, logoutGet, admPost };
