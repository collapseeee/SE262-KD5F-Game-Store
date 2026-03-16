const db = require('./db');

const getCartByUserId = async (id) => {
    const sql =
        `SELECT ca.product_id, p.name, p.price, p.poster_url, GROUP_CONCAT(c.name SEPARATOR ', ') as categories, ca.cart_date FROM carts ca
        INNER JOIN products p ON p.product_id = ca.product_id
        INNER JOIN product_lists pl ON pl.product_id = p.product_id
        INNER JOIN categories c ON c.category_id = pl.category_id
        WHERE ca.user_id = ?
        GROUP BY ca.product_id, p.name, ca.cart_date;`;

    const payload = [id];

    const [rows] = await db.promise().execute(sql, payload);
    return rows;
}

const getIsInCart = async (userId, productId) => {
    const sql =
        `SELECT c.product_id, a.user_id FROM carts c
        INNER JOIN accounts a ON a.user_id = c.user_id
        WHERE a.user_id = ? AND c.product_id = ?`;
    const payload = [userId, productId];

    const [rows] = await db.promise().execute(sql, payload);

    if (rows.length === 0) {
        return false;
    }
    return true;
}

const addToCart = async (userId, productId) => {
    const sql = `INSERT INTO carts (user_id, product_id, cart_date) VALUES (?, ?, ?);`
    const date = `${new Date().getFullYear()}-${new Date().getMonth()+1}-${new Date().getDate()}`;
    const payload = [userId, productId, date];

    const [rows] = await db.promise().execute(sql, payload);
    return rows;
}

const deleteFromCart = async (userId, productId) => {
    const sql = `DELETE FROM carts WHERE user_id = ? AND product_id = ?`
    const payload = [userId, Number(productId)];
    const [rows] = await db.promise().execute(sql, payload);
    return rows;
}

module.exports = {
    getCartByUserId,
    addToCart,
    deleteFromCart,
    getIsInCart
}