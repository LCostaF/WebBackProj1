const fs = require('fs');
const path = require('path');

const pagesFilePath = path.join(__dirname, '../data/pages.json');

function readPages() {
    try {
        const data = fs.readFileSync(pagesFilePath, 'utf-8');
        return JSON.parse(data);
    } catch (error) {
        if (error.code === 'ENOENT') {
            console.log("Arquivo não encontrado, retorna um array vazio");
            return [];
        } else {
            throw error;
        }
    }
}

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