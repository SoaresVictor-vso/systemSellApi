const bcrypt = require('bcrypt');
const dotenv = require('dotenv');
const res = require('express/lib/response');
const pgClient = require('pg').Client;
const {preSetDb} = require('./productManager');

/*let name = 'test';
let senha = "patinho123";
let hashu = "$2b$12$THX4D9rDnvUKGL.5UgwwSez4sgbzgCIXRLbOaqhYGS0786i2t3YJK"*/

dotenv.config();

const logIn = async function(user, pass)
{
    const hash = await getHash(user)/*.then(async (r) =>{*/
    if(hash == JSON.stringify({"erro": "databaseFailed"}))
    {
        return ret = {"stts":"invalidPassorUser"};
    }
    else
    {
        return await validate(pass, hash)
    }
}

const validate = async function(pass, hash)
{
    let ret;
    const result = await bcrypt.compare(pass, hash)
    if(result)
    {
        ret = {"stts":"logged"}
    }
    else
    {
        ret = {"stts":"invalidPassorUser"}
    }
    return JSON.stringify(ret);
}

const getHash = async function(user)
{
    let ret;
    const client = new pgClient(preSetDb());
    try
    {
        await client.connect()
        .then(async () => {
            const strQry = "SELECT hash FROM usuario WHERE user_name = '" + user + "';";
            
            await client.query(strQry).then((r) => {
                ret = r.rows[0].hash;
            }) 
        })
        .then(() => {
            client.end();
        })
        
    }
    catch(err)
    {
        ret = JSON.stringify({"erro": "databaseFailed"});
    }
    return ret

}





module.exports = {  logIn }

