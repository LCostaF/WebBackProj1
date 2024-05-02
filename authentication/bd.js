var pg = require('pg');


var conString = "postgres://wimwvbca:W7i3UqWf0kxGPJ4tul8LVzhC5N4WNTE5@isabelle.db.elephantsql.com/wimwvbca";
var client = new pg.Client(conString);

//Função que faz conecção do banco de dados
async function connectToDatabase(callback) {
    try {
        await client.connect();
        console.log('connected to database');
        callback(null, client);
    } catch (err) {
        console.error('could not connect to postgres', err);
        callback(err);
    }
}

// Função que ativa ou desativa a conexão com o banco de dados
async function db(boolean) {
    try {
        if (boolean) {
            await connectToDatabase(function(err) {
                if (err) {
                    throw err; // Lança o erro para ser capturado no catch
                }
                console.log('Conexão com o banco de dados ativada.');
            });
            return true;
        } else {
            if (client && client._connected) {
                client.end();
                console.log('Conexão com o banco de dados desativada.');
            }
            return true;
        }
    } catch (error) {
        console.error('Erro ao conectar ou desconectar do banco de dados:', error);
        return false;
    }
}

function runQuery(query, callback) {
    client.query(query, function(err, result) {
        if (err) {
            console.error('error running query', err);
            return callback(err);
        }
        console.log(result.rows);
        callback(null, result.rows);
    });
}

// Função de Fazer Pesquisa no Banco de Dados
function loginDb(email, senha, callback) {
    // Verifica se o cliente está definido e conectado ao banco de dados
    if (client && client._connected) {
        const query = "SELECT * FROM ADM WHERE nome = '" + email + "' AND senha = '" + senha + "'";
        runQuery(query, function(err, result) {
            if (err) {
                console.error("Erro ao executar a consulta:", err);
                return callback(false);
            }
            // Retorna verdadeiro se um resultado for encontrado
            callback(result.length !== 0);
        });
    } else {
        console.error('Banco de dados não está online.');
        callback(false);
    }
}

function createUserDb(email, senha, callback) {
    const query = `INSERT INTO ADM (nome, senha) VALUES ('${email}', '${senha}')`;
    runQuery(query, function(err, result) {
        if(err) {
            console.log("Usuário não criado", err);
            return callback(false);
        }

        console.log("Usuário criado com sucesso");
        callback(true);
    });
}

/*
async function main() {
    try {
        // Ativar conexão
        await db(true);
        console.log('Conexão ativada com sucesso.');

        // Fazer login
        await new Promise((resolve, reject) => {
            login("carlos@gmail.com", "c123", function(success) {
                console.log("1 - Login bem-sucedido:", success);
                resolve(success);
            });
        });

        // Desativar conexão
        await db(false);
        console.log('Conexão desativada com sucesso.');
    } catch (error) {
        console.error('Erro:', error);
    }
}

main(); */

module.exports = {
    db,
    createUserDb,
    loginDb
};
