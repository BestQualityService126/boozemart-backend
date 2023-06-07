const express = require("express");
const cors = require("cors");

const fileUpload = require('express-fileupload');

const app = express();

var corsOptions = {
  origin: "http://localhost:3000"
 // origin: "http://boozemart.bsconsultants.us"
};

// app.use(cors(corsOptions));
app.use(cors());
// parse requests of content-type - application/json
app.use(express.json()); /* bodyParser.json() is deprecated */

// parse requests of content-type - application/x-www-form-urlencoded
app.use(express.urlencoded({ extended: true })); /* bodyParser.urlencoded() is deprecated */
app.use(fileUpload());

require("./routes/route.js")(app);



// set port, listen for requests
const PORT = process.env.PORT || 8080;
global.__basedir = __dirname;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`);
});
