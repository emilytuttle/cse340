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
  const nav = await utilities.getNav()
  if (data.length > 0) { 
    const className = data[0].classification_name
    res.render("./inventory/classification", {
      title: className + " vehicles",
      nav,
      grid,
      errors: null,
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

  /* ****************************************
*  Process Category Creation
* *************************************** */
invCont.createCategory = async function (req, res) {
  const data = await invModel.getClassifications()
  const grid = await utilities.buildClassificationGrid(data)
  let nav = await utilities.getNav()
  const { classification_name } = req.body

  const regResult = await invModel.createCategory(
    classification_name
  )

  if (regResult) {
    req.flash(
      "notice",
      `Congratulations, you created ${classification_name}.`
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

module.exports = invCont