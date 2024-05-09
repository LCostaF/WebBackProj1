const formidable = require('formidable');
const fs = require('fs');
const path = require('path');
let jsonFilePath;
let pageData;

// Rota para a edição de um waffle existente
async function editWaffle(req, res) {
    if (await atualizaJson(req.params.fileName)) {
        await getPage(); // Espera pela conclusão da função assíncrona getPage
        console.log(imgPath);
        res.render("edit-waffle", { pageData }); // Passando pageData para a renderização
    }
}

//Função que atualiza o jsonFilePath e ImgPath
function atualizaJson(fileName) {
    try {
        jsonFilePath = path.join(__dirname, '../documents/waffles/', fileName + '.json');
        imgPath = path.join(__dirname, '../documents/waffles/', fileName + '.png');
    
        return fs.existsSync(jsonFilePath); //Retorna true ou falsa se o arquivo Json da Waffle existir.
    } catch (err) {
        return false;
    }
}

//função que pega os dados da página no json
async function getPage() {
    try {
        const rawData = await fs.promises.readFile(jsonFilePath, 'utf8');
        const jsonData = JSON.parse(rawData);
        pageData = {
            title: jsonData.title,
            description: jsonData.description,
            image: jsonData.image
        };

    } catch (err) {
        
    }
}

async function postWaffle(req, res) {
    const form = new formidable.IncomingForm();

    form.parse(req, async (err, fields, files) => {
        try {
            if (err) {
                console.error('Error parsing form:', err);
                res.status(500).send('Error parsing form');
                return;
            }

            //Pega os dados através do Post
            const fileName = fields.fileName[0];  
            const pageContent = fields.pageContent[0];
            const imageFile = files.file[0];  


            let imageBase64 = null;
            //Verifica se o imageFile existe
            if (imageFile) {
                //Se existe converte para a Base 64
                const imagePath = imageFile.filepath;
                imageBase64 = await convertImageToBase64(imagePath); 
            }

            //Cria uma novo dado que tem o nome do arquivo, o conteudo e a imagem
            const newDataObj = newData(fileName, pageContent, imageBase64);

            //Verifica se o Titulo é diferente do titulo antigo
            if (newDataObj.title !== pageData.title) { 
                const newJsonFilePath = path.join(__dirname, '../documents/waffles/', newDataObj.title + '.json');
                //Verifica se o Titulo novo não é igual a de algum outro item.
                if (newDataObj.title.length === 0 || fs.existsSync(newJsonFilePath)) {
                    console.log('Error: Title is empty or already exists');
                    res.status(400).send('Error: Title is empty or already exists');
                    return;
                }
            }
        
        await deleteWaffle(pageData.title); //Deleta o arquivo antigo
        await preparaJson(newDataObj); //Prepara os dados novos colocando no pageData
        await criaWaffle(); //Cria a nova página

        res.redirect('/');
    } catch (err) {
        console.error('Error processing postWaffle:', err);
        res.status(500).send('Internal Server Error');
    }
});
}

//Cria um objeto provisório identico com o pageData
function newData(titulo, description, image) {
    const newData = {
        title: titulo,
        description: description,
        image: image
    };
    return newData;
}

//Função que converte imagem ao Base64
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

//Função que ira pegar os dados do newData e por no pageData
async function preparaJson(newData){
    try {
        pageData.title = newData.title;
        pageData.description = newData.description;
        //Verifica se o arquivo a imagem do newData é valida, se não for fica com a imagem antiga.
        if (typeof newData.image !== 'undefined' && newData.image !== '') {
            pageData.image = newData.image
        }

    } catch (err) {
        console.error('Error preparing JSON:', err);
        throw err; // Lança o erro para ser tratado no postWaffle
    }
}

//Funçao que deleta o antiga página.
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

//Função que cria a nova pagina
function criaWaffle(){
    jsonFilePath = path.join(__dirname, '../documents/waffles/', pageData.title + '.json');

    fs.writeFile(jsonFilePath, JSON.stringify(pageData), (err) => {
        if (err) {
            console.error('Error writing JSON file:', err);
            // Trate o erro aqui
            return;
        }
        console.log('JSON file saved successfully:', jsonFilePath);
    });
}


module.exports = { editWaffle, postWaffle };
