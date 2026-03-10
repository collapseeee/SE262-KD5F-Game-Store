const db = require('./db');

const getWishlistByUserId = async (id) => {
    const sql =
        `SELECT w.product_id, p.name, GROUP_CONCAT(c.name SEPARATOR ', ') as categories, w.wishlist_date FROM wishlists w
        INNER JOIN products p ON p.product_id = w.product_id
        INNER JOIN product_lists pl ON pl.product_id = p.product_id
        INNER JOIN categories c ON c.category_id = pl.category_id
        WHERE w.user_id = ?
        GROUP BY w.product_id, p.name, w.wishlist_date;`;

    const payload = [id]

    const [rows] = await db.promise().execute(sql, payload)
    return rows;
}

const addToWishlist = async (id) => {
    const sql = `INSERT INTO wishlists (user_id, product_id, wishlist_date) VALUES (5, 5, '2026-12-3');`
}

module.exports = {
    getWishlistByUserId
}