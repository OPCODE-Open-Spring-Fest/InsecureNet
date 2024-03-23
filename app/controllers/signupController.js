const path = require('path')
const db = require(path.join(__dirname,"../db/dbConnect"));
require('dotenv').config();

const signUp  = (req,res)=>{
    if (req.session.isLoggedIn){
        res.redirect("/");
        return;
    }
    db.query("SELECT * FROM users WHERE email = '"+req.body.email+"';", (error, results, fields) => {
        if (error) {
            console.error('Error executing query: ' + error);
            res.send(error);
            return;
        }
        if (results.length > 0) {
            res.redirect('/login');
        }
        else{
            db.query("INSERT INTO users (name,email,password) VALUES ('"+req.body.fullname+"','"+req.body.email+"','"+req.body.password+"');", (error, results, fields) => {
                if (error) {
                    console.error('Error executing query: ' + error);
                    return;
                }
                res.redirect('/login');
            });
        }
    });
}
module.exports = {signUp}