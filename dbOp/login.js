const bcrypt = require('bcrypt');
const dotenv = require('dotenv');
const jwt = require('jsonwebtoken');
const {dbQuery} = require('./dbManager');


dotenv.config();

const logIn = async function(user, pass)
{
    const userData = await getHash(user)
    if(userData == JSON.stringify({"erro": "databaseFailed"}))
    {
        return ret = JSON.stringify({"stts":"invalidPassorUser"});
    }
    else
    {
        return await validate(pass, userData)
    }
}

const validate = async function(pass, userData)
{
    let ret;
    let result;
    if(userData != null)
    {
        result = await bcrypt.compare(pass, userData.hash)
        if(result)
        {
            ret = getJwt(userData.user_id);
        }
        else
        {
            ret = {"stts":"invalidPassorUser"}
        }
    }
    else
    {
        ret = {"stts":"invalidPassorUser"}
    }
    
    return JSON.stringify(ret);
}

const getHash = async function(user)
{
    const strQry = "SELECT user_id, hash FROM usuario WHERE user_name = '" + user + "';";

    let obj = await dbQuery(strQry);
    obj = JSON.parse(obj)
    
    return obj[0];

}

const getJwt = function(uid)
{
    let key = process.env.JWT_KEY;
    let token = jwt.sign({"uid":uid}, key, {expiresIn:7200});
    
    return {"jwt":token};
}





module.exports = {  logIn }

