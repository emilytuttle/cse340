const pool = require("../database/index.js")

/* ***************************
 *  Get product  by inv_id
 * ************************** */
async function getProductByInvId(product_id) {
    try {
      const data = await pool.query(
        `SELECT * FROM public.inventory WHERE inv_id = $1`,
        [product_id]
      )
      console.log(data.rows)
      return data.rows
    } catch (error) {
      console.error("getproductbyinvid error " + error)
    }
  }


  module.exports = {getProductByInvId};