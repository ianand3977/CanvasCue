const { Pool } = require('pg');
const pool = new Pool({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME
});

// EmailOTP model functions
const createOtp = async (email, otp, expiresAt) => {
  const result = await pool.query(
    'INSERT INTO email_otps (email, otp, expires_at, verified) VALUES ($1, $2, $3, false) RETURNING *',
    [email, otp, expiresAt]
  );
  return result.rows[0];
};

const findOtp = async (email, otp) => {
  const result = await pool.query(
    'SELECT * FROM email_otps WHERE email = $1 AND otp = $2 AND expires_at > NOW() AND verified = false',
    [email, otp]
  );
  return result.rows[0];
};

const verifyOtp = async (email, otp) => {
  await pool.query(
    'UPDATE email_otps SET verified = true WHERE email = $1 AND otp = $2',
    [email, otp]
  );
};

const pruneExpiredOtps = async () => {
  await pool.query('DELETE FROM email_otps WHERE expires_at < NOW() OR verified = true');
};

// Find the latest OTP for an email (for registration check)
const findLatestOtpByEmail = async (email) => {
  const result = await pool.query(
    'SELECT * FROM email_otps WHERE email = $1 ORDER BY expires_at DESC LIMIT 1',
    [email]
  );
  return result.rows[0];
};

module.exports = { createOtp, findOtp, verifyOtp, pruneExpiredOtps, findLatestOtpByEmail };
