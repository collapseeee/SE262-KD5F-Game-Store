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

const getProductById = async (productId) => {
    const sql = `SELECT * FROM products WHERE product_id = ?`;
    const payload = [productId];
    try {
        const [rows] = await db.promise().execute(sql, payload);
        return rows;
    } catch (err) {
        console.error(err);
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
        return { min: {}, rec: {} }; // คืนค่าว่างกรณีเกิด Error
    }
};

const getImagesByProductId = async (productId) => {
    const sql = `SELECT * FROM images WHERE product_id = ?`;
    try {
        const [rows] = await db.promise().query(sql, [productId]);
        // ถ้าไม่มีรูป ให้คืน Array ว่าง []
        return rows || [];
    } catch (err) {
        console.error("Error fetching images:", err);
        return [];
    }
};

const getVideosByProductId = async (productId) => {
    const sql = `SELECT video_url FROM videos WHERE product_id = ?`;
    try {
        const [rows] = await db.promise().query(sql, [productId]);
        
        // คืนค่าเป็น Array ของ URL เพื่อให้ง่ายต่อการนำไปใส่ใน Input
        // เช่น ['url1', 'url2']
        return rows.map(row => row.video_url) || [];
    } catch (err) {
        console.error("Error fetching videos:", err);
        return [];
    }
};
const addProduct = async (name, description, price, posterUrl) => {
    // 1. ตรวจสอบชื่อคอลัมน์ในวงเล็บ (name, description, price, poster_url) ให้ตรงกับใน MySQL เป๊ะๆ
    const sql = `INSERT INTO products (name, description, price, poster_url) VALUES (?, ?, ?, ?)`;
    try {
        const [result] = await db.promise().execute(sql, [name, description, price, posterUrl]);
        
        // 2. เช็กว่า insertId มีค่าออกมาไหม
        if (result && result.insertId) {
            return result.insertId;
        }
        return null;
    } catch (err) {
        // ดู Error ใน Console ของคุณว่า MySQL แจ้งว่าอะไร (เช่น Unknown column หรือ Field ... doesn't have a default value)
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
const deleteGalleryByImageId = async (imageId) => {
    const sql = `DELETE FROM images WHERE image_id = ?`;
    try {
        const [result] = await db.promise().execute(sql, [imageId]);
        return result;
    } catch (err) {
        console.error(err);
    }
};
async function addSystemRequirements(productId, data) {
    // กำหนดให้บันทึก 2 แถวเสมอ (Array 2 ชุดใน values)
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
        // ใช้ .promise().query() ตามที่คุณตั้งค่าไว้
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
    addSystemRequirements,
    getProductById,
    addProductList,
    getRequirementsByProductId,
    getImagesByProductId,
    getVideosByProductId,
    deleteGalleryByImageId,
    getCategoriesByProductId


};