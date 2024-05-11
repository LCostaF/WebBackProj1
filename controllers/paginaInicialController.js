const fs = require('fs');
const path = require('path');

function main(req, res) {
    const directoryPath = path.join(__dirname, '..', 'documents', 'waffles');

    // Lendo todos os arquivos na pasta dos waffles de forma assíncrona
    fs.readdir(directoryPath, (err, files) => {
        if (err) {
            console.error('Failed to list the files:', err);
            res.status(500).send('Failed to load waffles.');
            return;
        }

        const waffles = [];
        let filesProcessed = 0;

        files.forEach(file => {
            const jsonFilePath = path.join(directoryPath, file);

            fs.readFile(jsonFilePath, 'utf8', (err, data) => {
                filesProcessed++;
                if (err) {
                    console.error('Error reading file:', jsonFilePath, err);
                } else {
                    try {
                        const waffle = JSON.parse(data);
                        waffles.push(waffle);
                    } catch (parseError) {
                        console.error('Error parsing JSON from file:', jsonFilePath, parseError);
                    }
                }

                // Renderiza a view apenas após processar todos os arquivos
                if (filesProcessed === files.length) {
                    res.render('index', {
                        title: 'Circle Slider',
                        waffles: waffles,
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
            });
        });
    });
}
  
  module.exports = { main };