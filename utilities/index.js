const invModel = require("../models/inventory-model")
const jwt = require("jsonwebtoken")
require("dotenv").config()

const Util = {}

/* ************************
 * Constructs the nav HTML unordered list
 ************************** */
Util.getNav = async function (req, res, next) {
  let data = await invModel.getClassifications()
  let list = "<ul>"
  list += '<li><a href="/" title="Home page">Home</a></li>'
  list += '<li><a href="/inv/reviews" title="Reviews">Reviews</a></li>'
  data.rows.forEach((row) => {
    list += "<li>"
    list +=
      '<a href="/inv/type/' +
      row.classification_id +
      '" title="See our inventory of ' +
      row.classification_name +
      ' vehicles">' +
      row.classification_name +
      "</a>"
    list += "</li>"
  })
  list += "</ul>"
  return list
}



/* **************************************
* Build the classification view HTML
* ************************************ */
Util.buildClassificationGrid = async function(data){
    let grid
    if(data[0]){
      grid = '<ul id="inv-display">'
      data.forEach(vehicle => { 
        grid += '<li class="classification-vehicle">'
        grid +=  '<a href="../../inv/detail/'+ vehicle.inv_id 
        + '" title="View ' + vehicle.inv_make + ' '+ vehicle.inv_model 
        + 'details"><img src="' + vehicle.inv_thumbnail 
        +'" alt="Image of '+ vehicle.inv_make + ' ' + vehicle.inv_model 
        +' on CSE Motors" /></a>'
        grid += '<div class="namePrice">'
        grid += '<hr />'
        grid += '<h2>'
        grid += '<a href="../../inv/detail/' + vehicle.inv_id +'" title="View ' 
        + vehicle.inv_make + ' ' + vehicle.inv_model + ' details" class="class-link">' 
        + vehicle.inv_make + ' ' + vehicle.inv_model + '</a>'
        grid += '</h2>'
        grid += '<span>$' 
        + new Intl.NumberFormat('en-US').format(vehicle.inv_price) + '</span>'
        grid += '</div>'
        grid += '</li>'
      })
      grid += '</ul>'
    } else { 
      grid += '<p class="notice">Sorry, no matching vehicles could be found.</p>'
    }
    return grid
  }

  /* **************************************
* Build the product view HTML
* ************************************ */

Util.buildProductView = async function(data){
  let productCard = ''
  function formatNumbers(num) {
    const formatter = new Intl.NumberFormat('en-US');
    const formattedNumber = formatter.format(num);
    return formattedNumber
  }
  if(data[0]){
    productCard += `
    <div id="prod-display">
    <img src="${data[0].inv_image}" alt="Image of ${data[0].inv_make} ${data[0].inv_model}" class="prod-img">
      <div id="prod-details">
        <h4>${data[0].inv_make} ${data[0].inv_model} Details:</h4>
        <p>Price: $${formatNumbers(data[0].inv_price)}</p>
        <p>Description: ${data[0].inv_description}</p>
        <p>Color: ${data[0].inv_color}</p>
        <p>Miles: ${formatNumbers(data[0].inv_miles)}</p>
      </div>
      
    </div>
      
    `
    
  } else { 
    productCard += '<h4 class="notice">Sorry, no matching products could be found.</h4>'
  }
  return productCard
}


  /* **************************************
* Build the login form HTML
* ************************************ */

Util.buildLoginForm = async function(data){

  let loginForm = ''
  loginForm += `
  <div id="form-contain">
   <form id="login-form" action="/account/login" method="post">
      <label for="account_email">Email:</label><br>
      <input type="text" id="account_email" name="account_email" ><br>
      <label for="account_password">Password:</label><br>
      <input type="password" id="account_password" name="account_password"><br><br>
      <div class="center">
      <input type="submit" value="Submit" class="login-submit">
      <p>No account? <a href="/account/register">Sign Up</a></p>
      </div>
    </form>
  </div>
  `
  return loginForm

}


  /* **************************************
* Build the Registration form HTML
* ************************************ */

