// ---- Arquivo para rotas principais do sistema ----

const cookieParser = require('cookie-parser');
const express = require('express');
const formidable = require('formidable');
const router = express.Router();
const path = require('path');
const fs = require('fs');

// ------ MIDDLEWARES ------



// ------ ROTAS ------

// --- Essas rotas iniciais não exigem que o usuário esteja logado ---

// Rota para a página inicial do CMS
router.get("/", (req, res) => {
    let args = {
        'cor': req.cookies.cor || "white",
        'usuario': req.session.usuario,
        'coisas': req.session.data,
    }
    res.render("index");
});

// Rota para a visualização de um waffle
router.get("/ver-waffle/:waffle", (req,res) => {
    res.render("ver-waffle");
});


// --- A partir deste ponto, todas as rotas abaixo exigem que o usuário esteja logado ---

// Rota para a criação de um novo waffle
router.get("/novo-waffle", (req, res) => {
    res.render("novo-waffle");
});

// Rota para tratar a criação de um novo waffle, após preenchido form
router.post("/criar-waffle", (req, res) => {
    const form = new formidable.IncomingForm();

    form.parse(req, (err, fields, files) => {
        if (err) {
            console.error('Error parsing form data:', err);
            res.status(500).send('Error parsing form data.');
            return;
        }

        // Constantes recebem nome e conteúdo de um waffle
        const fileName = fields.fileName[0];
        const pageContent = fields.pageContent[0];
        const filePath = path.join(__dirname, '../waffles/', fileName + '.txt');

        // Verifica se já existe um waffle com o nome de arquivo (rota) fornecido
        if (fs.existsSync(filePath)) {
            console.error('Error: A text file with the same name already exists.');
            res.status(400).send('A text file with the same name already exists.');
            return;
        } else {
            // Path da imagem
            const imagePath = path.join(__dirname, '../images/', fileName + path.extname(
                path.join(__dirname, '../images/', String(files.file[0].originalFilename))
            ));

            // Envia imagem para diretório images
            fs.copyFile(String(files.file[0].filepath), imagePath, (err) => {
                if (err) {
                    console.error('Error moving image file:', err);
                    res.status(500).send('Error moving image file.');
                    return;
                }
                console.log('Image file saved successfully:', imagePath);

                // Write the content of the waffle to a text file
                fs.writeFile(filePath, String(pageContent), (err) => {
                    if (err) {
                        console.error('Error writing text file:', err);
                        res.status(500).send('Error writing text file.');
                        return;
                    }
                    console.log('Text file saved successfully:', filePath);
                    res.redirect("/");
                });
            });
        }
    });
});

// Rota para a edição dos dados de um waffle
router.get("/editar-waffle/:waffle", (req, res) => {
    res.render("editar-waffle");
});

// Rota para a exclusão de um waffle
router.get("/excluir-waffle/:waffle", (req, res) => {

    res.redirect("/");
});

// Rota para logout
router.get("/logout", (req, res) => {
    
});

module.exports = router;