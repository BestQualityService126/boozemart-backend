const sql = require("../config/db.js");
const tables = require("../config/tables");

exports.operation = (req, res) => {
    switch (req.body.method) {
        case "get":
            get(req, res);
            break;
        case "add":
            add(req, res);
            break;
        case "addMulti":
            addMulti(req, res);
            break;
        case "update":
            update(req, res);
            break;
        case "updateMulti":
            updateMulti(req, res);
            break;
        case "delete":
            deleteOne(req, res);
            break;
        case "deleteAll":
            deleteAll(req, res);
            break;
    }
};

function join(subTables) {
    let query = '';
    if (Object.keys(subTables).length > 0) {
        for (let i = 0; i < Object.keys(subTables).length; i++) {
            let joinTable = subTables[i];
            query += ` LEFT JOIN ${joinTable[0]} ON ${joinTable[1]}=${joinTable[2]}`
        }
    }
    return query
}

function getWhere(whereFromFront, whereFromBack) {
    let query = '';
    let flag = false;
    if ((whereFromFront !== undefined && whereFromFront.length > 0) || (whereFromBack.length > 0)) {
        query += ` WHERE`;
    }
    if (whereFromFront !== undefined && whereFromFront.length > 0) {
        for (let i = 0; i < whereFromFront.length - 1; i++) {
            query += ` ${whereFromFront[i]} and`;
        }
        query += ` ${whereFromFront[whereFromFront.length - 1]}`;
        flag = true;
    }
    if (whereFromBack.length > 0) {
        query += flag ? " and" : "";
        for (let i = 0; i < whereFromBack.length - 1; i++) {
            query += ` ${whereFromBack[i]} and`;
        }
        query += ` ${whereFromBack[whereFromBack.length - 1]}`;
    }
    return query;
}

function getOrderBy(orderBy) {
    let query = '';
    if (orderBy.length > 0) {
        query += " ORDER BY ";
        for (let i = 0; i < orderBy.length - 1; i++) {
            query += orderBy[i] + ",";
        }
        query += orderBy[orderBy.length - 1];
    }
    return query;
}

function getGroupBy(groupBy) {
    let query = '';
    if (groupBy.length > 0) {
        query += " GROUP BY ";
        for (let i = 0; i < groupBy.length - 1; i++) {
            query += groupBy[i] + ",";
        }
        query += groupBy[groupBy.length - 1];
    }
    return query;
}

function getSelect(select) {
    let query = "";
    if (select.length > 0) {
        query += " ";
        for (let i = 0; i < select.length - 1; i++) {
            query += select[i] + ",";
        }
        query += select[select.length - 1];
        query += " ";
    }
    return query;
}

