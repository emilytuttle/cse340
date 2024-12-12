// Needed Resources 
const express = require("express")
const router = new express.Router() 
const invController = require("../controllers/invController")
const utilities = require("../utilities")
const regValidate = require('../utilities/inv-validation')

// Route to build inventory by classification view
router.get("/type/:classificationId", utilities.handleErrors(invController.buildByClassificationId));

router.get("/", utilities.handleErrors(invController.buildManager))
router.get("/categoryManagement", utilities.handleErrors(invController.buildClassificationManager))
router.get("/productManagement", utilities.handleErrors(invController.buildProductManager))

router.post(
    "/categoryManagement",
    regValidate.classificationRules(),
    regValidate.checkClassificationData,
    utilities.handleErrors(invController.createCategory)
  )

module.exports = router;