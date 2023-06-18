const connection = require("../config/connection.js");
const dbConfig = require("../config/db.config.js");
const mysql = require("mysql");
const Importer = require('mysql-import');
const log = require('./log');

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

    let strQuery = `SELECT * FROM licensebox WHERE license="${licenseCode}" and client="${name}"`;

    console.log(strQuery);
    sql.query(strQuery, (err, result) => {
        if (err) {
            log.writeLog(err.message || "Some error occurred while retrieving items.");
            res.status(500).send({
                message: err.message || "Some error occurred while retrieving items."
            });
        } else {
            res.send(result)
        }
    });
}

function createDB(req, res) {
    console.log("createDB");

    let host = JSON.parse(req.body.payload).data.host;
    let user = JSON.parse(req.body.payload).data.user;
    let password = JSON.parse(req.body.payload).data.password;
    let database = JSON.parse(req.body.payload).data.database;

    if (host === dbConfig.HOST && user === dbConfig.USER && password === dbConfig.PASSWORD /*&& database === dbConfig.DB*/) {
        let newCon = mysql.createConnection({
            host: host,
            user: user,
            password: password,
        });

        let strQuery = `CREATE DATABASE ${database}`;
        newCon.connect(function (err) {
            if (err) {
                log.writeLog(err.message || "Some error occurred while retrieving items.");
                res.send(err)
            } else {
                console.log("Connected!");
                newCon.query(strQuery, function (err, result) {
                    if (err) {
                        log.writeLog(err.message || "Some error occurred while retrieving items.");
                        res.send(err)
                    } else {
                        /* let fs = require('fs');
                         strQuery = fs.readFileSync("./boozemart.sql").toString();

                         let arrQuery=strQuery.split(";");

                         connection.query(strQuery, (err, result) => {
                             if (err) {
                                 res.status(500).send({
                                     message:
                                         err.message || "Some error occurred while creating the item."
                                 });
                             } else {
                                 res.send("Database created");
                             }
                         });*/


                        const importer = new Importer({host, user, password, database});

                        importer.onProgress(progress => {
                            let percent = Math.floor(progress.bytes_processed / progress.total_bytes * 10000) / 100;
                            console.log(`${percent}% Completed`);
                        });

                        importer.import('./boozemart.sql').then(() => {
                            let files_imported = importer.getImported();
                            console.log(`${files_imported.length} SQL file(s) imported.`);
                        }).catch(err => {
                            log.writeLog(err.message || "Some error occurred while retrieving items.");
                            console.error(err);
                        });
                    }
                });
            }

        });
    } else {
        res.status(500).send("Input correctly")
    }
}
