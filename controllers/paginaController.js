const { readPages } = require('../utils/readPages');

const viewPage = (req, res) => {
    const { url } = req.params;
    const pages = readPages();
    const page = pages.find(p => p.url === `/pages/${url}`);

    if (page) {
        res.render('viewPage', { 
            title: page.title, 
            content: page.content,
            coverImage: page.coverImage,
            id: page.id, // Adiciona o ID da página
            loggedIn: req.session.loggedIn // Passa a informação da sessão
        });
    } else {
        res.status(404).send('Página não encontrada');
    }
};

module.exports = { viewPage };