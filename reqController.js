const { searchProduct } = require('./productManager');
const URL = require('url');

async function setOperation(op, end)
{ 
    let resp;

    switch (op) {

        case '0':
            const { cod } = URL.parse(end, true).query;
            resp = await searchProduct(cod);
            break;
    
        default:
            resp = JSON.stringify({erro : "invalidOperation"});
            break;
    }
    return resp;
}

module.exports = { setOperation }