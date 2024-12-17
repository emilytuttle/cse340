const utilities = require(".")
  const { body, validationResult } = require("express-validator")
  const validate = {}
  const invModel = require("../models/inventory-model")

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
            .matches(/^[A-Za-z\s]+$/)
            .withMessage("Provide a category name with only letters.")
        ,
    ]
  }

    /* ******************************
 * Check data and return errors or continue to classification
 * ***************************** */
validate.checkClassificationData = async (req, res, next) => {
    const data = await invModel.getClassifications()
    const grid = await utilities.buildClassificationGrid(data)
    const { classification_name} = req.body
    let errors = []
    errors = validationResult(req)
    if (!errors.isEmpty()) {
      let nav = await utilities.getNav()
      res.render("./inventory/classification", {
        errors,
        title: "Classification",
        nav,
        classification_name,
        grid,
        errors: null,
      })
      return
    }
    next()
  }





  /*  **********************************
  *  Registration Data Validation Rules
  * ********************************* */
  validate.reviewRules = () => {
    return [
      // firstname is required and must be string
      body("review_firstname")
        .trim()
        .escape()
        .notEmpty()
        .isLength({ min: 1 })
        .withMessage("Please provide a first name."), // on error this message is sent.
  
      // lastname is required and must be string
      body("review_lastname")
        .trim()
        .escape()
        .notEmpty()
        .isLength({ min: 2 })
        .withMessage("Please provide a last name."), // on error this message is sent.
  
      // valid email is required
      body("review_email")
      .trim()
      .isEmail()
      .normalizeEmail() // refer to validator.js docs
      .withMessage("A valid email is required."),
        
        body("review_content")
        .trim()
        .escape()
        .notEmpty()
        .isLength({ min: 5 })
        .withMessage("Please provide a description."),

        // valid price is required
        body("inv_price")
            .trim()
            .notEmpty()
            .matches(/\d+/g)
            .withMessage("A valid rating is required, use only numbers.")

    ]
  }


      /* ******************************
 * Check data and return errors or continue to reviews
 * ***************************** */
      validate.checkReviewData = async (req, res, next) => {
        const data = await invModel.getReviews()
        const reviewList = await utilities.buildReviewList()
        const { review_firstname, review_lastname, review_email, review_content, review_stars} = req.body
        let errors = []
        errors = validationResult(req)
        if (!errors.isEmpty()) {
          let nav = await utilities.getNav()
          res.render("./inventory/reviews", {
            errors,
            title: "Reviews",
            nav,
            review_firstname, review_lastname, review_email, review_content, review_stars,
            reviewList,
            errors: null,
          })
          return
        }
        next()
      }

  
  module.exports = validate