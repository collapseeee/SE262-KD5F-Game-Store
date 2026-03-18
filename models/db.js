const mysql = require('mysql2');
require('dotenv').config({
    path: process.env.NODE_ENV === 'production'
    ? 'product.env'
    : 'development.env'
});

const config = {
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    user: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
};

const connection = mysql.createPool(config);

function connectWithRetry(retries = 10) {
    connection.getConnection((err, conn) => {
        if (err) {
            console.error(`❌ DB connect failed: ${err.code}`);

            if (retries <= 0) {
                console.error(" No more retries. Exit.");
                process.exit(1);
            }

            console.log("retry in 5 seconds...");
            setTimeout(() => connectWithRetry(retries - 1), 5000);
        } else {
            console.log("Connected to MySQL");
            conn.release(); // สำคัญมาก
        }
    });
}

connectWithRetry();

module.exports = connection;