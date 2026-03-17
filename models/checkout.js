const db = require('./db');
const { getUserById } = require('./account');

const addOrder = async (userId, productIds, paymentMethod) => {
    const date = new Date();

     // Create the Main Order (One row)
    const [orderResult] = await db.promise().execute(
        `INSERT INTO orders (user_id, order_date, payment_method) VALUES (?, ?, ?)`,
        [userId, date, paymentMethod]
    );

    const newOrderId = orderResult.insertId;

    // Create the Order Items (Multiple rows)
    const itemData = productIds.map(productId => [newOrderId, productId]);
    const itemSql = `INSERT INTO order_items (order_id, product_id) VALUES ?`;
        
    const [itemsResult] = await db.promise().query(itemSql, [itemData]);
    return itemsResult;
};

const updateUserTotalSpend = async (userId, addedAmount) => { // POST method
    const sql = `UPDATE accounts SET total_spend = ? WHERE user_id = ?;`
    const user = await getUserById(userId);
    if (!user) throw new Error("User not found");

    const newAmount = Number(user.total_spend) + Number(addedAmount); 
    const payload = [newAmount, userId];

    const [rows] = await db.promise().execute(sql, payload);
    return rows;
}

const updateUserTotalGame = async (userId, addedAmount) => { // PUT method
    const sql = `UPDATE accounts SET total_game = ? WHERE user_id = ?;`
    const user = await getUserById(userId);
    if (!user) throw new Error("User not found");

    const newAmount = Number(user.total_game) + Number(addedAmount); 
    const payload = [newAmount, userId];

    const [rows] = await db.promise().execute(sql, payload);
    return rows;
}

module.exports = {
    addOrder,
    updateUserTotalSpend,
    updateUserTotalGame
}