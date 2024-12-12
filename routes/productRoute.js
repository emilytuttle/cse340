// Needed Resources 
const express = require("express")
const router = new express.Router() 
const prodController = require("../controllers/productController")
const utilities = require("../utilities")
const regValidate = require("../utilities/product-validation")

router.get("/detail/:productID", utilities.handleErrors(prodController.buildByProdId))



router.post(
    "/productManagement",
    regValidate.productRules(),
    regValidate.checkProductData,
    utilities.handleErrors(prodController.createProduct)
  )

module.exports = router