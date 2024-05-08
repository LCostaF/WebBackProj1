// Programação Web Back-End - Projeto 1
// Grupo:
//  Felippe Machado Nunes de Oliveira   - RA: 2347946
//  Joice Kelly Oliveira Mendes         - RA: 2348020
//  Lucas Costa Fuganti                 - RA: 2209675
//  Marcus Vinícius Molina Freitas      - RA: 2383969

// ---- Arquivo principal do sistema CMS ----

const express = require('express');
const mustacheExpress = require('mustache-express');
const path = require('path');


var routes = require('./routes/routes');

const app = express();

//Criação do env
const { createUser } = require('./authentication/loginManagement');
//createUser("Administrador@gmail.com","adm123");

//Sessão, não trocar essa trecho de lugar. Para evitar erro de seção.
const session = require("express-session")
app.use(session({
    secret: process.env.SECRET,
    resave: false,
    saveUninitialized: false
}));

app.engine('mustache', mustacheExpress());
app.set('view engine', 'mustache');

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.set('views', path.join(__dirname, 'views'));
app.use(express.static(path.join(__dirname, 'public')));
app.use(routes);


//Inicia a conexão com o banco de dados
const { db } = require('./authentication/bd')
db(true);

// Middleware para encerrar a conexão com o banco de dados quando a aplicação é encerrada
process.on('exit', () => {
    db(false);
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
});