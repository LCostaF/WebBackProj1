const fs = require('fs');
const path = require('path');
const {login} = require('../java/loginManagement');
const { loginDb } = require('../java/bd');

function loginGet(req, res) {
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
        res.redirect("/");
    } else {
        loginDb(text, password, function(success) {
            if (success) {
                console.log("Login bem-sucedido:");
                req.session.loggedIn = true;
                res.redirect("/");
            } else {
                console.log("false");
                res.redirect("login");
            }
        });
    }
}

module.exports = { loginGet, logoutGet, admPost };
