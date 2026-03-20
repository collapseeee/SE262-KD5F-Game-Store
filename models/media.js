const db = require('./db');

const getProductImagesByProductId = async (id) => {
    const sql = `SELECT image_url FROM images WHERE product_id = ?`;
    const payload = [id];
    try {
        const [rows] = await db.promise().execute(sql, payload);
        return rows;
    } catch (err) {
        console.error(err);
    }
}

const getProductVideosByProductId = async (id) => {
    const sql = 'SELECT video_url from videos WHERE product_id = ?';
    const payload = [id];
    try {
        const [rows] = await db.promise().execute(sql, payload);
        return rows;
    } catch (err) {
        console.error(err);
    }
}

module.exports = {
    getProductImagesByProductId,
    getProductVideosByProductId
}