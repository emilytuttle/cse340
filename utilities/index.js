const invModel = require("../models/inventory-model")

const Util = {}

/* ************************
 * Constructs the nav HTML unordered list
 ************************** */
Util.getNav = async function (req, res, next) {
  let data = await invModel.getClassifications()
  let list = "<ul>"
  list += '<li><a href="/" title="Home page">Home</a></li>'
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
    <img src="${data[0].inv_image}" alt="Image of ${data[0].inv_make} ${data[0].inv_model}" class="prod-img"/>
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


/* ****************************************
 * Middleware For Handling Errors
 * Wrap other function in this for 
 * General Error Handling
 **************************************** */
Util.handleErrors = fn => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next)

module.exports = Util