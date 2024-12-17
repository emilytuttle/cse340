// Needed Resources 
const express = require("express")
const router = new express.Router() 
const accountController = require("../controllers/accountController")
const utilities = require("../utilities")
const regValidate = require('../utilities/account-validation')

// router.get("/", utilities.handleErrors(accountController.buildLoggedIn))
router.get("/", utilities.checkLogin, utilities.handleErrors(accountController.buildLoggedIn))
router.get("/login", utilities.handleErrors(accountController.buildLogin))
router.get("/register", utilities.handleErrors(accountController.buildRegistration))
router.get("/accountDetails", utilities.checkLogin, utilities.handleErrors(accountController.buildLoggedIn))
router.get( "/update", utilities.checkLogin, utilities.handleErrors(accountController.namesUpdate))


router.post("/updateNames", 
  regValidate.nameUpdateRules(),
  regValidate.checkNameChangeData,
  utilities.handleErrors(accountController.updateNames))

// post
// Process the registration data
router.post(
    "/register",
    regValidate.registrationRules(),
    regValidate.checkRegData,
    utilities.handleErrors(accountController.registerAccount)
  )

  // Process the login request
router.post(
  "/login",
  regValidate.loginRules(),
  regValidate.checkLoginData,
  utilities.handleErrors(accountController.accountLogin)
)




// Process the logout
router.get(
  "/logout",
  utilities.logout,
  utilities.handleErrors(accountController.accountLogout)
)


module.exports = router;