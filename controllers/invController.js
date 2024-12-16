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

  const classificationSelect = await utilities.buildClassificationList()


  res.render("./inventory/management", {
    title: "Management",
    nav,
    classificationSelect,
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
  
  const { classification_name } = req.body

  const regResult = await invModel.createCategory(
    classification_name
  )

  // const data = await invModel.getClassifications()
  // const grid = await utilities.buildClassificationGrid(data)
  let nav = await utilities.getNav()
  if (regResult) {
    req.flash(
      "notice",
      `Congratulations, you created ${classification_name}. Add another classification`
    )
    res.status(201).render("inventory/categoryManagement", {
      title: "Classification",
      nav,
      errors: null,
    })
  } else {
    req.flash("notice", "Sorry, the registration failed.")
    res.status(501).render("inventory/categoryManagement", {
      title: "New Category",
      nav,
    })
  }
}
// the following is done in product controller
//   /* ****************************************
// *  Process Product Creation
// * *************************************** */
// invCont.createProduct = async function (req, res) {
  
  
//   const { inv_make, inv_model, inv_year, inv_description, inv_image, inv_thumbnail, inv_price, inv_miles, inv_color, classification_id } = req.body

//   const regResult = await invModel.createProduct(
//     inv_make, inv_model, inv_year, inv_description, inv_image, inv_thumbnail, inv_price, inv_miles, inv_color, classification_id
//   )

//   let nav = await utilities.getNav()

//   if (regResult) {
//     req.flash(
//       "notice",
//       `Congratulations, you created ${inv_make} ${inv_model}. Would you like to make another one?`
//     )
//     res.status(201).render("inventory/productManagement", {
//       title: "New Product",
//       nav,
//       errors: null,
//     })
//   } else {
//     req.flash("notice", "Sorry, the product creation failed.")
//     res.status(501).render("inventory/productManagement", {
//       title: "New Product",
//       nav,
//     })
//   }
// }

/* ***************************
 *  Return Inventory by Classification As JSON
 * ************************** */
invCont.getInventoryJSON = async (req, res, next) => {
  const classification_id = parseInt(req.params.classification_id)
  const invData = await invModel.getInventoryByClassificationId(classification_id)
  if (invData[0].inv_id) {
    return res.json(invData)
  } else {
    next(new Error("No data returned"))
  }
}

module.exports = invCont