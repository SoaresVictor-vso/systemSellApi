const pgClient = require('pg').Client;



const dbQuery = async function (cmd)
{
    let ret;
    const client = new pgClient(preSetDb());
    try
    {
        await client.connect()
        .then(async () => {
            await client.query(cmd).then((r) => {
                if(r.rowCount == 0)
                {
                    ret = JSON.stringify({"erro": "databaseFailed"});
                    console.log("This Not Exist")
                }
                else
                {
                    ret = JSON.stringify(r.rows);
                }
            }) 
        })
        .then(() => {
            client.end();
        })
        
    }
    catch(err)
    {
        console.log("\n\n\n\nDBerr:" + err)
        ret = JSON.stringify({"erro": "databaseFailed"});
    }
    return ret;
}

const preSetDb = function()
{
    let obj;
    if(process.env.ENV == "DEV")
    {
        obj = {
            connectionString: process.env.DATABASE_URL
        }
    }
    else
    {
        obj = {
            connectionString: process.env.DATABASE_URL,
            ssl: {
                rejectUnauthorized: false
            }
        }
    }

    return obj;
}



module.exports = { dbQuery }