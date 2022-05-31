const data = require('./Products.json');

const searchProduct = async function (cod)
{
    let find = false;
    let product;
    await data.forEach(element => {
        if(element.Barcode == cod)
        {
            find = true;
            product = JSON.stringify(element);
        }
    })
    if(!find)
    {
        product = JSON.stringify({erro : "notFindCad"});
    }
    return product;
}

module.exports = { searchProduct }