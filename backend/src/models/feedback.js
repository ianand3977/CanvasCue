const { Pool } = require('pg');
const pool = new Pool({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME
});

// Feedback model functions
const createFeedback = async (feedback) => {
  const result = await pool.query(
    'INSERT INTO feedback (artwork_id, curator_id, comments, rating, timestamp) VALUES ($1, $2, $3, $4, NOW()) RETURNING *',
    [feedback.artworkId, feedback.curatorId, feedback.comments, feedback.rating]
  );
  return result.rows[0];
};

const getFeedbackForArtwork = async (artworkId) => {
  const result = await pool.query('SELECT * FROM feedback WHERE artwork_id = $1', [artworkId]);
  return result.rows;
};

module.exports = { createFeedback, getFeedbackForArtwork };
