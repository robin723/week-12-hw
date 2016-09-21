// Require mysql npm package
var mysql = require('mysql');

// Create connection 
exports.myConnection = mysql.createConnection({
  host: 'localhost',
  port: 3306,
  user: 'root',
  password: 'password',
  database: 'bamazon'
});