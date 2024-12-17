const prodModel = require("../models/product-model")
const utilities = require("../utilities/")
const invModel = require("../models/inventory-model")
const invCont = require("../controllers/invController")

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
    
    const { inv_make, inv_model, inv_year, inv_description, inv_image, inv_thumbnail, inv_price, inv_miles, inv_color, classification_id } = req.body
  
    const regResult = await prodModel.createProduct(
      inv_make, inv_model, inv_year, inv_description, inv_image, inv_thumbnail, inv_price, inv_miles, inv_color, classification_id
    )

    // const data = await invCont.getInventoryByClassificationId(classification_id)
    // const grid = await utilities.buildClassificationGrid(data)
    let nav = await utilities.getNav()
    let productManagement = await utilities.buildProductManagement()
  
    if (regResult) {
      req.flash(
        "notice",
        `Congratulations, you created ${inv_make} ${inv_model}. Create another vehicle or go view your new product in its classification`
      )
      res.status(201).render("./inventory/productManagement", {
        title: "New Product",
        nav,
        productManagement,
        errors: null,
      })
    } else {
      req.flash("notice", "Sorry, the registration failed.")
      res.status(501).render("./inventory/productManagement", {
        title: "New Product",
        nav,
      })
    }
  }



  /* ****************************************
*  Process Product Update
* *************************************** */
prodCont.updateInventory = async function (req, res) {
  
    
  const { inv_id, inv_make, inv_model, inv_year, inv_description, inv_image, inv_thumbnail, inv_price, inv_miles, inv_color, classification_id } = req.body

  const decodedImagePath = inv_image.replace(/&#x2F;/g, '/');
    const decodedThumbPath = inv_thumbnail.replace(/&#x2F;/g, '/');
  const updateResult = await prodModel.updateInventory(
    inv_id, inv_make, inv_model, inv_year, inv_description, decodedImagePath, decodedThumbPath, inv_price, inv_miles, inv_color, classification_id
  )

  // const data = await invCont.getInventoryByClassificationId(classification_id)
  // const grid = await utilities.buildClassificationGrid(data)
  let nav = await utilities.getNav()
  let productManagement = await utilities.buildProductManagement()

  if (updateResult) {
    const itemName = updateResult.inv_make + " " + updateResult.inv_model
    req.flash("notice", `The ${itemName} was successfully updated.`)
    res.redirect("/inv/")
  } else {
    const classificationSelect = await utilities.buildClassificationList(classification_id)
    const itemName = `${inv_make} ${inv_model}`
    req.flash("notice", "Sorry, the insert failed.")
    res.status(501).render("inventory/editInventory", {
    title: "Edit " + itemName,
    nav,
    productManagement,
    classificationSelect: classificationSelect,
    errors: null,
    inv_id,
    inv_make,
    inv_model,
    inv_year,
    inv_description,
    inv_image,
    inv_thumbnail,
    inv_price,
    inv_miles,
    inv_color,
    classification_id
    })
  }
}
  
module.exports = prodCont;

