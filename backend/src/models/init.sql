-- Users table
CREATE TABLE IF NOT EXISTS users (
  id SERIAL PRIMARY KEY,
  full_name VARCHAR(255) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  role VARCHAR(20) NOT NULL CHECK (role IN ('artist', 'curator')),
  bio TEXT,
  created_at TIMESTAMP NOT NULL DEFAULT NOW()
);

-- Artworks table
CREATE TABLE IF NOT EXISTS artworks (
  id SERIAL PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  image_url TEXT NOT NULL,
  description TEXT,
  tags TEXT[],
  submitted_by INTEGER REFERENCES users(id),
  status VARCHAR(20) NOT NULL DEFAULT 'pending',
  approved_by INTEGER REFERENCES users(id),
  approved_at TIMESTAMP,
  created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP
);

-- Feedback table
CREATE TABLE IF NOT EXISTS feedback (
  id SERIAL PRIMARY KEY,
  artwork_id INTEGER REFERENCES artworks(id),
  curator_id INTEGER REFERENCES users(id),
  comments TEXT,
  rating INTEGER CHECK (rating >= 1 AND rating <= 5),
  timestamp TIMESTAMP NOT NULL DEFAULT NOW()
);

-- Tags table
CREATE TABLE IF NOT EXISTS tags (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) UNIQUE NOT NULL
);

-- ArtworkTag join table
CREATE TABLE IF NOT EXISTS artwork_tags (
  artwork_id INTEGER REFERENCES artworks(id),
  tag_id INTEGER REFERENCES tags(id),
  PRIMARY KEY (artwork_id, tag_id)
);

-- Email OTP table
CREATE TABLE IF NOT EXISTS email_otps (
  id SERIAL PRIMARY KEY,
  email VARCHAR(255) NOT NULL,
  otp VARCHAR(10) NOT NULL,
  expires_at TIMESTAMP NOT NULL,
  verified BOOLEAN NOT NULL DEFAULT false
);
