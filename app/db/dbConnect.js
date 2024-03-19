const mysql = require('mysql2');
require('dotenv').config();
// Create a connection to the MySQL server
const connection = mysql.createConnection({
    host: process.env.dbHost,      // Change this to your MySQL server's host
    user: process.env.dbUser,       // Change this to your MySQL username
    password: process.env.dbPass,   // Change this to your MySQL password
    database: process.env.dbName    // Change this to your MySQL database name
});
connection.connect((err) => {
        if (err) {
            console.error('Error connecting to MySQL server: ' + err.stack);
            return;
        }
        
        console.log('Connected to MySQL server as ID ' + connection.threadId);
});
// db.query('SELECT * FROM sys_config', (error, results, fields) => {
//         if (error) {
//             console.error('Error executing query: ' + error);
//             return;
//         }
//         console.log('Query result: ', results);
// });

module.exports = connection;