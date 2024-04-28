const path = require('path');
const fs = require('fs');

function viewWaffle(req, res) {
    const jsonFilePath = path.join(__dirname, '..', 'documents', 'waffles', `${req.params.fileName}.json`);

    fs.readFile(jsonFilePath, 'utf8', (err, data) => {
        if (err) {
            console.error('Error reading JSON file:', err);
            res.status(500).send('Failed to load waffle data.');
            return;
        }

        const waffleData = JSON.parse(data);
        res.render('waffle', waffleData);  // Renderiza a página usando os dados do JSON
    });
  }

  module.exports = { viewWaffle };