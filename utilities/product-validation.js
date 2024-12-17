const utilities = require(".")
const { body, validationResult } = require("express-validator")
const validate = {}
const productModel = require("../models/product-model")
const invModel = require("../models/inventory-model")

  /*  **********************************
  *  Registration Data Validation Rules
  * ********************************* */
  validate.productRules = () => {
    return [
      // firstname is required and must be string
      body("inv_make")
        .trim()
        .escape()
        .notEmpty()
        .isLength({ min: 1 })
        .withMessage("Please provide a make."), // on error this message is sent.
  
      // lastname is required and must be string
      body("inv_model")
        .trim()
        .escape()
        .notEmpty()
        .isLength({ min: 2 })
        .withMessage("Please provide a model."), // on error this message is sent.
  
     // valid year is required
        body("inv_year")
            .trim()
            .notEmpty()
            .matches(/\d+/g)
            .withMessage("A valid year is required."),
        
        body("inv_make")
        .trim()
        .escape()
        .notEmpty()
        .isLength({ min: 1 })
        .withMessage("Please provide a description."),

        body("inv_image")
        .trim()
        .escape()
        .notEmpty()
        .isLength({ min: 1 })
        .withMessage("Please provide an image route."),

        body("inv_thumbnail")
        .trim()
        .escape()
        .notEmpty()
        .isLength({ min: 1 })
        .withMessage("Please provide a thumbnail route."),

        // valid price is required
        body("inv_price")
            .trim()
            .notEmpty()
            .matches(/\d+/g)
            .withMessage("A valid price is required, use only numbers."),

        // valid price is required
        body("inv_miles")
        .trim()
        .notEmpty()
        .matches(/\d+/g)
        .withMessage("A valid mileage is required, use only numbers."),

        // use color
        body("inv_color")
        .trim()
        .escape()
        .notEmpty()
        .isLength({ min: 1 })
        .withMessage("Please provide a color."),

    ]
  }


    /* ******************************
 * Check data and return errors or continue to classification
 * ***************************** */
    validate.checkProductData = async (req, res, next) => {
        const data = await invModel.getClassifications()
        const grid = await utilities.buildClassificationGrid(data)
        const { inv_make, inv_model, inv_year, inv_description, inv_image, inv_thumbnail, inv_price, inv_miles, inv_color} = req.body
        let errors = []
        errors = validationResult(req)
        if (!errors.isEmpty()) {
          let nav = await utilities.getNav()
          res.render("./inventory/classification", {
            errors,
            title: "Classification",
            nav,
            inv_make, inv_model, inv_year, inv_description, inv_image, inv_thumbnail, inv_price, inv_miles, inv_color,
            grid,
            errors: null,
          })
          return
        }
        next()
      }

         /* ******************************
 * Check data and return errors or continue to classification
 * ***************************** */
    validate.checkUpdateData = async (req, res, next) => {
      const data = await invModel.getClassifications()
      const grid = await utilities.buildClassificationGrid(data)
      const { inv_make, inv_model, inv_year, inv_description, inv_image, inv_thumbnail, inv_price, inv_miles, inv_color, inv_id} = req.body
      let errors = []
      errors = validationResult(req)
      if (!errors.isEmpty()) {
        let nav = await utilities.getNav()
        res.render("./inventory/editInventory", {
          errors,
          title: "Edit Product",
          nav,
          inv_make, inv_model, inv_year, inv_description, inv_image, inv_thumbnail, inv_price, inv_miles, inv_color, inv_id,
          grid,
          errors: null,
        })
        return
      }
      next()
    }

module.exports = validate
