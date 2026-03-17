const db = require('./db');

const getAllCategory = async () => {
    const sql = `SELECT category_id, name, isHidden FROM categories ORDER BY name ASC`;
    try {
        const [rows] = await db.promise().execute(sql);
        return rows;

    } catch (err) {
        console.error(err);
    }
};

const hideCategory = async (categoryId) => {
    const sql = `
        UPDATE categories c
        SET c.isHidden = !c.isHidden
        WHERE category_id = ?`;
    const payload = [categoryId]

    try {
        const [rows] = await db.promise().execute(sql, payload);
        return rows;
    } catch (err) {
        console.error(err);
    }
}

module.exports = {
    getAllCategory,
    hideCategory
};