

let pgData = {
    
}

const pgClient = require('pg').Client;
let client;

const confJsonToDb = async function()
{
    preSetDb();
    

    const db = require('../Products.json');
    // db.forEach(async (prod) => {
        
    //     await includeCad(prod);
    // })

    //await includeCad(db[4]);

    await getAll()
    
    
}


const includeCad = async function(prod)
{
    const client = new pgClient(pgData);
    try
    {
        await client.connect()
        .then(async () => {
            console.log("connected on dbSysSale!");
            const strQry = "INSERT INTO produto (barcode, description, quant, price) VALUES ('"+ 0000 +"', '" + prod.Description + "', 15, " + prod.Value + ");";
            console.log(strQry);
            
            await client.query(strQry).then(() => {
                console.log("added: " + prod.Barcode + " ==> " + prod.Description);
            })
           
            
        })
        .then(() => {
            client.end();
            console.log("Conexão ao banco de dados finalizada")
        })
        
    }
    catch(err)
    {
        console.log(err);
    }

}

const getCad = async function(cod)
{
    preSetDb();
    const client = new pgClient(pgData);

    let product;

    try
    {
        await client.connect()
        .then(async () => {
            const strQry = "SELECT * FROM produto WHERE barcode = '" + cod + "' ";
            
            await client.query(strQry).then((r) => {
                const prod = r.rows[0];
                if(prod == null)
                {
                    product = JSON.stringify({erro : "notFindCad"});
                }
                else
                {
                    jProd = {
                        "barcode": prod.barcode,
                        "description": prod.description,
                        "quant": prod.quant,
                        "value": prod.price
                    }
                    product = JSON.stringify(jProd);
                }

                console.log(jProd);

            })
           
            
        })
        .then(() => {
            client.end();
            console.log("Conexão ao banco de dados finalizada")
        })
        
    }
    catch(err)
    {
        console.log(err);
        product = JSON.stringify({erro : "databaseConnectionFailed"});
    }

    return product;
}

const getAll = async function()
{
    preSetDb();
    const cli = new pgClient(pgData);
    try
    {
        await cli.connect()
        .then(async () => {
            console.log("connected on dbSysSale!");
            await cli.query("SELECT * FROM produto ORDER BY barcode").then((r) => {
                console.log(r);
            })
        })
        .then(() => {
            cli.end();
            console.log("Conexão ao banco de dados finalizada")
        })
        
    }
    catch(err)
    {
        console.log(err);
    }
}

const preSetDb = function()
{
    pgData = {
        user: process.env.DB_USER,
        password: (process.env.DB_PASSWORD),
        host: process.env.DB_URL,
        port: process.env.DB_PORT,
        database: process.env.DB_NAME
    }
}

module.exports = { confJsonToDb, getCad };