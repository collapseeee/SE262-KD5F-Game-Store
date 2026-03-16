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
};

const getProductByIdForEdit = async (id) => {
    const sql = `SELECT product_id, name, price, description, poster_url FROM products WHERE product_id = ?`;
    const payload = [id];
    try {
        const [rows] = await db.promise().execute(sql, payload);
        return rows[0];
    } catch (err) {
        console.error(err);
    }
};


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
        console.log(err);
    }
};
const getCategoriesByProductId = async (productId) => {
    const sql = `SELECT c.category_id, c.name FROM product_lists pl INNER JOIN categories c ON pl.category_id = c.category_id WHERE pl.product_id = ?`;
    try {
        const [rows] = await db.promise().execute(sql, [productId]);
        return rows;
    } catch (err) {
        console.error(err);
        return [];
    }

};
const getRequirementsByProductId = async (productId) => {
    const sql = `SELECT * FROM hardware_requirement WHERE product_id = ?`;
    try {
        const [rows] = await db.promise().query(sql, [productId]);

        // ถ้าไม่พบข้อมูลเลย ให้ส่ง Object ว่างกลับไป (จบการทำงานแบบปลอดภัย)
        if (!rows || rows.length === 0) {
            return { min: {}, rec: {} };
        }

        // คืนค่าแบบแยกประเภท
        return {
            min: rows.find(r => r.type === 'min') || {},
            rec: rows.find(r => r.type === 'recommended') || {}
        };
    } catch (err) {
        console.error("Error fetching requirements:", err);
        return { min: {}, rec: {} };
    }
};

const getImagesByProductId = async (productId) => {
    const sql = `SELECT * FROM images WHERE product_id = ?`;
    try {
        const [rows] = await db.promise().query(sql, [productId]);
        return rows || [];
    } catch (err) {
        console.error("Error fetching images:", err);
        return [];
    }
};

const getVideosByProductId = async (productId) => {
    const sql = `SELECT video_id, video_url FROM videos WHERE product_id = ?`;
    try {
        const [rows] = await db.promise().query(sql, [productId]);
        return rows || [];
    } catch (err) {
        console.error("Error fetching videos:", err);
        return [];
    }
};
const addProduct = async (name, description, price, posterUrl) => {
    const sql = `INSERT INTO products (name, description, price, poster_url) VALUES (?, ?, ?, ?)`;
    try {
        const [result] = await db.promise().execute(sql, [name, description, price, posterUrl]);

        if (result && result.insertId) {
            return result.insertId;
        }
        return null;
    } catch (err) {
        console.error("MySQL Insert Error:", err.message);
        return null;
    }
};

const addProductList = async (productId, categoryId, userId) => {
    const sql = `INSERT INTO product_lists (product_id, category_id, user_id,release_date) VALUES (?, ?, ?, CURDATE())`;
    try {
        const [result] = await db.promise().execute(sql, [productId, categoryId, userId]);
        return result;
    } catch (err) {
        console.error(err);
    }
};
const addGallery = async (productId, imageUrl) => {
    const sql = `INSERT INTO images ( image_url, product_id) VALUES (?, ?)`;
    try {
        const [result] = await db.promise().execute(sql, [productId, imageUrl]);
        return result;
    } catch (err) {
        console.error(err);
    }
};
const addVideo = async (productId, videoUrl) => {
    const sql = `INSERT INTO videos (video_url, product_id) VALUES (?, ?)`;
    try {
        const [result] = await db.promise().execute(sql, [productId, videoUrl]);
        return result;
    } catch (err) {
        console.error(err);
    }
};
const deleteProductbyId = async (productId) => {
    const sql = `DELETE FROM products WHERE product_id = ?`;
    try {
        const [result] = await db.promise().execute(sql, [productId]);
        return result;
    } catch (err) {
        console.error(err);
    }
};