function get(req, res) {
    console.log("get");
    console.log(req.originalUrl, req.body)
    let requestUrl = req.originalUrl;
    let mainTable = tables[requestUrl].main;
    let subTables = tables[requestUrl].sub;
    let where = tables[requestUrl].where;
    let orderBy = tables[requestUrl].orderBy;
    let groupBy = tables[requestUrl].groupBy;
    let select = tables[requestUrl].select;

    let query = `SELECT ${getSelect(select)} FROM ${mainTable}`;

    query += join(subTables) + getWhere(req.body.where, where) + getGroupBy(groupBy) + getOrderBy(orderBy);
    console.log(query);
    sql.query(query, (err, result) => {
        if (err) {
            res.status(500).send({
                message:
                    err.message || "Some error occurred while retrieving items."
            });
        } else {
            res.send(result);
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
        let requestUrl = req.originalUrl;
        let mainTable = tables[requestUrl].main;
        let fields = "";
        let values = "";
        for (let i = 0; i < Object.keys(req.body.data).length - 1; i++) {
            fields += Object.keys(req.body.data)[i] + ",";
            values += "'" + req.body.data[Object.keys(req.body.data)[i]] + "',";
        }
        fields += Object.keys(req.body.data)[Object.keys(req.body.data).length - 1];
        values += "'" + req.body.data[Object.keys(req.body.data)[Object.keys(req.body.data).length - 1]] + "'";
        let query = `INSERT INTO ${mainTable} (${fields}) VALUES (${values})`;
        console.log(query);
        sql.query(query, (err, result) => {
            if (err) {
                res.status(500).send({
                    message:
                        err.message || "Some error occurred while creating the item."
                });
            } else {
                res.send({id: result.insertId, ...req.body.data})
            }
        });
    }
}

function addMulti(req, res) {
    console.log("add");
    if (!req.body) {
        res.status(400).send({
            message: "Content can not be empty!"
        });
    } else {
        let requestUrl = req.originalUrl;
        let mainTable = tables[requestUrl].main;
        let query = "";
        for (let j = 0; j < req.body.data.length; j++) {
            let fields = "";
            let values = "";
            for (let i = 0; i < Object.keys(req.body.data[j]).length - 1; i++) {
                fields += Object.keys(req.body.data[j])[i] + ",";
                values += "'" + req.body.data[j][Object.keys(req.body.data[j])[i]] + "',";
            }
            fields += Object.keys(req.body.data[j])[Object.keys(req.body.data[j]).length - 1];
            values += "'" + req.body.data[j][Object.keys(req.body.data[j])[Object.keys(req.body.data[j]).length - 1]] + "'";
            query += `INSERT INTO ${mainTable} (${fields}) VALUES (${values});`;
        }

        console.log(query);
        sql.query(query, (err, result) => {
            if (err) {
                res.status(500).send({
                    message: err.message || "Some error occurred while creating the item."
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
    let requestUrl = req.originalUrl;
    let mainTable = tables[requestUrl].main;
    let query = `UPDATE ${mainTable} SET ${setQuery}  ${getWhere(req.body.where, [])}`;
    console.log(query);
    sql.query(query, (err, result) => {
            if (err) {
                res.status(500).send({
                    message: "Error updating item with id " + req.body.id
                });
            } else {
                if (result.affectedRows === 0) {
                    res.status(404).send({
                        message: `Not found item with id ${req.body.id}.`
                    });
                } else {
                    res.send({id: req.params.id, ...req.body.data});
                }
            }
        }
    );
}

function updateMulti(req, res) {
    console.log("update");
    if (!req.body.data) {
        res.status(400).send({
            message: "Content can not be empty!"
        });
    }
    let requestUrl = req.originalUrl;
    let mainTable = tables[requestUrl].main;
    let setQuery = "";
    let data = req.body.data;
    for (let i = 0; i < Object.keys(data).length - 1; i++) {
        setQuery += Object.keys(data)[i] + "='" + data[Object.keys(data)[i]] + "',"
    }
    setQuery += Object.keys(data)[Object.keys(data).length - 1] + "='" + data[Object.keys(data)[Object.keys(data).length - 1]] + "'";
    let query = `UPDATE ${mainTable} SET ${setQuery}  ${getWhere(req.body.where, [])}`;
    console.log(query);
    sql.query(query, (err, result) => {
            if (err) {
                res.status(500).send({
                    message: "Error updating item with id " + req.body.id
                });
            } else {
                if (result.affectedRows === 0) {
                    res.status(404).send({
                        message: `Not found item with id ${req.body.id}.`
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
    let requestUrl = req.originalUrl;
    let mainTable = tables[requestUrl].main;
    let query = `DELETE FROM ${mainTable} WHERE ${req.body.where}`;
    console.log(query);
    sql.query(query, (err, result) => {
        if (err) {
            res.status(500).send({
                message: "Could not delete item with id " + req.body.id
            });
        } else {
            if (res.affectedRows === 0) {
                res.status(404).send({
                    message: `Not found item with id ${req.body.id}.`
                });
            } else {
                res.send({message: `item was deleted successfully!`});
            }
        }
    });
}

function deleteAll(req, res) {
    console.log("delete");
    let requestUrl = req.originalUrl;
    let mainTable = tables[requestUrl].main;
    let query = `DELETE FROM ${mainTable}`;
    console.log(query);
    sql.query(query, (err, result) => {
        if (err) {
            res.status(500).send({
                message: "Could not delete item with id " + req.body.id
            });
        } else {
            if (res.affectedRows === 0) {
                res.status(404).send({
                    message: `Not found item with id ${req.body.id}.`
                });
            } else {
                res.send({message: `item was deleted successfully!`});
            }
        }
    });
}

