const utilities = require(".")
  const { body, validationResult } = require("express-validator")
  const validate = {}

//   const invModel = require("../models/inventory-model")
//   const productModel = require("../models/product-model")

  /*  **********************************
  *  Classification Data Validation Rules
  * ********************************* */

  validate.classificationRules = () => {
    return [
     // valid classification is required and cannot be characters other than letters
        body("classification_name")
            .trim()
            .escape()
            .notEmpty()
            .isLength({ min: 1 })
            .withMessage("Provide a category name with only letters.")
        ,
    ]
  }

    /* ******************************
 * Check data and return errors or continue to classification
 * ***************************** */
validate.checkClassificationData = async (req, res, next) => {
    const classificationGrid = await utilities.buildClassificationGrid()
    const { classification_name} = req.body
    let errors = []
    errors = validationResult(req)
    if (!errors.isEmpty()) {
      let nav = await utilities.getNav()
      res.render("inventory/classification", {
        errors,
        title: "Classification",
        nav,
        classification_name,
        classificationGrid
      })
      return
    }
    next()
  }
  
  module.exports = validate