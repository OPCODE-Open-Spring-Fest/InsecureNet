const express = require('express')
const router = express.Router()
const nodemailer = require('nodemailer');
const bodyParser = require('body-parser');
router.use(bodyParser.urlencoded({ extended: true }));
router.use(bodyParser.json());
const path = require('path')
router.use(express.static( path.join(__dirname,"../public")))
const db = require(path.join(__dirname,"../db/dbConnect"));
// const session = require('express-session');
require('dotenv').config();
// router.use(session({
//     secret: process.env.secret,
//     resave: false,
//     saveUninitialized: false
// }));
let transporter = nodemailer.createTransport({
    service: 'Gmail',
    auth: {
        user: process.env.email,
        pass: process.env.pass
    }
});


router.get('/login', (req, res) =>{
    // if (req.session.isLoggedIn) {
    //     res.redirect("/")
    //     return;
    // }
    res.render('login');
})

router.post('/login', (req, res) => {
    // if (req.session.isLoggedIn) {
    //     res.redirect("/")
    //     return;
    // }
    db.query('SELECT * FROM users WHERE email = \''+req.body.email+'\'  AND password = \''+req.body.password+'\'', (error, results, fields) => {
        if (error) {
            console.error('Error executing query: ' + error);
            return;
        }
        if (results.length > 0) {
            // req.session.isLoggedIn = true;
            res.redirect('/');
        }
        else{
            res.redirect('/auth/register');
        }
    });
});

router.get('/register', (req,res) => {
    // if (req.session.isLoggedIn){
    //     res.redirect("/");
    //     return;
    // }
    res.render('register');
})

router.post('/register', (req, res) => {
    db.query("SELECT * FROM users WHERE email = '"+req.body.email+"';", (error, results, fields) => {
        if (error) {
            console.error('Error executing query: ' + error);
            return;
        }
        if (results.length > 0) {
            res.redirect('/auth/login');
        }
        else{
            db.query("INSERT INTO users (name,email,password) VALUES ('"+req.body.fullname+"','"+req.body.email+"','"+req.body.password+"');", (error, results, fields) => {
            if (error) {
                console.error('Error executing query: ' + error);
                return;
            }
            res.redirect('/auth/login');
            });
        }
    });
});

router.get('/forgotPass', (req, res) => {
    res.render('forgotPass')
})

router.post('/forgotPass', (req,res) => {
    db.query('SELECT * FROM users WHERE email = \''+req.body.email+'\';', (error, results, fields) => {
        if (error) {
            console.error('Error executing query: ' + error);
            return;
        }
        if (results.length > 0){
            email = results[0].email;
            otp = randomNumber = Math.floor(Math.random() * 9000) + 1000;
            let mailOptions = {
                from: process.env.email,
                to: email,
                subject: 'OTP for Password Reset',
                text: 'Your OTP for password change is '+ otp
            };
            transporter.sendMail(mailOptions, (error, info) => {
                if (error) {
                    console.error('Error occurred:', error);
                } else {
                    console.log('Email sent:', info.response);
                }
            });
            db.execute('UPDATE users SET otp='+otp+' WHERE email=\''+email+'\';');
            res.render('changePass',{email:email})
        }
        else{
            res.redirect('/auth/register');
        }
    });
})

router.post('/changePass', (req, res) => {
    otp = req.body.otp;
    console.log(otp);
    console.log('UPDATE users set password = \'' +req.body.newPassword+'\' WHERE otp = '+otp+' AND email = \''+req.body.email+'\';')
    db.query('UPDATE users set password = \'' +req.body.newPassword+'\' WHERE email = \''+req.body.email+'\' AND otp = '+otp+';', (error, results, fields) => {
        if (error) {
            console.error('Error executing query: ' + error);
            return;
        }
        res.redirect('/auth/login');
    });
})

module.exports = router;