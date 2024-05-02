const fs = require("fs");
const path = require('path');

//Definindo caminhos e nome dos arquivos;
const pastaName = "user"
// Diretório pai do diretório atual
const parentDir = path.resolve(__dirname, '..');
const diretorio = path.join(parentDir, pastaName);
const arquivName = ".env"
const env = path.join(diretorio, arquivName);
require('dotenv').config({ path: path.join(diretorio, '.env') });

//Função que cria as varíaveis globais do .env
function global() {
    const secret = 'SECRET=1br2C3d4br5!';
    const port = 'PORT=3000';
    return('\n'+secret+'\n'+port)
}

//Função para criar o arquivo .env com login e senha do usuário
function createUser(login, senha) {
    // Cria o diretório se ele não existir
    if (!fs.existsSync(diretorio)) {
        fs.mkdirSync(diretorio);
    }

    //cria o contéudo do arquivo adm.env
    let text = 'ADMIN='+login+'\nPASSWORD='+senha+global();

    fs.writeFileSync(env, text);
}

function addUser(login, senha) {
    if (!fs.existsSync(diretorio)) {
        createUser(login, senha)
    }

    let text = 'ADMIN='+login+'\nPASSWORD='+senha;

    fs.appendFile(env, text)
}

function login(login, senha) {
    //Pega os dados do leitor e separa o login da senha.
    let loginArquivo = process.env.ADMIN;
    let senhaArquivo = process.env.PASSWORD;

    //Verifica se o login e senha estão corretas que nem a entrada
    //console.log(login+"-"+loginArquivo+"\n"+senha+"-"+senhaArquivo)
    if(login === loginArquivo && senha === senhaArquivo) {
        return true;
    } else {
        return false;
    }
}

//Exportando o Arquivo
module.exports = {
    createUser,
    login
};

console.log(process.env.ADMIN);
console.log(process.env.PASSWORD);

/* Como importar
const { createUser, login } = require('./loginManagement.js');

// Usando as funções createUser e login
createUser('Adm', '123');
console.log(login('Adm', '123'));

*/
