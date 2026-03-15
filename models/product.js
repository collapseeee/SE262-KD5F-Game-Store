const db = require('./db');

const getAllProduct = async () => {
    const sql =
        `SELECT pl.product_id, GROUP_CONCAT(c.name SEPARATOR ', ') AS category, p.name, p.price, p.poster_url FROM product_lists pl
        INNER JOIN products p ON p.product_id = pl.product_id
        INNER JOIN categories c ON c.category_id = pl.category_id
        GROUP BY pl.product_id, p.name, p.price, p.poster_url
        ORDER BY pl.product_id ASC`;
    try {
        const [rows] = await db.promise().execute(sql);
        return rows;
    } catch (err) {
        console.error(err);
    }
};

const getProductById = async (id) => {
    const sql =
        `SELECT p.product_id, a.username, p.name, p.price, p.description, GROUP_CONCAT(c.name SEPARATOR ' | ') as category, p.poster_url FROM products p
        INNER JOIN product_lists pl ON pl.product_id = p.product_id
        INNER JOIN categories c ON pl.category_id = c.category_id
        INNER JOIN accounts a ON a.user_id = pl.user_id
        WHERE p.product_id = ?
        GROUP BY p.product_id, a.username, p.name, p.price, p.description, p.poster_url`;
    const payload = [id];
    try {
        const [rows] = await db.promise().execute(sql, payload);
        return rows[0];
    } catch (err) {
        console.error(err);
    }
}

const getProductRequirementById = async (id) => {
    const sql = `
         SELECT operating_system, processor, memory, graphics_card, directx_version, network, storage, soundcard, additional_note, product_id FROM hardware_requirement
        WHERE product_id = ?
        ORDER BY type ASC`;
    const payload = [id]
    try {
        const [rows] = await db.promise().execute(sql, payload);
        return rows;
    } catch (err) {
        console.error(err);
    }
}

const searchProduct = async (gameName, filteredIds) => {
    let sql =
        `SELECT pl.product_id, GROUP_CONCAT(c.name SEPARATOR ', ') AS category, p.name, p.price, p.poster_url FROM product_lists pl
        INNER JOIN products p ON p.product_id = pl.product_id
        INNER JOIN categories c ON c.category_id = pl.category_id
        WHERE p.name LIKE ?`;
    let payload = [`%${gameName ? gameName : ''}%`]

    if (filteredIds) {
        sql += ` AND pl.category_id IN (?)`;
        payload.push(filteredIds);
    }

    sql += ' GROUP BY pl.product_id';

    try {
        const [rows] = await db.promise().query(sql, payload);
        return rows;
    } catch (err) {
        console.error(err);
    }
}

module.exports = {
    getAllProduct,
    searchProduct,
    getProductById,
    getProductRequirementById
}