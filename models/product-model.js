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

/* ***************************
 *  Update Inventory Data
 * ************************** */
async function updateInventory(
  inv_id,
  inv_make,
  inv_model,
  inv_description,
  inv_image,
  inv_thumbnail,
  inv_price,
  inv_year,
  inv_miles,
  inv_color,
  classification_id
  
) {
  try {
    console.log(`Prepared values for SQL: 
      inv_make: ${inv_make}, 
      inv_model: ${inv_model}, 
      inv_description: ${inv_description}, 
      inv_image: ${inv_image}, 
      inv_thumbnail: ${inv_thumbnail}, 
      inv_price: ${inv_price}, 
      inv_year: ${inv_year}, 
      inv_miles: ${inv_miles}, 
      inv_color: ${inv_color}, 
      classification_id: ${classification_id}, 
      inv_id: ${inv_id}`
    );
    const decodedImagePath = inv_image.replace(/&#x2F;/g, '/');
    const decodedThumbPath = inv_thumbnail.replace(/&#x2F;/g, '/');
    console.log("THUMB HERE")
    console.log(decodedThumbPath)
    const sql =
      "UPDATE public.inventory SET inv_make = $1, inv_model = $2, inv_description = $3, inv_image = $4, inv_thumbnail = $5, inv_price = $6, inv_year = $7, inv_miles = $8, inv_color = $9, classification_id = $10 WHERE inv_id = $11 RETURNING *"
    const data = await pool.query(sql, [
      inv_make,
      inv_model,
      inv_description,
      decodedImagePath,
      decodedThumbPath,
      inv_price,
      inv_year,
      inv_miles,
      inv_color,
      classification_id,
      inv_id
    ])
    return data.rows[0]
  } catch (error) {
    console.error("model error: " + error)
  }
}




  module.exports = {getProductByInvId, createProduct, updateInventory};