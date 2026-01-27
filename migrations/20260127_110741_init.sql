-- Migration: init
-- Created: 2026-01-27T11:07:41.113Z

-- UP
-- Write schema changes here
CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  role TEXT DEFAULT 'user',
  created_at TIMESTAMP DEFAULT now()
);


-- DOWN
-- Write rollback logic here
DROP TABLE users
