let fs = require('fs');

exports.writeLog = (msg) => {
    let now = new Date(new Date().getTime()).toISOString();
    let str = "'" + now + "' " + msg + "\n";
    fs.writeFileSync("./error_log.txt", str, {flag: "a+"})
};
