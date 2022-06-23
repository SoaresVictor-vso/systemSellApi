const dotenv = require('dotenv');
const jwt = require('jsonwebtoken');
const {dbQuery} = require('./dbManager');

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
    
    const strQry = "SELECT roles.role_name FROM usuario_role INNER JOIN roles ON roles.role_id = usuario_role.role_id WHERE(usuario_role.user_id = '" + decoded.uid + "');"
    let ret = await dbQuery(strQry);

    return ret;
}

const isAllowed = function(allowedRoles, userRoles)
{
    ret = false;
    console.log("permitidas :" + allowedRoles + "\nConseguidas:" + userRoles)
    allowedRoles.forEach(e => {
        if(userRoles.find(item => item == e))
        {
            ret = true;
        }
    });

    return ret;
}



module.exports = { getRole, isAllowed }