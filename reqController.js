
const { getCad, createDb, confJsonToDb, getAll } = require('./dbOp/productManager');
const { logIn } = require('./dbOp/login');
const { getRole } = require('./dbOp/authorization')
const URL = require('url');

async function setOperation(op, data)
{ 
    let resp;
    try
    {
        await getRole(data.token)
        .then(async (role) => {
            const res = await action(op, role, data);
            resp = res;
        })
    }
    catch (err)
    {
        if(data.token == null)
        {
            const res = await action(op, "guest", data);
            resp = res;
        }
        else
        {
            console.log(err);
            resp = JSON.stringify({"erro": "badRequest"});
        }
    }
    return resp;

}

const action = async function(op, permission, data)
{
    let roles;
    switch (op) {

        //DEPRECATED: emite alerta
        case '0':
            resp = JSON.stringify({"ALERT":"changedOperation"});
            break;

        //Usa o codigo passado por url para realizar a requisição simples de um produto à api
        case '1':
            roles = ['admin', 'editor', 'caixa'];
            if(!roles.find(item => item == permission))
            {
                resp = JSON.stringify({"erro": "permissionDenied"});
            }
            else if(data.barcode != null)
            {
                resp = await getCad(data.barcode);
            }
            else
            {
                resp = JSON.stringify({"erro": "badRequest"});
            }
            break;


        //Login passando user e pass por json
        case '20':
            if(data.user != null && data.pass != null)
            {
                resp = await logIn(data.user, data.pass)
            }
            else
            {
                resp = JSON.stringify({"erro": "badRequest"});
            }
            break;
        
        case '21':
            let role;
            if(data.token != null)
            {
                role = await getRole(data.token);
                if(role != "erro")
                {
                    resp = JSON.stringify({'stts':'logged'})
                }
                else
                {
                    resp = JSON.stringify({'stts':'unlogged'})
                }
            }
            else
            {
                resp = JSON.stringify({"erro": "badRequest"});
            }
            break;
        
        case '22':
            if(data.token != null)
            {
                const permission = await getRole(data.token);
                resp = permission;
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

        
            
        

        default:
            resp = JSON.stringify({erro : "invalidOperation"});
            break;
    }
    //console.log(resp)
    return resp;
}



module.exports = { setOperation }