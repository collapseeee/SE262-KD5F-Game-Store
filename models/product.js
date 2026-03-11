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

const addProduct = async (name, description, price, posterUrl) => {
    const sql = `INSERT INTO products (name, description, price, poster_url) VALUES (?, ?, ?, ?)`;
    try {
        const [result] = await db.promise().execute(sql, [name, description, price, posterUrl]);
        return result;
    } catch (err) {
        console.error(err);
    }
};
const addGallery = async (productId, imageUrl) => {
    const sql = `INSERT INTO galleries (product_id, image_url) VALUES (?, ?)`;
    try {
        const [result] = await db.promise().execute(sql, [productId, imageUrl]);
        return result;
    } catch (err) {
        console.error(err);
    }
};
const addVideo = async (productId, videoUrl) => {
    const sql = `INSERT INTO videos (product_id, video_url) VALUES (?, ?)`;
    try {
        const [result] = await db.promise().execute(sql, [productId, videoUrl]);
        return result;
    } catch (err) {
        console.error(err);
    }
};
const addSystemRequirements = async (productId, systemRequirements) => {
    const sql = `INSERT INTO system_requirements (product_id, requirements) VALUES (?, ?)`;
    try {
        const [result] = await db.promise().execute(sql, [productId, systemRequirements]);
        return result;
    } catch (err) {
        console.error(err);
    }
};
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

    sql += ` GROUP BY pl.product_id`;

    try {
        const [rows] = await db.promise().execute(sql, payload);
        return rows;
    } catch (err) {
        console.error(err);
    }
};

module.exports = {
    getAllProduct,
    searchProduct,
    addProduct,
    addGallery,
    addVideo,
    addSystemRequirements
};