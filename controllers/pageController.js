const { v4: uuidv4 } = require('uuid');
const path = require('path');
const fs = require('fs');
const slugify = require('../utils/slugify');
const pagesFilePath = path.join(__dirname, '../data/pages.json');

// Função para substituir as tags <h1> por <h2>
function replaceH1Tags(content) {
    return content.replace(/<h1>/g, '<h2>').replace(/<\/h1>/g, '</h2>');
}

function savePages(pages) {
    fs.writeFileSync(pagesFilePath, JSON.stringify(pages, null, 2));
}

function readPages() {
    let data;
    try {
        data = fs.readFileSync(pagesFilePath, 'utf-8');
        return JSON.parse(data);  // Tenta analisar o conteúdo do arquivo como JSON
    } catch (error) {
        if (error.code === 'ENOENT' || data === '') {
            console.log("Arquivo não encontrado ou vazio, retorna um array vazio")
            return [];
        } else {
            throw error;
        }
    }
}

const showCreateForm = (req, res) => {
    res.render('createPage', { 
        title: "Criar Nova Página", 
        loggedIn: req.session.loggedIn
    });
};

const createPage = (req, res) => {
    const { title, content } = req.body;
    let url = slugify(title);  // Sanitiza e cria uma URL a partir do título ou usa a customizada
    if (!url.startsWith('/')) {
        url = '/pages/' + url;
    }

    const coverImagePath = req.file ? req.file.path.replace('public\\', '').replace(/\\/g, '/') : 'default-cover.jpg';

    // Processar o conteúdo para substituir <h1> por <h2>
    const processedContent = replaceH1Tags(content);

    const pages = readPages();
    const newPage = {
        id: uuidv4(),
        url,
        title,
        content: processedContent,
        coverImage: coverImagePath
    };

    if (pages.some(page => page.url === url)) {
        return res.send("URL já existe. Por favor, escolha outra.");
    }

    pages.push(newPage);
    savePages(pages);
    res.redirect('/');
};

// Função para encontrar uma página pelo ID
function findPageById(id) {
    const pages = readPages();
    return pages.find(page => page.id === id);
}

// Função para exibir o formulário de edição
const showEditForm = (req, res) => {
    const { id } = req.params;
    const page = findPageById(id);

    if (page) {
        res.render('editPage', { 
            title: "Editar Página", 
            page: page,
            loggedIn: req.session.loggedIn
        });
    } else {
        res.status(404).send('Página não encontrada');
    }
};

// Função para editar a página
const editPage = (req, res) => {
    const { id } = req.params;
    const { title, content } = req.body;
    const pages = readPages();
    const pageIndex = pages.findIndex(p => p.id === id);

    if (pageIndex !== -1) {
        pages[pageIndex].title = title;
        pages[pageIndex].content = replaceH1Tags(content);

        if (req.file) {
            pages[pageIndex].coverImage = req.file.path.replace('public\\', '').replace(/\\/g, '/');
        }

        savePages(pages);
        res.redirect(`/pages/${pages[pageIndex].url.split('/').pop()}`);
    } else {
        res.status(404).send('Página não encontrada');
    }
};

// Função para excluir a página
const deletePage = (req, res) => {
    const { id } = req.params;
    const pages = readPages();
    const pageIndex = pages.findIndex(p => p.id === id);

    if (pageIndex !== -1) {
        pages.splice(pageIndex, 1);
        savePages(pages);
        res.redirect('/');
    } else {
        res.status(404).send('Página não encontrada');
    }
};

module.exports = { createPage, showCreateForm, showEditForm, editPage, deletePage };