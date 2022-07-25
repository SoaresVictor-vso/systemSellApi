const http = require('http');
const URL = require('url');
const path = require('path');
const { setOperation } = require('./reqController');
const dotenv = require('dotenv');
dotenv.config();

const port = process.env.PORT || 3000;


http.createServer(async (req,res) => {

    console.log(">>>Access")


    res.writeHead(200, {'Access-Control-Allow-Origin' : '*', 'Access-Control-Allow-Headers' : '*'});
    
    const end = req.url;
    const {op} = URL.parse(end, true).query;

    //buffer do body da requisição
    const body = [];
    let data;
    if(req.method != "get")
    {
        try 
        {
            //adiciona cada parte do corpo da requisição no buffer
            for await (const chunk of req) {
                body.push(chunk);
            }
            data = JSON.parse(Buffer.concat(body));
                     
        } 
        catch (error) 
        {
            data = {"stts": -1};
            console.log(error);
        }
    }
    

    if(!op)
    {
        return res.end(JSON.stringify({erro : "noOperation"}));
    }
    else if(data != null)
    {
        await setOperation(op, data).then((r) => {
            return res.end(r);})
    }
    else
    {
        return res.end(JSON.stringify({'erro':'badRequest'}))
    }
}).listen(port , console.log("API up at port " + port));


