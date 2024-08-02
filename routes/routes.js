const express = require('express');
const multer = require('multer');
const path = require('path');
const router = express.Router();
const paginaInicialController = require('../controllers/paginaInicialController');
const loginController = require('../controllers/loginController');
const pageController = require('../controllers/pageController');
const paginaController = require('../controllers/paginaController');

const { isAuthenticated, authLogin } = require('../middleware/authMiddleware');

// Configuração do Multer
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './public/uploads/')
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
    }
});

const upload = multer({ storage: storage });

router.get('/', paginaInicialController.main);
router.get("/login", loginController.loginGet);
router.post('/perform-login', loginController.admPost);
router.get('/pages/create', isAuthenticated, pageController.showCreateForm);
router.post('/pages/create', isAuthenticated, upload.single('coverImage'), pageController.createPage);
router.get('/logout', isAuthenticated, loginController.logoutGet);
//===
router.get('/pages/:url', paginaController.viewPage);
//====TESTE
router.get('/editar/:id', isAuthenticated, pageController.showEditForm);
router.post('/editar/:id', isAuthenticated, upload.single('coverImage'), pageController.editPage);
router.get('/excluir/:id', isAuthenticated, pageController.deletePage);

module.exports = router;