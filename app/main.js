const express = require('express')
const app = express()
app.set("view engine", 'ejs');
app.use(express.static("public"))
require('dotenv').config();
const route = require('./routes/route')
const db = require('./db/dbConnect')
const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use("/",route);

app.listen(4444);