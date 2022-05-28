const http = require('http');
const URL = require('url');
const fs = require('fs');
const path = require('path');
const { setOperation } = require('./reqController');





http.createServer((req,res) => {
    const end = req.url;
    const {op} = URL.parse(end, true).query;
    
    res.writeHead(200, {'Access-Control-Allow-Origin' : '*'});

    if(!op)
    {
        return res.end(JSON.stringify({erro : "noOperation"}));
    }
    else
    {
        setOperation(op, end).then((r) => {return res.end(r);})
    }
}).listen(3000, console.log("API up"));


