const sql = require("../config/connection.js");
const fs = require('fs');
const csv = require('@fast-csv/parse');
const apis = require("../config/apis");
const uploadFolder = require("../config/uploadFolder");

exports.operation = (req, res) => {
    //  console.log("bulk up");
    if (!req.body) {
        res.status(400).send({
            message: "Content can not be empty!"
        });
    } else {
        try {
            let file = req.files.file;
            let fs = require('fs');
            let dir =  uploadFolder.base +  uploadFolder.csv ;
            if (!fs.existsSync(dir)){
                fs.mkdirSync(dir, { recursive: true });
            }
            let fileName = dir + file.name;
            file.mv(fileName, function (err) {
                if (err) {
                    return res.status(500).send(err);
                } else {
                    let arr = [];
                    fs.createReadStream(fileName)
                        .pipe(csv.parse())
                        .on('error', error => console.error(error))
                        .on('data', function (row) {
                            arr.push(row);
                        })
                        .on('end', rowCount => {
                            let query = "";
                            if (req.url === apis.bulkUploadProduct) {
                                bulkUpProduct(arr, res);
                            } else {
                                switch (req.url) {
                                    case apis.bulkUploadVarient:
                                        query = bulkUpVarient(arr);
                                        break;
                                    case apis.bulkUploadCity:
                                        query = bulkUpCity(arr);
                                        break;
                                    case apis.bulkUploadSociety:
                                        query = bulkUpSociety(arr);
                                        break;
                                }
                                //   console.log(query);
                                sql.query(query, (err, result) => {
                                    if (err) {
                                        res.status(500).send({
                                            message:
                                                err.message || "Some error occurred while creating the item."
                                        });
                                    } else {
                                        res.send("Success bulk up")
                                    }
                                });
                            }
                        });
                }
            });
        } catch (err) {
            res.status(500).send({
                //  message: `Could not upload the file: ${req.file.originalname}. ${err}`,
            });
        }
    }
};

function bulkUpProduct(arr, res) {
    let query = "";
    for (let i = 1; i < arr.length; i++) {
        query += `INSERT INTO product (cat_id,product_name,product_image) VALUES ` +
            `('${arr[i][0]}','${arr[i][1]}','/images/products/${arr[i][2]}');`;
    }
    sql.query(query, (err, result) => {
        if (err) {
            console.log(err);
        } else {
            query = "";
            for (let i = 0; i < result.length; i++) {
                query += `INSERT INTO product_varient (product_id,quantity,unit,base_mrp,base_price,description,ean,cost_price,admin_share) VALUES ` +
                    `('${result[i].insertId}','${arr[i + 1][3]}','${arr[i + 1][4]}','${arr[i + 1][5]}','${arr[i + 1][6]}','${arr[i + 1][7]}','${arr[i + 1][8]}','${arr[i + 1][10]}','${arr[i + 1][11]}');`;
                query += `INSERT INTO tags (product_id,tag) VALUES ` +
                    `('${result[i].insertId}','${arr[i + 1][9]}');`;
            }
            sql.query(query, (err, result) => {
                if (err) {
                    res.status(500).send({
                        message:
                            err.message || "Some error occurred while creating the item."
                    });
                } else {
                    res.send("Success bulk up")
                }
            });
        }
    });
}

function bulkUpVarient(arr) {
    let query = "";
    for (let i = 1; i < arr.length; i++) {
        query += `INSERT INTO product_varient (product_id,quantity,unit,base_mrp,base_price,description,ean,cost_price,admin_share) VALUES ` +
            `('${arr[i][0]}','${arr[i][1]}','${arr[i][2]}','${arr[i][3]}','${arr[i][4]}','${arr[i][5]}','${arr[i][6]}','${arr[i][7]}','${arr[i][8]}');`;
    }
    return query;
}

function bulkUpCity(arr) {
    let query = "";
    for (let i = 1; i < arr.length; i++) {
        query += `INSERT INTO city (city_name) VALUES ` +
            `('${arr[i][0]}');`;
    }
    return query;
}

function bulkUpSociety(arr) {
    let query = "";
    for (let i = 1; i < arr.length; i++) {
        query += `INSERT INTO society (society_name,city_id) VALUES ` +
            `('${arr[i][0]}','${arr[i][1]}');`;
    }
    return query;
}


