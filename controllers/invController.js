const invModel = require("../models/inventory-model")
const utilities = require("../utilities/")
const prodModel = require("../models/product-model")

const invCont = {}

/* ***************************
 *  Build inventory by classification view
 * ************************** */
// console.log("RES DATA BELOW HEREEEEEEE")
//     console.log(res.locals.accountData)
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

/* ***************************
 *  Build edit inventory view
 * ************************** */
invCont.editInventoryView = async function (req, res, next) {
  const inv_id = parseInt(req.params.inv_id)
  let nav = await utilities.getNav()
  const itemData = await prodModel.getProductByInvId(inv_id)
  
  const productManagement = await utilities.buildClassificationList(itemData.classification_id)
  const itemName = `${itemData[0].inv_make} ${itemData[0].inv_model}`
  res.render("./inventory/editInventory", {
    title: "Edit " + itemName,
    nav,
    productManagement: productManagement,
    errors: null,
    inv_id: itemData[0].inv_id,
    inv_make: itemData[0].inv_make,
    inv_model: itemData[0].inv_model,
    inv_year: itemData[0].inv_year,
    inv_description: itemData[0].inv_description,
    inv_image: itemData[0].inv_image,
    inv_thumbnail: itemData[0].inv_thumbnail,
    inv_price: itemData[0].inv_price,
    inv_miles: itemData[0].inv_miles,
    inv_color: itemData[0].inv_color,
    classification_id: itemData[0].classification_id
  })
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
 *  Build review view
 * ************************** */

invCont.buildReviews = async function (req, res, next) {
  let nav = await utilities.getNav()

  const reviewList = await utilities.buildReviewList()


  res.render("./inventory/reviews", {
    title: "Reviews",
    nav,
    reviewList,
    errors: null,

  })
}

  /* ****************************************
*  Process Review Creation
* *************************************** */
invCont.postReview = async function (req, res) {
  console.log("REALLY CURIOUS ARE WE MAKING IT HERE TO THE PROST REVIEW IN INVCONTOLLER")
  
  const { review_firstname, review_lastname, review_email, review_content, review_stars } = req.body

  const regResult = await invModel.createReview(
    review_firstname, review_lastname, review_email, review_content, review_stars
  )

  let nav = await utilities.getNav()
  const reviewList = await utilities.buildReviewList()

  // const data = await invModel.getClassifications()
  // const grid = await utilities.buildClassificationGrid(data)
  
  if (regResult) {
    req.flash(
      "notice",
      `Congratulations, you published a review!`
    )
    res.status(201).render("./inventory/reviews", {
      title: "Reviews",
      nav,
      reviewList,
      errors: null,
    })
  } else {
    req.flash("notice", "Sorry, the review publishing failed, try again.")
    res.status(501).render("inventory/reviews", {
      title: "Reviews",
      reviewList,
      nav,
    })
  }
}

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