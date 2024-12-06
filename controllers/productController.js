const prodModel = require("../models/product-model")
const utilities = require("../utilities/")

const prodCont = {}

/* ***************************
 *  Build product by id view
 * ************************** */
prodCont.buildByProdId = async function (req, res, next) {
    
    const productId = req.params.productID
    const data = await prodModel.getProductByInvId(productId)
    const productCard = await utilities.buildProductView(data)
    let nav = await utilities.getNav()
    const productName = `${data[0].inv_make} ${data[0].inv_model}`
    res.render("./inventory/product", {
        title: productName,
        nav, 
        productCard
    })
}

module.exports = prodCont