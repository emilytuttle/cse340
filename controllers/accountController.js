const utilities = require("../utilities")
const accountModel = require ("../models/account-model")


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

  /* ****************************************
*  Process Registration
* *************************************** */
async function registerAccount(req, res) {
    let nav = await utilities.getNav()
    const registrationForm = await utilities.buildRegistrationForm()
    const loginForm = await utilities.buildLoginForm()
    const { account_firstname, account_lastname, account_email, account_password } = req.body
  
    const regResult = await accountModel.registerAccount(
      account_firstname,
      account_lastname,
      account_email,
      account_password
    )
  
    if (regResult) {
      req.flash(
        "notice",
        `Congratulations, you\'re registered ${account_firstname}. Please log in.`
      )
      res.status(201).render("account/login", {
        title: "Login",
        nav,
        loginForm
      })
    } else {
      req.flash("notice", "Sorry, the registration failed.")
      res.status(501).render("account/register", {
        title: "Registration",
        nav,
        registrationForm
      })
    }
  }
  
  module.exports = { buildLogin, buildRegistration, registerAccount }