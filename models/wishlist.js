const db = require('./db');

const getWishlistByUserId = async (id) => {
    const sql =
        `SELECT w.product_id, p.name, p.price, p.poster_url, GROUP_CONCAT(c.name SEPARATOR ', ') as categories, w.wishlist_date FROM wishlists w
        INNER JOIN products p ON p.product_id = w.product_id
        INNER JOIN product_lists pl ON pl.product_id = p.product_id
        INNER JOIN categories c ON c.category_id = pl.category_id
        WHERE w.user_id = ?
        GROUP BY w.product_id, p.name, w.wishlist_date;`;

    const payload = [id];

    const [rows] = await db.promise().execute(sql, payload);
    return rows;
}

const getIsWishlisted = async (userId, productId) => {
    const sql =
        `SELECT w.product_id, a.user_id FROM wishlists w
        INNER JOIN accounts a ON a.user_id = w.user_id
        WHERE a.user_id = ? AND w.product_id = ?`;
    const payload = [userId, productId];

    const [rows] = await db.promise().execute(sql, payload);

    if (rows.length === 0) {
        return false;
    }
    return true;
}

const addToWishlist = async (userId, productId) => {
    const sql = `INSERT INTO wishlists (user_id, product_id, wishlist_date) VALUES (?, ?, ?);`
    const date = `${new Date().getFullYear()}-${new Date().getMonth()}-${new Date().getDate()}`;
    const payload = [userId, productId, date];

    const [rows] = await db.promise().execute(sql, payload);
    return rows;
}

const deleteFromWishlist = async (userId, productId) => {
    const sql = `DELETE FROM wishlists WHERE user_id = ? AND product_id = ?`
    const payload = [userId, Number(productId)];
    const [rows] = await db.promise().execute(sql, payload);
    return rows;
}

module.exports = {
    getWishlistByUserId,
    addToWishlist,
    deleteFromWishlist,
    getIsWishlisted
}