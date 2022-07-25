
const { getCad, updateCad, fullGetCad, find } = require('./dbOp/productManager');
const { logIn } = require('./dbOp/login');
const { getRole, isAllowed } = require('./dbOp/authorization');
const { dbQuery } = require('./dbOp/dbManager');
const { cad } = require('./dbOp/addUser');
const URL = require('url');

async function setOperation(op, data)
{ 
    let resp;
    try
    {
        await getRole(data.token)
        .then(async (role) => {
            
            let perm = [];
            rolesList = JSON.parse(role)
            rolesList.forEach(e => {
                perm.push(e.role_name);
            });
            const res = await action(op, perm, data);
            resp = res;
        })
    }
    catch (err)
    {
        if(data.token == null)
        {
            const res = await action(op, ["guest"], data);
            resp = res;
        }
        else
        {
            console.log(err);
            resp = JSON.stringify({"erro": "roleFailed"});
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
           
            if(!isAllowed(roles, permission))
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

        case '2':
            roles = ['admin', 'editor'];
           
            if(!isAllowed(roles, permission))
            {
                resp = JSON.stringify({"erro": "permissionDenied"});
            }
            else if(data.prod != null)
            {
                resp = await updateCad(data.prod);
            }
            else
            {
                resp = JSON.stringify({"erro": "badRequest"});
            }
            break;
        case '3':
            roles = ['admin', 'editor'];
            
            if(!isAllowed(roles, permission))
            {
                resp = JSON.stringify({"erro": "permissionDenied"});
            }
            else if(data.barcode != null)
            {
                resp = await fullGetCad(data.barcode);
            }
            else
            {
                resp = JSON.stringify({"erro": "badRequest"});
            }
            break;

            case '4':
                roles = ['admin', 'editor', 'caixa'];
               
                if(!isAllowed(roles, permission))
                {
                    resp = JSON.stringify({"erro": "permissionDenied"});
                }
                else if(data.name != null)
                {
                    
                    resp = await find(data.name);
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
                roleName = JSON.parse(role).role_name;
                console.log(role)
                if(roleName != "erro" && roleName != null)
                {
                    console.log(">>>" + JSON.parse(role).role_name)
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

        case '23':
            roles = ['admin'];
            if(!isAllowed(roles, permission))
            {
                resp = JSON.stringify({"erro": "permissionDenied"});
            }
            else if(data.user != null && data.pass != null && data.role != null)
            {
                resp = await cad(data.user, data.pass, data.role);
            }
            else
            {
                resp = JSON.stringify({"erro": "badRequest"});
            }
            break;
        

        
        case '100':
            roles = ['admin'];
            if(!isAllowed(roles, permission))
            {
                resp = JSON.stringify({"erro": "permissionDenied"});
            }
            else if(data.query != null)
            {
                resp = await dbQuery(String(data.query))
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