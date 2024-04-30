// Programação Web Back-End - Projeto 1
// Grupo:
//  Felippe Machado Nunes de Oliveira   - RA: 2347946
//  Joice Kelly Oliveira Mendes         - RA: 2348020
//  Lucas Costa Fuganti                 - RA: 2209675
//  Marcus Vinícius Molina Freitas      - RA: 2383969

// ---- Arquivo principal do sistema CMS ----

//Requires gerais
const path = require("path")
require("dotenv").config()

//Express
const express = require('express')
const app = express()
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')))

//Template
var mustacheExpress = require("mustache-express");
var engine = mustacheExpress()
app.engine("mustache", engine);
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "mustache");

//Cookies
const cookieParser = require("cookie-parser")
app.use(cookieParser())


//Sessão
const session = require("express-session")
app.use(session({
    secret: process.env.SECRET,
    resave: false,
    saveUninitialized: false
}));

app.use("/", require('./controls/routes-main'))

app.listen(process.env.PORT, () => {
    console.log("Running...")
})