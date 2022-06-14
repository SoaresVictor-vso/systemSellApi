
const { getCad, createDb, confJsonToDb, getAll } = require('./dbOp/productManager');
const { logIn } = require('./dbOp/login');
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
                    resp = JSON.stringify(data);
                }
            }
            else
            {
                resp = JSON.stringify({"erro": "badRequest"});
            }
            break;


        //transforma o banco de dados JSON e passa para o banco de dados PGSQL
        case '101':
            resp = await confJsonToDb();
            break;

        //retorna o banco de produtos completo
        case '102':
            resp = await getAll();
            break;

        //Cria as tabelas necessárias no banco de dados
        case '199':
            resp = createDb()
            break;

        //Login passando user e pass por json
        case '400':
            if(data != null)
            {
                if(data.user != null && data.pass != null)
                {
                    resp = await logIn(data.user, data.pass)
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
            
        

        default:
            resp = JSON.stringify({erro : "invalidOperation"});
            break;
    }
    //console.log(resp)
    return resp;
}

module.exports = { setOperation }