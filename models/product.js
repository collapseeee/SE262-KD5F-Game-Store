const db = require('./db');

const getAllProduct = async () => {
    const sql =
        `SELECT pl.product_id, c.name AS category, p.name, p.price FROM product_lists pl
        INNER JOIN products p ON p.product_id = pl.product_id
        INNER JOIN categories c ON c.category_id = pl.category_id
        ORDER BY pl.product_id ASC`;
    try {
        const [rows] = await db.promise().execute(sql);
        return rows;
    } catch (err) {
        console.error(err);
    }
};

module.exports = {
    getAllProduct
}