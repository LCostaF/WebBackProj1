const fs = require('fs');
const path = require('path');

function deleteWaffle(fileName) {
    const jsonFilePath = path.join(__dirname, '../documents/waffles/', fileName + '.json');

    fs.unlink(jsonFilePath, (err) => {
        if (err) {
            console.error('Error deleting JSON file:', err);
            return;
        }
        console.log('JSON file deleted successfully:', jsonFilePath);
    });
}

//teste para deletar pela rota
function deleteWaffle2(req, res) {
    const fileName = req.params.fileName;
    const jsonFilePath = path.join(__dirname, '..', 'documents', 'waffles', `${fileName}.json`);

    fs.unlink(jsonFilePath, (err) => {
        if (err) {
            console.error('Error deleting JSON file:', err);
            res.status(500).send('Failed to delete waffle data.');
            return;
        }
        console.log('JSON file deleted successfully:', jsonFilePath);
        res.redirect('/'); // Redirecionar para a página inicial ou outra página apropriada
    });
}

module.exports = { deleteWaffle, deleteWaffle2 };