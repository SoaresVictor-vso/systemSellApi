
const {dbQuery} = require('./dbManager')


const includeCad = async function(prod)
{
    const insQry = "INSERT INTO produto (barcode, description, quant, price)"
    const vlsQry = "VALUES ('"+ prod.Barcode +"', '" + prod.Description + "', 15, " + prod.Price * 100 + ");";
    
    return await dbQuery(insQry + vlsQry);
}

const getCad = async function(cod)
{
    const strQry = "SELECT * FROM produto WHERE barcode = '" + cod + "'";

    const prod = JSON.parse(await dbQuery(strQry))[0];
    console.log(JSON.stringify(prod))

    
    if(prod.erro != null)
    {
        return JSON.stringify(prod.erro);
    }

    ret = {
        "barcode": prod.barcode,
        "description": prod.description,
        "quant": prod.quant,
        "price": prod.price
    }
    
    return JSON.stringify(prod);
}

module.exports = {getCad};