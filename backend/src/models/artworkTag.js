const { Pool } = require('pg');
const pool = new Pool({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME
});

// ArtworkTag model functions
const createArtworkTag = async (artworkId, tagId) => {
  const result = await pool.query(
    'INSERT INTO artwork_tags (artwork_id, tag_id) VALUES ($1, $2) RETURNING *',
    [artworkId, tagId]
  );
  return result.rows[0];
};

const getTagsForArtwork = async (artworkId) => {
  const result = await pool.query('SELECT * FROM artwork_tags WHERE artwork_id = $1', [artworkId]);
  return result.rows;
};

const getTagNamesForArtwork = async (artworkId) => {
  const result = await pool.query(
    `SELECT t.name FROM artwork_tags at
     JOIN tags t ON at.tag_id = t.id
     WHERE at.artwork_id = $1`,
    [artworkId]
  );
  return result.rows.map(row => row.name);
};

module.exports = { createArtworkTag, getTagsForArtwork, getTagNamesForArtwork };
