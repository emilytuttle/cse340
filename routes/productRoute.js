// Needed Resources 
const express = require("express")
const router = new express.Router() 
const prodController = require("../controllers/productController")

router.get("/detail/:productID", prodController.buildByProdId)

module.exports = router