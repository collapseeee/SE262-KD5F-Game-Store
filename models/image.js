const db = require('./db');

const getImageByGameProductId = async (id) => {
    const sql = `SELECT image_url FROM images WHERE product_id = ?`;
    const payload = [id];
    try {
        const [rows] = await db.promise().execute(sql, payload);
        return rows;
    } catch (err) {
        console.error(err);
    }
}


module.exports = {
    getImageByGameProductId
}