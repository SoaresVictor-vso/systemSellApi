
const dotenv = require('dotenv');
const jwt = require('jsonwebtoken');

const pgClient = require('pg').Client;
const {preSetDb} = require('./productManager');

dotenv.config();

const getRole = async function (token)
{
    try
    {
        var decoded = jwt.verify(token, process.env.JWT_KEY);
    }
    catch(err)
    {
        return "erro"
    }
    let ret = "erro";
    const client = new pgClient(preSetDb());
    try
    {
        await client.connect()
        .then(async () => {
            const strQry = "select roles.role_name FROM usuario_role INNER JOIN roles ON roles.role_id = usuario_role.role_id WHERE(usuario_role.user_id = '" + decoded.uid + "');"
            //console.log(strQry)
            await client.query(strQry).then((r) => {
                if(r.rowCount == 0)
                {
                    ret = "erro";
                }
                else
                {
                    ret = (r.rows[0].role_name);
                    console.log(ret)
                }
            }) 
        })
        .then(() => {
            client.end();
        })
        
    }
    catch(err)
    {
        console.log(err)
        ret = "erro";
    }
    return ret
}



module.exports = { getRole }