const deleteGalleryByImageId = async (imageId) => {
    const sql = `DELETE FROM images WHERE image_id = ?`;
    try {
        const [result] = await db.promise().execute(sql, [imageId]);
        return result;
    } catch (err) {
        console.error(err);
    }
};
const deleteProdcutListByProductId = async (productId) => {
    const sql = `DELETE FROM product_lists WHERE product_id = ?`;
    try {
        const [result] = await db.promise().execute(sql, [productId]);
        return result;
    } catch (err) {
        console.error(err);
    }
};
async function addSystemRequirements(productId, data) {
    const values = [
        [
            productId,
            'min',
            data.min_os || '-',
            data.min_processor || '-',
            data.min_memory || '-',
            data.min_graphic || '-',
            data.min_directx || '-',
            data.min_network || '-',
            data.min_storage || '-',
            data.min_soundcard || '-',
            data.min_notes || '-'
        ],
        [
            productId,
            'recommended',
            data.rec_os || '-',
            data.rec_processor || '-',
            data.rec_memory || '-',
            data.rec_graphic || '-',
            data.rec_directx || '-',
            data.rec_network || '-',
            data.rec_storage || '-',
            data.rec_soundcard || '-',
            data.rec_notes || '-'
        ]
    ];

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


const updateProduct = async (productId, name, description, price, posterUrl) => {

    let sql;
    let params;

    if (posterUrl) {
        sql = `
        UPDATE products
        SET name=?, description=?, price=?, poster_url=?
        WHERE product_id=?`;
        params = [name, description, price, posterUrl, productId];
    } else {
        sql = `
        UPDATE products
        SET name=?, description=?, price=?
        WHERE product_id=?`;
        params = [name, description, price, productId];
    }

    try {
        const [result] = await db.promise().execute(sql, params);
        return result;
    } catch (err) {
        console.error(err);
        return null;
    }
};
const updateSystemRequirements = async (productId, data) => {
    const sql = `
        UPDATE hardware_requirement
        SET operating_system = ?, processor = ?, memory = ?, graphics_card = ?, directx_version = ?, network = ?, storage = ?, soundcard = ?, additional_note = ?
        WHERE product_id = ? AND type = ?`;
    try {
        const minResult = await db.promise().execute(sql, [
            data.min_os || '-',
            data.min_processor || '-',
            data.min_memory || '-',
            data.min_graphic || '-',
            data.min_directx || '-',
            data.min_network || '-',
            data.min_storage || '-',
            data.min_soundcard || '-',
            data.min_notes || '-',
            productId,
            'min'
        ]);
        const recResult = await db.promise().execute(sql, [
            data.rec_os || '-',
            data.rec_processor || '-',
            data.rec_memory || '-',
            data.rec_graphic || '-',
            data.rec_directx || '-',
            data.rec_network || '-',
            data.rec_storage || '-',
            data.rec_soundcard || '-',
            data.rec_notes || '-',
            productId,
            'recommended'
        ]);
        return { min: minResult, rec: recResult };
    } catch (err) {
        console.error("Error updating System Requirements:", err);
        return null;
    }
};

const updateGallery = async (imageId, imageUrl) => {
    const sql = `UPDATE images SET image_url = ? WHERE image_id = ?`;
    try {
        const [result] = await db.promise().execute(sql, [imageUrl, imageId]);
        return result;
    } catch (err) {
        console.error("Error updating gallery image:", err);
        return null;
    }
};

const updateVideo = async (videoId, videoUrl) => {
    const sql = `UPDATE videos SET video_url = ? WHERE video_id = ?`;
    try {
        const [result] = await db.promise().execute(sql, [videoUrl, videoId]);
        return result;
    } catch (err) {
        console.error("Error updating video URL:", err);
        return null;
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

    sql += ' GROUP BY pl.product_id';

    try {
        const [rows] = await db.promise().query(sql, payload);
        return rows;
    } catch (err) {
        console.error(err);
    }
};

module.exports = {
    getAllProduct,
    searchProduct,
    getProductById,
    getProductRequirementById,
    addProduct,
    addGallery,
    addVideo,
    addSystemRequirements,
    addProductList,
    getRequirementsByProductId,
    getImagesByProductId,
    getVideosByProductId,
    deleteGalleryByImageId,
    getCategoriesByProductId,
    updateProduct,
    updateSystemRequirements,
    updateGallery,
    updateVideo,
    deleteProdcutListByProductId,
    getProductByIdForEdit,
    deleteProductbyId
};
