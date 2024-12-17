// Needed Resources 
const express = require("express")
const router = new express.Router() 
const invController = require("../controllers/invController")
const utilities = require("../utilities")
const regValidate = require('../utilities/inv-validation')
const prodValidate = require('../utilities/product-validation')
const prodController = require('../controllers/productController')

// Route to build inventory by classification view
router.get("/type/:classificationId", utilities.handleErrors(invController.buildByClassificationId));

router.get("/",
  utilities.checkLogin,
  utilities.checkAccountType, 
  utilities.handleErrors(invController.buildManager))

router.get("/categoryManagement", 
  utilities.checkLogin,
  utilities.checkAccountType, 
  utilities.handleErrors(invController.buildClassificationManager))


router.get("/productManagement", 
  utilities.checkLogin,
  utilities.checkAccountType, 
  utilities.handleErrors(invController.buildProductManager))

router.get("/edit/:inv_id", utilities.handleErrors(invController.editInventoryView))

router.get("/reviews", utilities.handleErrors(invController.buildReviews))

router.post("/update/", 
  prodValidate.productRules(),
  prodValidate.checkUpdateData,
  utilities.handleErrors(prodController.updateInventory))


  router.post("/leaveReview",
    // regValidate.reviewRules(),
    // regValidate.checkReviewData,
    utilities.handleErrors(invController.postReview)
  )

router.get("/getInventory/:classification_id", utilities.handleErrors(invController.getInventoryJSON))

router.post(
    "/categoryManagement",
    regValidate.classificationRules(),
    regValidate.checkClassificationData,
    utilities.handleErrors(invController.createCategory)
  )

module.exports = router;