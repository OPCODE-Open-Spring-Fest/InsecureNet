const express = require('express')
const app = express()
app.set("view engine", 'ejs');
app.use(express.static("public"))
require('dotenv').config();
const api = require('./routes/data')
const auth = require('./routes/auth')
const db = require('./db/dbConnect')
const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use("/api/data", api);
app.use("/auth",auth);

app.post('/search', (req, res) => {
    db.query('SELECT * FROM products WHERE name LIKE \'\%'+req.body.name+'\%\';', (error, results, fields) => {
        if (error) {
            console.error('Error executing query: ' + error);
            return;
        }
        console.log(results)
        res.render('products',{products:results});
    });
})

app.get('/', (req,res)  => {
    db.query('SELECT * FROM products', (error, results, fields) => {
        if (error) {
            console.error('Error executing query: ' + error);
            return;
        }
        res.render('products',{products:results});
    });
})

app.listen(4444);