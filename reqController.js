const { searchProduct } = require('./productManager');
//const { confJsonToDb }  = require('./dbOp/productManager');
const { getCad, createDb, confJsonToDb } = require('./dbOp/productManager');
const URL = require('url');

async function setOperation(op, data)
{ 
    //const {op, cod} = URL.parse(end, true).query;
    let resp;

    switch (op) {

        //DEPRECATED: emite alerta
        case '0':
            resp = JSON.stringify({"ALERT":"changedOperation"});
            break;

        //Usa o codigo passado por url para realizar a requisição simples de um produto à api
        case '1':
            if(data != null)
            {
                if(data.barcode != null)
                {
                    resp = await getCad(data.barcode);
                }
                else
                {
                    resp = JSON.stringify({"erro": "badRequest"});
                }
            }
            else
            {
                resp = JSON.stringify({"erro": "badRequest"});
            }
            break;


        //transforma o banco de dados JSON e passa para o banco de dados PGSQL
        case '101':
            const { db } = URL.parse(end, true).query;
            resp = await confJsonToDb();
            break;

        //Cria as tabelas necessárias no banco de dados
        case '199':
            resp = createDb()
            break;

        default:
            resp = JSON.stringify({erro : "invalidOperation"});
            break;
    }
    return resp;
}

module.exports = { setOperation }