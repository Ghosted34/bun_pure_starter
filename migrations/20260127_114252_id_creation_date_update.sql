-- Migration: id_creation_date_update
-- Created: 2026-01-27T11:42:52.412Z

-- UP
-- Write schema changes here
ALTER TABLE users 
ADD COLUMN id_new uuid DEFAULT uuidv7();

UPDATE users 
SET id_new = uuidv7();

ALTER TABLE users 
ALTER COLUMN id_new SET NOT NULL;

ALTER TABLE users 
ADD COLUMN id_old INTEGER;

UPDATE users 
SET id_old = id;

ALTER TABLE users 
ALTER COLUMN created_at TYPE TIMESTAMPTZ 
USING created_at AT TIME ZONE 'UTC';

ALTER TABLE users 
ALTER COLUMN created_at SET DEFAULT NOW();

ALTER TABLE users 
DROP CONSTRAINT users_pkey;

ALTER TABLE users 
DROP COLUMN id;

ALTER TABLE users 
RENAME COLUMN id_new TO id;

ALTER TABLE users 
ADD PRIMARY KEY (id);


-- DOWN
-- Write rollback logic here

ALTER TABLE users 
ADD COLUMN id_new INTEGER;

UPDATE users 
SET id_new = id_old;

ALTER TABLE users 
ALTER COLUMN id_new SET NOT NULL;

ALTER TABLE users 
DROP CONSTRAINT users_pkey;

ALTER TABLE users 
DROP COLUMN id;

ALTER TABLE users 
RENAME COLUMN id_new TO id;

ALTER TABLE users 
ADD PRIMARY KEY (id);

CREATE SEQUENCE IF NOT EXISTS users_id_seq;

ALTER TABLE users 
ALTER COLUMN id SET DEFAULT nextval('users_id_seq');

SELECT setval('users_id_seq', (SELECT MAX(id) FROM users));

ALTER TABLE users 
ALTER COLUMN created_at TYPE TIMESTAMP 
USING created_at AT TIME ZONE 'UTC';

ALTER TABLE users 
ALTER COLUMN created_at SET DEFAULT CURRENT_TIMESTAMP;

ALTER TABLE users 
DROP COLUMN id_old;