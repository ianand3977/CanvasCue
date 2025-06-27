require('dotenv').config();
const { Pool } = require('pg');
const fs = require('fs');
const path = require('path');

const pool = new Pool({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME
});

const sql = fs.readFileSync(path.join(__dirname, 'init.sql')).toString();

pool.query(sql)
  .then(() => {
    console.log('Database initialized.');
    process.exit(0);
  })
  .catch(err => {
    console.error('Error initializing database:', err);
    process.exit(1);
  });
