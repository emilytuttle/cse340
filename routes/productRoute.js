// Needed Resources 
const express = require("express")
const router = new express.Router() 
const prodController = require("../controllers/productController")
const utilities = require("../utilities")

router.get("/detail/:productID", utilities.handleErrors(prodController.buildByProdId))

module.exports = router