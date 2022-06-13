const bcrypt = require('bcrypt');
const dotenv = require('dotenv');
const jwt = require('jsonwebtoken')
const res = require('express/lib/response');
const pgClient = require('pg').Client;
const {preSetDb} = require('./productManager');

/*let name = 'test';
let senha = "patinho123";
let hashu = "$2b$12$THX4D9rDnvUKGL.5UgwwSez4sgbzgCIXRLbOaqhYGS0786i2t3YJK"*/

dotenv.config();

const logIn = async function(user, pass)
{
    const userData = await getHash(user)/*.then(async (r) =>{*/
    if(userData == JSON.stringify({"erro": "databaseFailed"}))
    {
        return ret = {"stts":"invalidPassorUser"};
    }
    else
    {
        return await validate(pass, userData)
    }
}

const validate = async function(pass, userData)
{
    let ret;
    const result = await bcrypt.compare(pass, userData.rows[0].hash)
    if(result)
    {
        ret = {"stts":"logged"}
        ret = getJwt(userData.rows[0].user_id);
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
            const strQry = "SELECT user_id, hash FROM usuario WHERE user_name = '" + user + "';";
            
            await client.query(strQry).then((r) => {
                console.log(r);
                ret = r;
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

const getJwt = function(uid)
{
    let key = process.env.JWT_Key;
    let token = jwt.sign({"uid":uid}, key, {expiresIn:7200});
    
    return {"jwt":token};
}





module.exports = {  logIn }

