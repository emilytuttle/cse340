const prodModel = require("../models/product-model")
const utilities = require("../utilities/")
const invModel = require("../models/inventory-model")

const prodCont = {}

/* ***************************
 *  Build product by id view
 * ************************** */
prodCont.buildByProdId = async function (req, res, next) {

    const productId = req.params.productID

    const data = await prodModel.getProductByInvId(productId)
    const productCard = await utilities.buildProductView(data)
    let nav = await utilities.getNav()
    if (data.length > 0) {
        const productName = `${data[0].inv_make} ${data[0].inv_model}`
    res.render("./inventory/product", {
        title: productName,
        nav, 
        productCard
    })
    } else {
        res.render("./inventory/product", {
            title: "Product not found",
            nav, 
            productCard
        })
    
}
}


  /* ****************************************
*  Process Product Creation
* *************************************** */
prodCont.createProduct = async function (req, res) {
    const data = await invModel.getClassifications()
    const grid = await utilities.buildClassificationGrid(data)
    let nav = await utilities.getNav()
    const { inv_make, inv_model, inv_year, inv_description, inv_image, inv_thumbnail, inv_price, inv_miles, inv_color, classification_id } = req.body
  
    const regResult = await prodModel.createProduct(
      inv_make, inv_model, inv_year, inv_description, inv_image, inv_thumbnail, inv_price, inv_miles, inv_color, classification_id
    )
  
    if (regResult) {
      req.flash(
        "notice",
        `Congratulations, you created ${inv_make} ${inv_model}.`
      )
      res.status(201).render("./inventory/classification", {
        title: "Classification",
        nav,
        grid,
        errors: null,
      })
    } else {
      req.flash("notice", "Sorry, the registration failed.")
      res.status(501).render("./inventory/categoryManagement", {
        title: "New Category",
        nav,
      })
    }
  }
  
module.exports = prodCont;

