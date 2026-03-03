require('dotenv').config();
const MySQLStore = require('express-mysql-session')(require('express-session'));
const sessionStore = new MySQLStore({
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    user: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: 'kd5f',
    createDatabaseTable: true,
});

module.exports = sessionStore;