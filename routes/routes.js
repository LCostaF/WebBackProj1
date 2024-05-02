const express = require('express');
const router = express.Router();
const paginaInicialController = require('../controllers/paginaInicialController');
const criarPaginas = require('../controllers/criarPaginasController');
const visualizarPaginaController = require('../controllers/visualizarPaginaController');
const loginController = require('../controllers/loginController')
const deletarControler = require('../controllers/deletarPaginaController')
const { checkLogin, authLogin } = require('./midware')

router.get('/', paginaInicialController.main);
router.get("/login", authLogin, loginController.loginGet);
router.get("/logout", loginController.logoutGet);
router.post("/adm", loginController.admPost);
router.get('/novo-waffle', checkLogin, criarPaginas.newWaffle);
router.post('/criar-waffle',checkLogin, criarPaginas.createWaffle);
router.get('/waffle/:fileName',checkLogin, visualizarPaginaController.viewWaffle)
//TODO: deletar rota após criar forma de deletar apropriada
router.get('/delete/:fileName',checkLogin, deletarControler.deleteWaffle2)

module.exports = router;