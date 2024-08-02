const express = require('express');
const mustacheExpress = require('mustache-express');
const path = require('path');
const session = require('express-session');
require('dotenv').config();
var routes = require('./routes/routes');

const app = express();

// Configure Mustache Express to use .mustache file extension
app.engine('mustache', mustacheExpress(path.join(__dirname, 'views/partials'), '.mustache'));
app.set('view engine', 'mustache');
app.set('views', path.join(__dirname, 'views'));

// Middleware para JSON e URL-encoded bodies
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Configuração da sessão com a chave secreta do .env
app.use(session({
    secret: process.env.SECRET,
    resave: false,
    saveUninitialized: false
}));

// Servindo arquivos estáticos
app.use(express.static(path.join(__dirname, 'public')));

// Rotas
app.use(routes);

app.use((req, res, next) => {
    res.status(404).send('Página não encontrada');
});

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
