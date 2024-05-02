const formidable = require('formidable');
const fs = require('fs');
const path = require('path');


// Rota para a criação de um novo waffle
function newWaffle(req, res) {
    res.render("novo-waffle");
}

// Rota para tratar a criação de um novo waffle, após preenchido form
function createWaffle(req, res) {
    const form = new formidable.IncomingForm();

    form.parse(req, async (err, fields, files) => {
        if (err) {
            console.error('Error parsing form data:', err);
            res.status(500).send('Error parsing form data.');
            return;
        }
        //TODO: criar variavel para style
        // Constantes recebem nome e conteúdo de um waffle
        const fileName = fields.fileName[0];  
        const pageContent = fields.pageContent[0];
        const jsonFilePath = path.join(__dirname, '../documents/waffles/', fileName + '.json');

        // Verifica se já existe um waffle com o nome de arquivo (rota) fornecido
        if (fs.existsSync(jsonFilePath)) {
            console.error('Error: A JSON file with the same name already exists.');
            res.status(400).send('A JSON file with the same name already exists.');
            return;
        }

        if (!files.file || files.file.length === 0) {
            console.error('No file uploaded.');
            res.status(400).send('No file uploaded.');
            return;
        }

        const imageFile = files.file[0];  
        const imagePath = imageFile.filepath;

        const base64Image = await convertImageToBase64(imagePath).catch(err => {
            console.error('Error converting image to base64:', err);
            res.status(500).send('Error converting image to base64.');
            return;
        });

        const jsonObject = {
            title: fileName,
            description: pageContent,
            image: base64Image
        };

        // Write the content of the waffle to a json file
        fs.writeFile(jsonFilePath, JSON.stringify(jsonObject), (err) => {
            if (err) {
                console.error('Error writing JSON file:', err);
                res.status(500).send('Error writing JSON file.');
                return;
            }
            console.log('JSON file saved successfully:', jsonFilePath);
            res.redirect("/");
        });
    });
}

function convertImageToBase64(filePath) {
    return new Promise((resolve, reject) => {
        fs.readFile(filePath, { encoding: 'base64' }, (err, data) => {
            if (err) {
                reject(err);
            } else {
                resolve(`data:image/png;base64,${data}`);
            }
        });
    });
}

module.exports = { newWaffle, createWaffle };