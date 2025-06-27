const { Pool } = require('pg');
const pool = new Pool({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME
});

// Tag model functions
const createTag = async (name) => {
  const result = await pool.query(
    'INSERT INTO tags (name) VALUES ($1) RETURNING *',
    [name]
  );
  return result.rows[0];
};

const getAllTags = async () => {
  const result = await pool.query('SELECT * FROM tags');
  return result.rows;
};

const getTagByName = async (name) => {
  const result = await pool.query('SELECT * FROM tags WHERE name = $1', [name]);
  return result.rows[0];
};

module.exports = { createTag, getAllTags, getTagByName };
