const sql = require("../config/db.js");
const authConfig = require("../config/auth.config");
var jwt = require("jsonwebtoken");
var bcrypt = require("bcryptjs");
const {NULL} = require("mysql/lib/protocol/constants/types");
const uploadFolder = require("../config/uploadFolder");

exports.operation = (req, res) => {
    switch (JSON.parse(req.body.payload).method) {
        case "login":
            login(req, res);
            break;
        case "get":
            get(req, res);
            break;
        case "changePassword":
            changePassword(req, res);
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

function login(req, res) {
    console.log("get");

    let strQuery = `SELECT * FROM admin where email="${JSON.parse(req.body.payload).data.email}"`;

    console.log(strQuery);
    sql.query(strQuery, (err, result) => {
        if (err) {
            res.status(500).send({
                message: err.message || "Some error occurred while retrieving items."
            });
        } else {
            let retData = {success: false, message: 'User Not Found.', userData: NULL};
            console.log(result.length);
            if (result.length > 0) {
                let user = result[0];
                // user.remember_token = '';

                var passwordIsValid = bcrypt.compareSync(
                    JSON.parse(req.body.payload).data.password,
                    user.password
                );
                if (!passwordIsValid) {
                    console.log("invalid password!");
                    retData.message = "Invalid Password!";
                    return res.status(401).send({
                        retData
                    });
                }

                var token = jwt.sign({id: user.id}, authConfig.secret, {
                    expiresIn: authConfig.expiredTime
                });
                retData.success = true;
                retData.message = 'Password matched';
                user.remember_token = token;
                retData.userData = user;
                strQuery = `update admin set remember_token="${token}" where email="${JSON.parse(req.body.payload).data.email}"`
                sql.query(strQuery, (err, result) => {
                    if (err) {
                        res.status(401).send(err);
                    }
                    res.status(200).send({
                        retData
                    });
                });
            } else {
                res.status(401).send(retData);
            }

        }
    });
}

function changePassword(req, res) {
    console.log("get");

    let strQuery = `SELECT * FROM admin where id="${JSON.parse(req.body.payload).id}"`;

    console.log(strQuery);
    sql.query(strQuery, (err, result) => {
        if (err) {
            res.status(500).send({
                message: err.message || "Some error occurred while retrieving items."
            });
        } else {
            let retData = {success: false, message: 'User Not Found.', userData: NULL};
            if (result.length > 0) {
                let user = result[0];
                let passwordIsValid = bcrypt.compareSync(
                    JSON.parse(req.body.payload).currentPassword,
                    user.password
                );
                if (!passwordIsValid) {
                    console.log("invalid password!");
                    retData.message = "Invalid Password!";
                    res.status(401).send({
                        retData
                    });
                }
                let hashPassword = bcrypt.hashSync(JSON.parse(req.body.payload).newPassword, 8);
                strQuery = `update admin set password="${hashPassword}" where id="${JSON.parse(req.body.payload).id}"`;
                sql.query(strQuery, (err, result) => {
                    if (err) {
                        res.status(401).send(err);
                    }
                    res.status(200).send({
                        success: true
                    });
                });
            } else {
                res.status(401).send(retData);
            }

        }
    });
}

function get(req, res) {
    console.log("get");

    let strQuery = `SELECT * FROM admin where email="${JSON.parse(req.body.payload).email}"`;
    console.log(strQuery);
    sql.query(strQuery, (err, result) => {
        if (err) {
            res.status(500).send({
                message: err.message || "Some error occurred while retrieving items."
            });
        } else {
            res.send(result);
        }
    });
}

function add(req, res) {
    console.log("add");
    if (!JSON.parse(req.body.payload)) {
        res.status(400).send({
            message: "Content can not be empty!"
        });
    } else {
        let fields = "";
        let values = "";
        for (let i = 0; i < Object.keys(JSON.parse(req.body.payload).data).length - 1; i++) {
            fields += Object.keys(JSON.parse(req.body.payload).data)[i] + ",";
            values += "'" + JSON.parse(req.body.payload).data[Object.keys(JSON.parse(req.body.payload).data)[i]] + "',";
        }
        fields += Object.keys(JSON.parse(req.body.payload).data)[Object.keys(JSON.parse(req.body.payload).data).length - 1];
        values += "'" + JSON.parse(req.body.payload).data[Object.keys(JSON.parse(req.body.payload).data)[Object.keys(JSON.parse(req.body.payload).data).length - 1]] + "'";
        let query = `INSERT INTO admin (${fields}) VALUES (${values})`;
        console.log(query);
        sql.query(query, (err, result) => {
            if (err) {
                res.status(500).send({
                    message: err.message || "Some error occurred while creating the item."
                });
            } else {
                res.send({id: result.insertId, ...JSON.parse(req.body.payload).data})
            }
        });
    }
}

function update(req, res) {
    console.log("update");
    if (!JSON.parse(req.body.payload).data) {
        res.status(400).send({
            message: "Content can not be empty!"
        });
    } else {
        let payload = JSON.parse(req.body.payload);
        if (req.files !== null) {
            for (let i = 0; i < Object.keys(req.files).length; i++) {
                let file = Object.values(req.files)[i];
                let name = uploadFolder[req.route.path] + file.name;
                let fullName = uploadFolder["base"] + uploadFolder[req.route.path] + file.name;
                payload.data[Object.keys(req.files)[i]] = name;
                try {
                    file.mv(fullName, function (err) {
                        if (err) {
                            return res.status(500).send(err);
                        } else {

                        }
                    });
                } catch (err) {
                    res.status(500).send({
                        //  message: `Could not upload the file: ${req.file.originalname}. ${err}`,
                    });
                }
            }
        }
        let setQuery = "";
        for (let i = 0; i < Object.keys(payload.data).length; i++) {
            setQuery += "," + Object.keys(payload.data)[i] + "='" + payload.data[Object.keys(payload.data)[i]] + "'"
        }
        setQuery = setQuery.slice(1);
        let query = `UPDATE admin SET ${setQuery} where ${payload.where}`;
        console.log(query);
        sql.query(query, (err, result) => {
                if (err) {
                    res.status(500).send({
                        message: "Error updating item with id " + JSON.parse(req.body.payload).id
                    });
                } else {
                    if (result.affectedRows === 0) {
                        res.status(404).send({
                            message: `Not found item with id ${JSON.parse(req.body.payload).id}.`
                        });
                    } else {
                        res.send({id: req.params.id, ...JSON.parse(req.body.payload).data});
                    }
                }
            }
        );
    }
}

function deleteOne(req, res) {
    console.log("delete");
    let query = `DELETE FROM admin WHERE ${JSON.parse(req.body.payload).where}`;
    console.log(query);
    sql.query(query, (err, result) => {
        if (err) {
            res.status(500).send({
                message: "Could not delete item with id " + JSON.parse(req.body.payload).id
            });
        } else {
            if (res.affectedRows === 0) {
                res.status(404).send({
                    message: `Not found item with id ${JSON.parse(req.body.payload).id}.`
                });
            } else {
                res.send({message: `item was deleted successfully!`});
            }
        }
    });
}



