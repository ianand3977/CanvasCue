const { Pool } = require('pg');
const pool = new Pool({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME
});

// User model functions
const createUser = async (fullName, email, passwordHash, role, bio) => {
  const result = await pool.query(
    'INSERT INTO users (full_name, email, password_hash, role, bio, created_at) VALUES ($1, $2, $3, $4, $5, NOW()) RETURNING *',
    [fullName, email, passwordHash, role, bio]
  );
  return result.rows[0];
};

const findUserByUsername = async (email) => {
  const result = await pool.query(
    'SELECT * FROM users WHERE email = $1',
    [email]
  );
  return result.rows[0];
};

const findUserById = async (id) => {
  const result = await pool.query(
    'SELECT * FROM users WHERE id = $1',
    [id]
  );
  return result.rows[0];
};

module.exports = { createUser, findUserByUsername, findUserById };
