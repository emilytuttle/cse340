const invModel = require("../models/inventory-model")
const utilities = require("../utilities/")

const invCont = {}

/* ***************************
 *  Build inventory by classification view
 * ************************** */
invCont.buildByClassificationId = async function (req, res, next) {
  const classification_id = req.params.classificationId
  const data = await invModel.getInventoryByClassificationId(classification_id)
  const grid = await utilities.buildClassificationGrid(data)
  let nav = await utilities.getNav()
  if (data.length > 0) { 
    const className = data[0].classification_name
    res.render("./inventory/classification", {
      title: className + " vehicles",
      nav,
      grid,
    })
  } else {
    res.render("./inventory/classification", {
      title: "Not a Classification",
      nav,
      grid,
    })
  }
  
}

/* ***************************
 *  Build management view
 * ************************** */

invCont.buildManager = async function (req, res, next) {
  let nav = await utilities.getNav()
  res.render("./inventory/management", {
    title: "Management",
    nav,
    errors: null,

  })
}

/* ***************************
 *  Build classification management view
 * ************************** */

invCont.buildClassificationManager = async function (req, res, next) {
  let nav = await utilities.getNav()
  res.render("./inventory/categoryManagement", {
    title: "New Classification",
    nav,
    errors: null,
  })
}

/* ***************************
 *  Build Product management view
 * ************************** */

invCont.buildProductManager = async function (req, res, next) {
  let nav = await utilities.getNav()
  let productManagement = await utilities.buildProductManagement()
  res.render("./inventory/productManagement", {
    title: "New Product",
    nav,
    productManagement,
    errors: null,
  })
}

module.exports = invCont