const mysql = require("mysql");
const dbConfig = require("./db.config.js");

module.exports = mysql.createConnection({
    host: dbConfig.HOST,
    user: dbConfig.USER,
    password: dbConfig.PASSWORD,
    database: dbConfig.DB,
    multipleStatements: true
});
