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

    /* *****************************
*   Create new product
* *************************** */
async function createProduct(inv_make, inv_model, inv_year,inv_description, inv_image, inv_thumbnail, inv_price, inv_miles, inv_color, classification_id){
  try {
    const sql = "INSERT INTO public.inventory (inv_make, inv_model, inv_year, inv_description, inv_image, inv_thumbnail, inv_price, inv_miles, inv_color, classification_id) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10) RETURNING *"
    return await pool.query(sql, [inv_make, inv_model, inv_year, inv_description, inv_image, inv_thumbnail, inv_price, inv_miles, inv_color, classification_id])
  } catch (error) {
    return error.message
  }
}



  module.exports = {getProductByInvId, createProduct};