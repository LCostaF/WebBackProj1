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

module.exports = { readPages };