Util.buildRegistrationForm = async function(data){

  let registrationForm = ''
  // registrationForm += `
  // <div id="form-contain">
  //  <form id="register-form" action="/account/register" method="post">
  //     <label for="account_firstname">First Name:</label><br>
  //     <input type="text" id="account_firstname" name="account_firstname" ><br>
  //     <label for="account_lastname">Last Name:</label><br>
  //     <input type="text" id="account_lastname" name="account_lastname" ><br>
  //     <label for="account_email">Email:</label><br>
  //     <input type="text" id="account_email" name="account_email" ><br>
  //     <label for="account_password">Password:</label><br>
  //     <input type="text" id="account_password" name="account_password"><br><br>
  //     <p>Passwords must be a minimum of 12 characters and include 1 capital letter, 1 number, and 1 special character</p>
  //     <div class="center">
  //     <input type="submit" value="Register" class="login-submit">
  //     </div>
  //   </form>
  // </div>
  
  //`
  return registrationForm

}

  /* **************************************
* Build the Product Management form item HTML
* ************************************ */
Util.buildProductManagement = async function(classification_id=null){
  let data = await invModel.getClassifications()
  let productManagement =
    '<select name="classification_id" id="classification_id" required>'
    productManagement += "<option value=''>Choose a Classification</option>"
  data.rows.forEach((row) => {
    productManagement += '<option value="' + row.classification_id + '"'
    if (
      classification_id != null &&
      row.classification_id == classification_id
    ) {
      productManagement += " selected "
    }
    productManagement += ">" + row.classification_name + "</option>"
  })
  productManagement += "</select>"
  return productManagement

}

  /* **************************************
* Build the classification List
* ************************************ */
Util.buildClassificationList = async function(classification_id=null){
  let data = await invModel.getClassifications()
  let productManagement =
    '<select name="classification_id" id="classificationList" required>'
    productManagement += "<option value=''>Choose a Classification</option>"
  data.rows.forEach((row) => {
    productManagement += '<option value="' + row.classification_id + '"'
    if (
      classification_id != null &&
      row.classification_id == classification_id
    ) {
      productManagement += " selected "
    }
    productManagement += ">" + row.classification_name + "</option>"
  })
  productManagement += "</select>"
  return productManagement

}

  /* **************************************
* Build the Review List
* ************************************ */
Util.buildReviewList = async function(){
  let data = await invModel.getReviews()
  let reviewView = `<div id="reviews-container">`
    
  for (let i=0; i< data.length; i++)  {

    reviewView += 
    `
    <div id="review-block">
    <h4>Review by: ${data[i].review_firstname} ${data[i].review_lastname}</h4>
    <h4>Rating: ${data[i].review_stars}/5</h4>
    <p>Review: ${data[i].review_content}</p>
    </div>
    
    `
  }
  reviewView += "</div>"

  
  return reviewView
}


 /* **************************************
* Build the classification List
* ************************************ */
Util.processNameUpdate = async function(classification_id=null){


}



/* ****************************************
 * Middleware For Handling Errors
 * Wrap other function in this for 
 * General Error Handling
 **************************************** */
Util.handleErrors = fn => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next)


/* ****************************************
* Middleware to check token validity
**************************************** */
Util.checkJWTToken = (req, res, next) => {
  if (req.cookies.jwt) {
   jwt.verify(
    req.cookies.jwt,
    process.env.ACCESS_TOKEN_SECRET,
    function (err, accountData) {
     if (err) {
      req.flash("Please log in")
      res.clearCookie("jwt")
      return res.redirect("/account/login")
     }
     res.locals.accountData = accountData
     res.locals.loggedin = 1
     next()
    })
  } else {
    
   next()
  }
 }

 /* ****************************************
* Middleware to check account type
**************************************** */
Util.checkAccountType = (req, res, next) => {
  if (req.cookies.jwt) {
    jwt.verify(
      req.cookies.jwt,
      process.env.ACCESS_TOKEN_SECRET,
      function (err, accountData) {
        res.locals.accountData = accountData
       
       res.locals.loggedin = 1
       console.log("account data:" + res.locals.accountData.account_type)
        console.log("HERE WE GO AGAIN")
        console.log(res.locals.accountData.account_type)
        if (res.locals.accountData.account_type == "Employee") {
          next()
        } else if (res.locals.accountData.account_type == "admin") {
          next()
        } else {
          req.flash("notice", "Access Denied: Insufficient account privileges");
          return res.redirect("/account/login");
        }

        // Proceed to the next middleware or route handler
        next();
      }
    );
  } else {
    // If no JWT cookie is found, allow access to public routes or next middleware
    next();
  }
};

 /* ****************************************
 *  Check Login
 * ************************************ */
 Util.checkLogin = (req, res, next) => {
  if (res.locals.loggedin) {
    next()
  } else {
    req.flash("notice", "Please log in.")
    return res.redirect("/account/login")
  }
 }

 /* ****************************************
 *  LOGOUT
 * ************************************ */
Util.logout = (req, res, next) => {
  if (req.cookies.jwt) {
    jwt.verify(
      req.cookies.jwt,
      process.env.ACCESS_TOKEN_SECRET,
      function (err) {
        if (err) {
          req.flash("Please log in");
          res.clearCookie("jwt");
          return res.redirect("/account/login");
        }
        res.clearCookie("jwt");
        console.log("WE GOT TO HERE AND CLEARED IT")
        next();
      }
    );
  } else {
    next(); // If there's no JWT, just move on to the next middleware
  }
};

module.exports = Util