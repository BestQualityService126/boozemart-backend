const sql = require("../config/db.js");
const fs = require('fs');
const csv = require('@fast-csv/parse');

exports.operation = (req, res) => {
    //  console.log("bulk up");
    if (!req.body) {
        res.status(400).send({
            message: "Content can not be empty!"
        });
    } else {
        let tableName = "";
        switch (req.body.type) {
            case "product":
                tableName = "";
                break;
            case "varient":
                tableName = "product_varient";
                break;
            case "city":
                tableName = "city";
                break;
            case "society":
                tableName = "society";
                break;
        }
        let arr = [];
        console.log(req.body.file.name)
       /* fs.createReadStream(req.body.file)
            .pipe(csv.parse())
            .on('error', error => console.error(error))
            .on('data', function (row) {
                let line = String(row).split(',');
                arr.push(line);
            })
            .on('end', rowCount => {
                let query = "";
                let fields = "";
                for (let i = 0; i < arr[0].length - 1; i++) {
                    fields += arr[0][i] + ",";
                }
                fields += arr[0][arr[0].length - 1];
                for (let i = 1; i < arr.length; i++) {
                    let values = "";
                    for (let j = 0; j < arr[i].length - 1; j++) {
                        values += "'" + arr[i][j] + "',";
                    }
                    values += "'" + arr[i][arr[i].length - 1] + "'";
                    query += `INSERT INTO ${tableName} (${fields}) VALUES (${values});`;
                }
                console.log(query);
                sql.query(query, (err, result) => {
                    if (err) {
                        res.status(500).send({
                            message:
                                err.message || "Some error occurred while creating the Tutorial."
                        });
                    } else {
                        res.send({id: result.insertId, ...req.body.data})
                    }
                });
            });*/
    }
};


