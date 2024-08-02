const fs = require('fs');
const path = require('path');

function main(req, res) {
    const pagesFilePath = path.join(__dirname, '..', 'data', 'pages.json');
    let pages = [];

    try {
        const data = fs.readFileSync(pagesFilePath, 'utf-8'); 
        if (data === '') {
            console.log("Arquivo vazio, retorna um array vazio");
            pages = [];
        } else {
            pages = JSON.parse(data); 
        }
    } catch (error) {
        if (error.code === 'ENOENT') {
            console.log("Arquivo não encontrado, retorna um array vazio");
        } else {
            console.error('Failed to read or parse pages file:', error);
            res.status(500).send('Failed to load pages.');
            return;
        }
    }
        
    res.render('index', {
        title: 'Waffles',
        pages: pages,
        slides: [
            { src: "images/food-img-1.png", active: true },
            { src: "images/food-img-2.png" },
            { src: "images/food-img-3.png" },
            { src: "images/food-img-4.png" }
        ],
        controls: [
            { src: "images/control-img-1.png", index: 1, active: true },
            { src: "images/control-img-2.png", index: 2 },
            { src: "images/control-img-3.png", index: 3 },
            { src: "images/control-img-4.png", index: 4 }
        ],
        loggedIn: req.session.loggedIn
    });
}

module.exports = { main };
