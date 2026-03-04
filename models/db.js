const mysql = require('mysql2');
require('dotenv').config();

const config = {
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    user: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: 'kd5f'
};
/* 
const connection = mysql.createConnection(config);
connection.connect(err => {
    if (err) throw err;
    console.log('Connected to the MySQL database.');
});

module.exports = connection; */