const path = require('path')
const db = require(path.join(__dirname,"../db/dbConnect"));

const searchProducts = (req,res)=>{
    if (!req.session.isLoggedIn) {
        res.redirect('/login');
        return;
    }
    db.query('SELECT * FROM products WHERE name LIKE \'\%'+req.body.name+'\%\';', (error, results, fields) => {
        if (error) {
            console.error('Error executing query: ' + error);
            res.send(error);
            return;
        }
        console.log(results)
        res.render('products',{products:results, isLoggedIn:req.session.isLoggedIn});
    });
}
module.exports = {
    searchProducts
}