const http = require('http');
const URL = require('url');
const fs = require('fs');
const path = require('path');
const { setOperation } = require('./reqController');
const dotenv = require('dotenv');
const { Console } = require('console');
dotenv.config();

const port = process.env.PORT || 3000;


http.createServer(async (req,res) => {

    res.writeHead(200, {'Access-Control-Allow-Origin' : '*'});
    
    //buffer do body da requisição
    const body = [];
    let data;
    try 
    {
        //adiciona cada parte do corpo da requisição no buffer
        for await (const chunk of req) {
            body.push(chunk);
        }
        data = JSON.parse(Buffer.concat(body));
        
        console.log(data.barcode);        
    } 
    catch (error) 
    {
        data = JSON.parse({"stts": -1});
        console.log("NoJSON");
    }

    const end = req.url;
    const {op} = URL.parse(end, true).query;
    //console.log(">>>>>>>>>API ACCESS<<<<<<<<<<<<\n==========>>>>>>" + end)

    if(!op)
    {
        return res.end(JSON.stringify({erro : "noOperation"}));
    }
    else
    {
        setOperation(op, data).then((r) => {return res.end(r);})
    }
}).listen(port , console.log("API up at port " + port));


