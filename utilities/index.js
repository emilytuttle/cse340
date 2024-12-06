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

// /* **************************************
// * Build the Home view HTML
// * ************************************ */

// Util.getHome = async function(){
//   home = `
//       <div id="welcome">
//         <h3 class="section-title">Welcome to CSE Motors!</h3>
//         <div class="section-content">
//             <div id="welcome-info">
//                 <div id="welcome-info-title">DMC Delorian</div>
//                 <p>3 cup holders</p>
//                 <p>Superman doors</p>
//                 <p>Fuzzy dice!</p>
//                 <button id="own-button">Own Today</button>
//             </div>
            
//             <img src="/images/vehicles/delorean.jpg" alt="delorean" id="delorean-img">
//         </div>
//     </div>
//     <%- include('../inventory/classification') %>
//     <div id="secondary">
//         <div id="reviews">
//             <h3 class="section-title">DMC Delorean Reviews</h3>
//             <ul id="review-list">
//                 <li>"So fast it's almost like traveling in time." (4/5)</li>
//                 <li>"Coolest ride on the road" (4/5)</li>
//                 <li>"I'm feeling McFly!" (5/5)</li>
//                 <li>"The most futuristic ride of our day" (4.5/5)</li>
//                 <li>"80's livin and I love it!" (5/5)</li>
//             </ul>
//         </div>
//         <div id="upgrades">
//             <h3 class="section-title">Delorean Upgrades</h3>
//             <div id="upgrade-box">
//                 <div id="upgrades1" class="upgrades-container">
//                     <div class="box-for-upgrades">
//                         <div class="back-upgrade">
//                             <img src="/images/upgrades/flux-cap.png" alt="Flux Capacitor">
//                         </div>
//                         <a>Flux Capacitor</a>
//                     </div>
//                     <div class="box-for-upgrades">
//                         <div class="back-upgrade">
//                             <img src="/images/upgrades/flame.jpg" alt="Flame Decals">
//                         </div>
//                         <a>Flame Decals</a>
//                     </div>
//                 </div>
//                 <div id="upgrades2" class="upgrades-container">
//                     <div class="box-for-upgrades">
//                         <div class="back-upgrade">
//                             <img src="/images/upgrades/bumper_sticker.jpg" alt="Bumper Stickers">
//                         </div>
//                         <a>Bumper Stickers</a>
//                     </div>
//                     <div class="box-for-upgrades">
//                         <div class="back-upgrade">
//                             <img src="/images/upgrades/hub-cap.jpg" alt="Hub Caps">
//                         </div>
//                         <a>Hub Caps</a>
//                     </div>
//                 </div>
//             </div>
//         </div>
//     </div>
//   `
//   return home
// }

/* **************************************
* Build the classification view HTML
* ************************************ */
Util.buildClassificationGrid = async function(data){
    let grid
    if(data.length > 0){
      grid = '<ul id="inv-display">'
      data.forEach(vehicle => { 
        grid += '<li>'
        grid +=  '<a href="../../inv/detail/'+ vehicle.inv_id 
        + '" title="View ' + vehicle.inv_make + ' '+ vehicle.inv_model 
        + 'details"><img src="' + vehicle.inv_thumbnail 
        +'" alt="Image of '+ vehicle.inv_make + ' ' + vehicle.inv_model 
        +' on CSE Motors" /></a>'
        grid += '<div class="namePrice">'
        grid += '<hr />'
        grid += '<h2>'
        grid += '<a href="../../inv/detail/' + vehicle.inv_id +'" title="View ' 
        + vehicle.inv_make + ' ' + vehicle.inv_model + ' details">' 
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

module.exports = Util