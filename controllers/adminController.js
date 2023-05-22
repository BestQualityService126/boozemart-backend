const sql = require("../config/db.js");
const tables = require("../config/tables");
const crypto = require("crypto");
const authConfig = require("../config/auth.config");
var jwt = require("jsonwebtoken");
var bcrypt = require("bcryptjs");
const {NULL} = require("mysql/lib/protocol/constants/types");

exports.operation = (req, res) => {
    switch (req.body.method) {
        case "get":
            get(req, res);
            break;
        case "add":
            add(req, res);
            break;
        case "update":
            update(req, res);
            break;
        case "delete":
            deleteOne(req, res);
            break;
    }
};

function get(req, res) {
    console.log("get");
    //
    // const hashPassword = password => {
    //     return crypto.createHash('sha256').update(password).digest('hex')
    // }
    // const password = hashPassword(req.body.data.password)
    // console.log(password)

    //
    // const compareHashPassword = (password, hashedPassword) => {
    //     if (hashPassword(password) === hashedPassword) {
    //         return { success: true, message: 'Password matched' }
    //     }
    //     return { success: false, message: 'Password not matched' }
    // }
    //
    // const result = compareHashPassword('secret', hashedPassword)
    // console.log(result)

    let strQuery = `SELECT * FROM admin where email="${req.body.data.email}"`;
    console.log(req);

    console.log(strQuery);
    sql.query(strQuery, (err, result) => {
        if (err) {
            res.status(500).send({
                message:
                    err.message || "Some error occurred while retrieving data from database."
            });
        } else {
            let retData = {success: false, message: 'User Not Found.', userData: NULL};
            console.log(result.length);
            if(result.length > 0){
                let user = result[0];
                // user.remember_token = '';

                var passwordIsValid = bcrypt.compareSync(
                    req.body.data.password,
                    user.password
                );
                if (!passwordIsValid) {
                    console.log("invalid password!")
                    retData.message = "Invalid Password!"
                    return res.status(401).send({
                        retData
                    });
                }

                var token = jwt.sign({ id: user.id }, authConfig.secret, {
                    expiresIn: authConfig.expiredTime
                });
                retData.success = true;
                retData.message = 'Password matched';
                user.remember_token = token;
                retData.userData = user;
                strQuery = `update admin set remember_token="${token}" where email="${req.body.data.email}"`
                sql.query(strQuery, (err, result) => {
                    if(err){
                        res.status(401).send(err);
                    }
                    res.status(200).send({
                        retData
                    });
                });
            }else{
                res.status(401).send(retData);
            }

        }
    });
}

function add(req, res) {
    console.log("add");
    if (!req.body) {
        res.status(400).send({
            message: "Content can not be empty!"
        });
    } else {
        let fields = "";
        let values = "";
        for (let i = 0; i < Object.keys(req.body.data).length - 1; i++) {
            fields += Object.keys(req.body.data)[i] + ",";
            values += "'" + req.body.data[Object.keys(req.body.data)[i]] + "',";
        }
        fields += Object.keys(req.body.data)[Object.keys(req.body.data).length - 1];
        values += "'" + req.body.data[Object.keys(req.body.data)[Object.keys(req.body.data).length - 1]] + "'";
        let query = `INSERT INTO admin (${fields}) VALUES (${values})`;
        console.log(query);
        sql.query(query, (err, result) => {
            if (err) {
                res.status(500).send({
                    message:
                        err.message || "Some error occurred while creating the User."
                });
            } else {
                res.send({id: result.insertId, ...req.body.data})
            }
        });
    }
}

function update(req, res) {
    console.log("update");
    if (!req.body.data) {
        res.status(400).send({
            message: "Content can not be empty!"
        });
    }
    let setQuery = "";
    let data = req.body.data;
    for (let i = 0; i < Object.keys(data).length - 1; i++) {
        setQuery += Object.keys(data)[i] + "='" + data[Object.keys(data)[i]] + "',"
    }
    setQuery += Object.keys(data)[Object.keys(data).length - 1] + "='" + data[Object.keys(data)[Object.keys(data).length - 1]] + "'";

    let query = `UPDATE admin SET ${setQuery} where email=${req.body.data.email} and password=${req.body.data.password}`;
    console.log(query);
    sql.query(query, (err, result) => {
            if (err) {
                res.status(500).send({
                    message: "Error updating User with id " + req.body.id
                });
            } else {
                if (result.affectedRows === 0) {
                    res.status(404).send({
                        message: `Not found User with id ${req.body.id}.`
                    });
                } else {
                    res.send({id: req.params.id, ...req.body.data});
                }
            }
        }
    );
}

function deleteOne(req, res) {
    console.log("delete");
    let query = `DELETE FROM admin WHERE ${req.body.where}`;
    console.log(query);
    sql.query(query, (err, result) => {
        if (err) {
            res.status(500).send({
                message: "Could not delete User with id " + req.body.id
            });
        } else {
            if (res.affectedRows === 0) {
                res.status(404).send({
                    message: `Not found User with id ${req.body.id}.`
                });
            } else {
                res.send({message: `User was deleted successfully!`});
            }
        }
    });
}



