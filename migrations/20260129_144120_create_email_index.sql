-- Migration: create_email_index
-- Created: 2026-01-29T14:41:20.667Z

-- UP
-- Write schema changes here
CREATE INDEX idx_users_email
ON users (email);

-- DOWN
-- Write rollback logic here
DROP INDEX IF EXISTS idx_users_email;
