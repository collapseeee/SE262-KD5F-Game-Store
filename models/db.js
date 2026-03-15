const mysql = require('mysql2');

const config = {
    host: 'localhost',
    user: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: 'kd5f'
}

const connection = mysql.createConnection(config);
connection.connect(err => {
    if (err) throw err;
    console.log("Connected to the MySQL database.");
});

module.exports = connection;