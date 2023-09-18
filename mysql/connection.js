const mysql = require("mysql");

const connection = mysql.createConnection({
  database: process.env.DB_DATABASE,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
});

connection.connect();

asyncMySQL(`SET SQL_MODE = '';`);

function asyncMySQL(query, params) {
  return new Promise((resolve, reject) => {
    connection.query(query, params, (err, results) => {
      if (err) {
        console.log("mySQL said NO!", err);
        reject();
      }

      resolve(results);
    });
  });
}

module.exports = asyncMySQL;
