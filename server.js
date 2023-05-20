const express = require("express");
const busboy = require('connect-busboy'); //middleware for form/file upload
const path = require('path');     //used for file path
const fs = require('fs-extra');
const bodyParser = require('body-parser'); //connects bodyParsing middleware
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


app.use(busboy());
app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser({defer: true}));

// set port, listen for requests
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`);
});
