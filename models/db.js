const mysql = require('mysql2');
require('dotenv').config();

const config = {
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    user: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: 'kd5f'
};

function createConnectionPool(retryInterval = 5000) {
    const pool = mysql.createPool(config);

    const tryConnect = () => {
        pool.getConnection((err, connection) => {
            if (err) {
                console.error(`DB connection failed: ${err.message}. Retrying in ${retryInterval/1000}s...`);
                setTimeout(tryConnect, retryInterval);
            } else {
                console.log('Database connected successfully!');
                if (connection) connection.release();
            }
        });
    };

    tryConnect();
    return pool;
}

const connection = createConnectionPool();
module.exports = connection;