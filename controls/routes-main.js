// ---- Arquivo para rotas principais do sistema ----

const cookieParser = require('cookie-parser');
const express = require('express')
const router = express.Router()

// --- Essas rotas iniciais não exigem que o usuário esteja logado ---

// Rota para a página inicial do CMS
router.get("/", (req, res) => {
    let args = {
        'cor': req.cookies.cor || "white",
        'usuario': req.session.usuario,
        'coisas': req.session.data,
    }
    res.render("index");
});

// Rota para a visualização de um waffle
router.get("/ver-waffle/:waffle", (req,res) => {
    res.render("ver-waffle");
});


// --- A partir deste ponto, todas as rotas abaixo exigem que o usuário esteja logado ---

// Rota para a criação de um novo waffle
router.get("/novo-waffle", (req, res) => {
    res.render("novo-waffle");
});

// Rota para a edição dos dados de um waffle
router.get("/editar-waffle/:waffle", (req, res) => {
    res.render("editar-waffle");
});

// Rota para a exclusão de um waffle
router.get("/excluir-waffle/:waffle", (req, res) => {

    res.redirect("/");
});

module.exports = router