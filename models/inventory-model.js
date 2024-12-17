const pool = require("../database/index.js")

/* ***************************
 *  Get all classification data
 * ************************** */
async function getClassifications(){
  return await pool.query("SELECT * FROM public.classification ORDER BY classification_name")
  
}

/* ***************************
 *  Get all inventory items and classification_name by classification_id
 * ************************** */
async function getInventoryByClassificationId(classification_id) {
    try {
      const data = await pool.query(
        `SELECT * FROM public.inventory AS i 
        JOIN public.classification AS c 
        ON i.classification_id = c.classification_id 
        WHERE i.classification_id = $1`,
        [classification_id]
      )
      console.log(data.rows)
      return data.rows
    } catch (error) {
      console.error("getclassificationsbyid error " + error)
    }
  }



  /* *****************************
*   Create new category
* *************************** */
async function createCategory(classification_name){
  try {
    const sql = "INSERT INTO classification (classification_name) VALUES ($1) RETURNING *"
    return await pool.query(sql, [classification_name])
  } catch (error) {
    return error.message
  }
}

  /* ***************************
 *  Get all Review List items and content
 * ************************** */
  async function getReviews() {
    try {
      const data = await pool.query(
        `SELECT * FROM public.reviews`
      )
      console.log(data.rows)
      return data.rows
    } catch (error) {
      console.error("getReviews model error " + error)
    }
  }

  /* *****************************
*   Create new review
* *************************** */
async function createReview(review_firstname, review_lastname, review_email, review_content, review_stars) {
  try {
    const sql = "INSERT INTO reviews (review_firstname, review_lastname, review_email, review_content, review_stars) VALUES ($1, $2, $3, $4, $5) RETURNING *"
    return await pool.query(sql, [review_firstname, review_lastname, review_email, review_content, review_stars])
  } catch (error) {
    console.error("createReview model error " + error)
    return error.message
  }
}






  module.exports = {getClassifications, getInventoryByClassificationId, createCategory, getReviews, createReview};