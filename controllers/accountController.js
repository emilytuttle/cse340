const utilities = require("../utilities")


/* ****************************************
*  Deliver login view
* *************************************** */
async function buildLogin(req, res, next) {

    const loginForm = await utilities.buildLoginForm()
    let nav = await utilities.getNav()
    res.render("account/login", {
      title: "Login",
      nav,
      loginForm
    })
  }

  async function buildRegistration(req, res, next) {

    const registrationForm = await utilities.buildRegistrationForm()
    let nav = await utilities.getNav()
    res.render("account/register", {
      title: "Registration",
      nav,
      registrationForm
    })
  }
  
  module.exports = { buildLogin, buildRegistration }