const nodemailer = require('nodemailer');
const path = require('path')
const db = require(path.join(__dirname,"../db/dbConnect"));
require('dotenv').config();

let transporter = nodemailer.createTransport({
    service: 'Gmail',
    auth: {
        user: process.env.email,
        pass: process.env.pass
    }
});

const login = (req,res)=>{
    if (req.session.isLoggedIn) {
        res.redirect("/")
        return;
    }
    db.query('SELECT * FROM users WHERE email = \''+req.body.email+'\'  AND password = \''+req.body.password+'\'', (error, results, fields) => {
        if (error) {
            console.error('Error executing query: ' + error);
            res.send(error);
            return;
        }
        if (results.length > 0) {
            req.session.isLoggedIn = true;
            res.redirect('/');
        }
        else{
            res.redirect('/register');
        }
    });
}



const forgotPass = (req,res)=>{
    if (req.session.isLoggedIn){
        res.redirect("/");
        return;
    }
    db.query('SELECT * FROM users WHERE email = \''+req.body.email+'\';', (error, results, fields) => {
        if (error) {
            console.error('Error executing query: ' + error);
            res.send(error);
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
            db.query('UPDATE users SET otp='+otp+' WHERE email=\''+email+'\';', (error, results, fields) => {
                if (error) {
                    console.error('Error executing query: ' + error);
                    res.send(error);
                    return;
                }
                res.render('changePass',{email:email})
            });
        }
        else{
            res.redirect('/register');
        }
    });
}

const changePass = (req,res)=>{
    if (req.session.isLoggedIn){
        res.redirect("/");
        return;
    }
    otp = req.body.otp;
    console.log(otp);
    db.query('UPDATE users set password = \'' +req.body.newPassword+'\' WHERE email = \''+req.body.email+'\' AND otp = '+otp+';', (error, results, fields) => {
        if (error) {
            console.error('Error executing query: ' + error);
            res.send(error);
            return;
        }
        res.redirect('/login');
    });
}

const logout = (req,res)=>{
    if (req.session.isLoggedIn){
        req.session.isLoggedIn = false;
    }
    res.redirect("/login");
}

module.exports = {
    login,logout,forgotPass,changePass
}