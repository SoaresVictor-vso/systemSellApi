

const pgClient = require('pg').Client;

const confJsonToDb = async function()
{   

    const db = require('../Products.json');
    db.forEach(async (prod) => {
        
        await includeCad(prod);
    })


    return await getAll()
    
    
}
const createDb = async function()
{
    const client = new pgClient(preSetDb());
    try
    {
        await client.connect()
        .then(async () => {
            console.log("connected on dbSysSale!");
            const strQry = "CREATE TABLE IF NOT EXISTS public.produto(barcode character varying(15) NOT NULL,description character varying(40) NOT NULL,quant integer DEFAULT 0,price integer DEFAULT 0,CONSTRAINT produto_pkey PRIMARY KEY (barcode),CONSTRAINT produto_description_key UNIQUE (description));";
            console.log(strQry);
            
            await client.query(strQry).then(() => {
                console.log("===> Created sucessfully Database!");
            })
           
            
        })
        .then(() => {
            client.end();
            console.log("Conexão ao banco de dados finalizada")
        })

        return JSON.stringify({"stts": "success"});
        
    }
    catch(err)
    {
        console.log(err);
        return err;
    }

}

const includeCad = async function(prod)
{
    const client = new pgClient(preSetDb());
    try
    {
        await client.connect()
        .then(async () => {
            console.log("connected on dbSysSale!");
            const strQry = "INSERT INTO produto (barcode, description, quant, price) VALUES ('"+ prod.Barcode +"', '" + prod.Description + "', 15, " + prod.Value * 100 + ");";
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
        console.log("err");
    }

}

const getCad = async function(cod)
{
    const client = new pgClient(preSetDb());

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
    const cli = new pgClient(preSetDb());
    let res;
    try
    {
        await cli.connect()
        .then(async () => {
            console.log("connected on dbSysSale!");
            await cli.query("SELECT * FROM produto ORDER BY barcode").then((r) => {
                res = JSON.stringify(r.rows);
            })
        })
        .then(() => {
            cli.end();
            console.log("Conexão ao banco de dados finalizada");
        })
        
    }
    catch(err)
    {
        
        res = JSON.stringify({"erro": "dbConnection"});
        console.log(err);
    }

    return res;
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

module.exports = { confJsonToDb, getCad, createDb, getAll, preSetDb };