const db = require('./db');

const getAllCategory = async () => {
    const sql = `SELECT category_id, name FROM categories ORDER BY name ASC`;
    try {
        const [rows] = await db.promise().execute(sql);
        return rows;

    } catch (err) {
        console.error(err);
    }
};

module.exports = {
    getAllCategory
};