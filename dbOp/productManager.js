
const {dbQuery} = require('./dbManager')

const updateCad = async function(prod)
{
    let ret;
    try 
    {
        if(prod.barcode == null)
        {
            throw "noBarcode";
        }
        if(prod.description == null)
        {
            throw "noDescription";
        }

        const dbErr = JSON.parse(await dbQuery("SELECT description FROM produto WHERE barcode = '" + prod.barcode + "';")).erro;
        if(dbErr != "voidReturn")
        {
            ret = await changeCad(prod);
        }
        else
        {
            ret = await addCad(prod);
        }

        return ret;

    }
    catch (err)
    {
        console.log(err)
        ret = JSON.stringify({"erro":err});
    }

}

const cf = function(word)       //cf = charfliter
{
    return String(word).replace(/[^a-z0-9 ]/gi, '');
}

const cfSearch = function(word)     //cf = char filter
{
    return String(word).replace(/[^a-z0-9 %]/gi, '');
}

const changeCad = async function(prod)
{
    let ret;

    const strQry = "UPDATE produto SET description = '" + cf(prod.description) + "', quant = '";
    const valuesQryA = cf(prod.quant) + "', sellprice = '" + cf(prod.sellprice) + "', buyprice = '";
    const valuesQryB =  + cf(prod.buyprice) + "', margin = '" + cf(prod.margin) + "' WHERE barcode = '" + cf(prod.barcode) + "';";

    let qry = strQry + valuesQryA + valuesQryB;

    

    while(qry.includes('undefined'))
    {
        qry = qry.replace('undefined', '0');
    }

    while(qry.includes('null'))
    {
        qry = qry.replace('null', '0');
    }

    ret = await dbQuery(qry);
    
    return ret
}

const addCad = async function(prod)
{
    let ret;

    const strQry = "INSERT INTO produto (barcode, description, quant, sellprice, buyprice, margin) VALUES('";
    const valuesQryA = cf(prod.barcode) + "', '" + cf(prod.description) + "', '" + cf(prod.quant) + "', '";
    const valuesQryB = cf(prod.sellprice) + "', '" + cf(prod.buyprice) + "', '" + cf(prod.margin) + "');";

    let qry = strQry + valuesQryA + valuesQryB;

    

    while(qry.includes('undefined'))
    {
        qry = qry.replace('undefined', '0');
    }

    while(qry.includes('null'))
    {
        qry = qry.replace('null', '0');
    }
    
    ret = await dbQuery(qry);
    
    return ret
}

const getCad = async function(cod)
{
    
    
    const strQry = "SELECT barcode, description, quant, sellprice FROM produto WHERE barcode = '" + cod + "'";
    const prod = JSON.parse(await dbQuery(strQry))[0];

    
    if(prod == undefined || prod == null)
    {
        ret = {"erro":"nullProduct"};
    }
    else if(prod.erro != null)
    {
        ret = {"erro" : prod.erro};
    }
    else
    {
        ret = {
            "barcode": prod.barcode,
            "description": prod.description,
            "quant": prod.quant,
            "price": prod.sellprice
        }
    }
    
    
    return JSON.stringify(ret);
}

const fullGetCad = async function(cod)
{
    const strQry = "SELECT * FROM produto WHERE barcode = '" + cod + "'";
    const prod = JSON.parse(await dbQuery(strQry))[0];

   
    if(prod == undefined || prod == null)
    {
        ret = {"erro":"nullProduct"};
    }
    else if(prod.erro != null)
    {
        ret = {"erro" : prod.erro};
    }
    else
    {
        ret = {
        "barcode": prod.barcode,
        "description": prod.description,
        "quant": prod.quant,
        "price": prod.sellprice,
        "coast": prod.buyprice,
        "margin": prod.margin
        }
    }
    
    return JSON.stringify(ret);
}

const find = async function(name)
{
    const strQry = "SELECT barcode, description, quant, sellPrice FROM produto WHERE description ilike '" + cfSearch(name) + "%' ORDER BY description;";
    
    try 
    {
        return await dbQuery(strQry)
    } 
    catch (error) 
    {
        console.log (JSON.stringify({"erro":error}));
    }
}

const buy = async function (list)
{
    isFailed = false;
    errors = [];
    list.forEach(async (e) => {
        const exec = await buyExecute(e.quant, e.barcode)
        if(exec.stts == "erro")
        {
            ifFailed = true;
            const execption = e.barcode + "=> " + exec.erro;
            errors.push({erro:execption})
        }
    });

    if(isFailed)
    {
        return JSON.stringify({stts:"erro", errorList:errors});
    }
    else
    {
        return JSON.stringify({stts:"ok"});
    }
}

const buyExecute = async function (quant, barcode)
{
    let resp;
    const qry = "UPDATE produto SET quant = quant - " + parseInt(quant) + " WHERE barcode = '"+ cf(barcode) +"';"
    try
    {
        await dbQuery(qry);
        resp = {stts : "ok"};
    }
    catch (err)
    {
        resp = {stts : "erro", erro:err};
    }
    return JSON.stringify(resp);
}

module.exports = {getCad, updateCad, fullGetCad, find, buy};