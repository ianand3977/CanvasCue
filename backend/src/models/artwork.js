const { Pool } = require('pg');
const pool = new Pool({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME
});

// Artwork model functions
const createArtwork = async (artwork) => {
  const result = await pool.query(
    'INSERT INTO artworks (title, image_url, description, tags, submitted_by, status, created_at) VALUES ($1, $2, $3, $4, $5, $6, NOW()) RETURNING *',
    [artwork.title, artwork.imageUrl, artwork.description, artwork.tags, artwork.submittedBy, 'pending']
  );
  return result.rows[0];
};

const getArtworkById = async (id) => {
  const result = await pool.query('SELECT * FROM artworks WHERE id = $1', [id]);
  return result.rows[0];
};

const getAllArtworks = async () => {
  const result = await pool.query('SELECT * FROM artworks');
  return result.rows;
};

const getArtworksByStatus = async (status) => {
  const result = await pool.query('SELECT * FROM artworks WHERE status = $1', [status]);
  return result.rows;
};

const approveArtworkById = async (id, curatorId) => {
  const result = await pool.query(
    'UPDATE artworks SET status = $1, approved_by = $2, approved_at = NOW() WHERE id = $3 RETURNING *',
    ['approved', curatorId, id]
  );
  return result.rows[0];
};

const rejectArtworkById = async (id, curatorId) => {
  const result = await pool.query(
    'UPDATE artworks SET status = $1, approved_by = $2, approved_at = NOW() WHERE id = $3 RETURNING *',
    ['rejected', curatorId, id]
  );
  return result.rows[0];
};

const getArtworksByArtist = async (artistId) => {
  const result = await pool.query('SELECT * FROM artworks WHERE submitted_by = $1', [artistId]);
  return result.rows;
};

const getArtworksReviewedByCurator = async (curatorId) => {
  const result = await pool.query('SELECT * FROM artworks WHERE approved_by = $1', [curatorId]);
  return result.rows;
};

module.exports = { createArtwork, getArtworkById, getAllArtworks, getArtworksByStatus, approveArtworkById, rejectArtworkById, getArtworksByArtist, getArtworksReviewedByCurator };
