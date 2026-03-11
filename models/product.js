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
        console.log(result.insertId);
        return result.insertId;
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
async function addSystemRequirements(productId, data) {
    const values = [];

    // 1. ตรวจสอบว่ามีการกรอกข้อมูล Minimum หรือไม่ (เช็กจาก min_os)
    if (data.min_os && data.min_os.trim() !== "") {
        values.push([
            productId, 'min',
            data.min_os, data.min_processor, data.min_memory, data.min_graphic,
            data.min_directx, data.min_network, data.min_storage, data.min_soundcard, data.min_notes
        ]);
    }

    // 2. ตรวจสอบว่ามีการกรอกข้อมูล Recommended หรือไม่ (เช็กจาก rec_os)
    if (data.rec_os && data.rec_os.trim() !== "") {
        values.push([
            productId, 'recommended',
            data.rec_os, data.rec_processor, data.rec_memory, data.rec_graphic, 
            data.rec_directx, data.rec_network, data.rec_storage, data.rec_soundcard, data.rec_notes
        ]);
    }

    // 3. ถ้าไม่มีการกรอกข้อมูลเลย ให้จบฟังก์ชันไปเลย
    if (values.length === 0) return null;

    const sql = `
        INSERT INTO hardware_requirement
        (product_id, type, operating_system, processor, memory, graphics_card, directx_version, network, storage, soundcard, additional_note)
        VALUES ?`;

    try {
        const [result] = await db.promise().query(sql, [values]);
        return result;
    } catch (error) {
        console.error("Error saving System Requirements:", error);
        throw error;
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