const http = require('http');
const URL = require('url');
const fs = require('fs');
const path = require('path');

const data = require('./products.json');



http.createServer((req,res) => {
    const {op, cod, name, value, quant} = URL.parse(req.url, true).query;
    
    res.writeHead(200, {
        'Access-Control-Allow-Origin' : '*'
    })

    if(!op)
    {
        return res.end(JSON.stringify({erro : "noOperation"}));
    }
    else
    {
        find(op, cod).then((r) => {
            console.log(r);
            return res.end(r);
        })
                
        
    }
}).listen(3000, console.log("API up"));

async function find(op, cod)
{ 
    let resp;
    if(op == 0)
    {
        await search(cod).then((r) => {
            //console.log(r);
            if(r != null)
            {
                resp = r;
            } 
            else
            {
                resp = JSON.stringify({erro : "notFindCad"});
            }
        })
            
    }
    else
    {
        resp = JSON.stringify({erro : "invalidOperation"});
    }
    return resp;
    
    
}

async function search(cod)
{
    let product
    await data.forEach(element => {
        if(element.Barcode == cod)
        {
            product = JSON.stringify(element);
        }
    })
    return product;
}