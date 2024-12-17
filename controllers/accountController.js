const utilities = require("../utilities")
const accountModel = require ("../models/account-model")
const bcrypt = require("bcryptjs")

const jwt = require("jsonwebtoken")
require("dotenv").config()


/* ****************************************
*  Deliver login view
* *************************************** */
async function buildLogin(req, res, next) {
    const loginForm = await utilities.buildLoginForm()
    let nav = await utilities.getNav()
    res.render("account/login", {
      title: "Login",
      nav,
      loginForm,
      errors: null,
    }) 
  }

/* ****************************************
*  Deliver account details view
* *************************************** */
async function buildAccountDetails(req, res, next) {
  
    
    let nav = await utilities.getNav()
    res.render("account/accountDetails", {
      title: "Account Details",
      nav,
      errors: null,
    })
  }

  /* ****************************************
*  Deliver registration view
* *************************************** */

  async function buildRegistration(req, res, next) {

    const registrationForm = await utilities.buildRegistrationForm()
    let nav = await utilities.getNav()
    res.render("account/register", {
      title: "Registration",
      nav,
      registrationForm,
      errors: null,
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

    // Hash the password before storing
  let hashedPassword
  try {
    // regular password and cost (salt is generated automatically)
    hashedPassword = await bcrypt.hashSync(account_password, 10)
  } catch (error) {
    req.flash("notice", 'Sorry, there was an error processing the registration.')
    res.status(500).render("account/register", {
      title: "Registration",
      nav,
      errors: null,
    })
  }
  
    const regResult = await accountModel.registerAccount(
      account_firstname,
      account_lastname,
      account_email,
      hashedPassword
    )
  
    if (regResult) {
      req.flash(
        "notice",
        `Congratulations, you\'re registered ${account_firstname}. Please log in.`
      )
      res.status(201).render("account/login", {
        title: "Login",
        nav,
        loginForm, 
        errors: null,
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

  async function buildLoggedIn(req, res) {
    let nav = await utilities.getNav()
    
    res.status(201).render("account/loggedIn", {
        title: "Your Account",
        nav,
        errors: null,
      })
  }

    /* ****************************************
*  Process Names Changes
* *************************************** */
async function updateNames(req, res) {
  let nav = await utilities.getNav()
  const registrationForm = await utilities.buildRegistrationForm()
  const loginForm = await utilities.buildLoginForm()
  const { account_firstname, account_lastname, account_email, account_id} = req.body

  const regResult = await accountModel.updateAccountNames(
    account_firstname,
    account_lastname,
    account_email,
    account_id
  )

  if (regResult) {
    let accountData = {
      'account_firstname': account_firstname,
      'account_lastname': account_lastname,
      'account_email': account_email,
      'account_id': account_id

    }
  
    req.flash(
      "notice",
      `Congratulations ${account_firstname}, you\'ve updated your information! Logout and login again with your new information to see your changes!`
    )
    res.status(201).render("account/accountChanges", {
      title: "Update Account",
      nav, 
      errors: null,
    })
  } else {
    req.flash("notice", "Sorry, the account informatation update failed.")
    res.status(501).render("account/accountChanges", {
      title: "Update",
      nav,
    })
  }
}


    /* ****************************************
*  Process Password Changes
* *************************************** */
async function updatePassword(req, res) {
  let nav = await utilities.getNav()
  const registrationForm = await utilities.buildRegistrationForm()
  const loginForm = await utilities.buildLoginForm()
  const { account_password,account_id} = req.body

     // Hash the password before storing
     let hashedPassword
     try {
       // regular password and cost (salt is generated automatically)
       hashedPassword = await bcrypt.hashSync(account_password, 10)
     } catch (error) {
       req.flash("notice", 'Sorry, there was an error processing the registration.')
       res.status(500).render("account/register", {
         title: "Registration",
         nav,
         errors: null,
       })
     }

  const regResult = await accountModel.updatePassword(

    hashedPassword,
    account_id
  )

  if (regResult) {
    req.flash(
      "notice",
      `Congratulations, you\'ve updated your password! Logout and login again with your new information to see your changes!`
    )
    res.status(201).render("account/accountChanges", {
      title: "Update Account",
      nav, 
      errors: null,
    })
  } else {
    req.flash("notice", "Sorry, the account informatation update failed.")
    res.status(501).render("account/accountChanges", {
      title: "Update",
      nav,
    })
  }
}

async function buildLoggedIn(req, res) {
  let nav = await utilities.getNav()
  res.status(201).render("account/loggedIn", {
      title: "Your Account",
      nav,
      errors: null,
    })
}

  /* ****************************************
 *  Process login request
 * ************************************ */
async function accountLogin(req, res) {
  let nav = await utilities.getNav()
  const loginForm = await utilities.buildLoginForm()
  const { account_email, account_password } = req.body
  const accountData = await accountModel.getAccountByEmail(account_email)
  
  if (!accountData) {
    req.flash("notice", "Please check your credentials and try again.")
    res.status(400).render("account/login", {
      title: "Login",
      nav,
      loginForm,
      errors: null,
      account_email,
    })
    return
  }
  try {
    if (await bcrypt.compare(account_password, accountData.account_password)) {
      delete accountData.account_password
      const accessToken = jwt.sign(accountData, process.env.ACCESS_TOKEN_SECRET, { expiresIn: 3600 * 1000 })
      if(process.env.NODE_ENV === 'development') {
        res.cookie("jwt", accessToken, { httpOnly: true, maxAge: 3600 * 1000 })
      } else {
        res.cookie("jwt", accessToken, { httpOnly: true, secure: true, maxAge: 3600 * 1000 })
      }
      return res.redirect("/account/")
    }
    else {
      req.flash("message notice", "Please check your credentials and try again.")
      res.status(400).render("account/login", {
        title: "Login",
        nav,
        errors: null,
        account_email,
      })
    }
  } catch (error) {
    throw new Error('Access Forbidden')
  }
}


// Process to logout
async function accountLogout(req, res) {
  const loginForm = await utilities.buildLoginForm()
    let nav = await utilities.getNav()
    return res.redirect("/account/")
    res.redirect("account/login", {
      title: "Login",
      nav,
      loginForm,
      errors: null,
    })
}


//Name portion of profile update
async function namesUpdate(req, res) {
  let nav = await utilities.getNav()
  res.status(201).render("account/accountChanges", {
    title: "Update Account",
    nav,
    errors: null,
  })
}

  
  module.exports = { buildLogin, buildRegistration, registerAccount, buildLoggedIn, accountLogin, buildAccountDetails, accountLogout, namesUpdate, updateNames, updatePassword }