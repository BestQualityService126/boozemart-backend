const sql = require("../config/db.js");
const dbConfig = require("../config/db.config.js");

exports.operation = (req, res) => {
    switch (JSON.parse(req.body.payload).method) {
        case "verify":
            verify(req, res);
            break;
        case "database":
            createDB(req, res);
            break;
    }
};

function verify(req, res) {
    console.log("verify");

    let licenseCode = JSON.parse(req.body.payload).data.licenseCode;
    let name = JSON.parse(req.body.payload).data.name;

    let strQuery = `SELECT * FROM admin where email="${licenseCode}"`;

    console.log(strQuery);
    sql.query(strQuery, (err, result) => {
        if (err) {
            res.status(500).send({
                message: err.message || "Some error occurred while retrieving items."
            });
        } else {
            res.send()
        }
    });
}

function createDB(req, res) {
    console.log("createDB");

    let host = JSON.parse(req.body.payload).data.host;
    let user = JSON.parse(req.body.payload).data.user;
    let password = JSON.parse(req.body.payload).data.password;
    let database = JSON.parse(req.body.payload).data.database;

    dbConfig.HOST = host;
    dbConfig.USER = user;
    dbConfig.PASSWORD = password;

    let strQuery = `CREATE DATABASE ${database}`;

    console.log(strQuery);
    sql.query(strQuery, (err, result) => {
        if (err) {
            res.status(500).send({
                message: err.message || "Some error occurred while retrieving items."
            });
        } else {
            res.send({success: "ok"})
        }
    });
}
