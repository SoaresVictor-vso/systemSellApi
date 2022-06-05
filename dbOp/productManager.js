

let pgData = {
    
}

const pgClient = require('pg').Client;
//let client;




const confJsonToDb = async function()
{
    preSetDb();
    

    const db = require('../Products.json');
    db.forEach(async (prod) => {
        
        await includeCad(prod);
    })


    await getAll()
    
    
}
const createDb = async function()
{
    preSetDb();
    const client = new pgClient(pgData);
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
    preSetDb();
    const client = new pgClient(pgData);
    try
    {
        await client.connect()
        .then(async () => {
            console.log("connected on dbSysSale!");
            const strQry = "INSERT INTO produto (barcode, description, quant, price) VALUES ('"+ 0000 +"', '" + prod.Description + "', 15, " + prod.Value * 100 + ");";
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
        database: process.env.DB_NAME,
        ssl: true
    }
}

module.exports = { confJsonToDb, getCad, createDb };