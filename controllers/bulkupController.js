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
        let fields = "";
        let values = "";
        let arr = [];
        readFile(req.body.file, res => arr.push(res));

        console.log("aaaaa", arr)
        /*  let query = `INSERT INTO ${tableName} (${fields}) VALUES (${values})`;
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
          });*/
    }
};


async function readFile(file, callback) {
    await fs.createReadStream(file)
        .pipe(csv.parse())
        .on('error', error => console.error(error))
        .on('data', function (row) {
            let line = String(row).split(',');
            callback(line);
        })
        .on('end', rowCount => console.log(`Parsed ${rowCount} rows`));
}

function f() {

}

