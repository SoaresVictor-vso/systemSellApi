const bcrypt = require('bcrypt');
const {dbQuery} = require('./dbManager');

const cad = async function(user, pass, role)
{
    bcrypt.hash(pass, 12, async (err, hash) => {
        if(err)
        {
            return JSON.stringify({"erro":"failOnUserCad"})
        }
        else
        {
            const addUserQry = "INSERT INTO usuario (user_name, hash) VALUES('" + user + "', '" + hash + "');"
            
            await dbQuery(addUserQry);
            console.log(await dbQuery("SELECT * FROM usuario WHERE user_name = '" + user + "';"))

            
            const userId = JSON.parse(await dbQuery("SELECT user_id FROM usuario WHERE user_name = '" + user + "';"))[0].user_id;
            

            role.forEach(async(e) => {
                const roleId = JSON.parse(await dbQuery("SELECT role_id FROM roles WHERE role_name = '" + e + "';"))[0].role_id;
                const addRolesQry = "INSERT INTO usuario_role (user_id, role_id) VALUES('" + userId + "', '" + roleId + "');"
                console.log(addRolesQry)
                await dbQuery(addRolesQry);
            });

            ret = JSON.parse(await dbQuery("SELECT * FROM usuario WHERE user_name = '" + user + "';"))[0]
            console.log(">>>" + ret)
            return JSON.stringify(ret);
        }
    })
}

module.exports = {cad}