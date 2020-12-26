const mysql = require('mysql2');

const pool = mysql.createPool({
  host: 'localhost',
  user: 'root',
  password: 'zVwjjhGX3FeV',
  database: 'node_complete'
});

module.exports = pool.promise();