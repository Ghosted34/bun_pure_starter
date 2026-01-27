-- ============================================
-- UP: Convert id to UUID v7 and created_at to timestamptz
-- ============================================

-- Step 1: Add new UUID v7 column
ALTER TABLE your_table_name 
ADD COLUMN id_new UUID DEFAULT gen_random_uuid('7');

-- Step 2: Generate UUID v7 for existing rows
UPDATE your_table_name 
SET id_new = gen_random_uuid('7');

-- Step 3: Make id_new NOT NULL
ALTER TABLE your_table_name 
ALTER COLUMN id_new SET NOT NULL;

-- Step 4: Store old id values for potential rollback reference
ALTER TABLE your_table_name 
ADD COLUMN id_old INTEGER;

UPDATE your_table_name 
SET id_old = id;

-- Step 5: Update created_at to timestamptz (UTC)
ALTER TABLE your_table_name 
ALTER COLUMN created_at TYPE TIMESTAMPTZ 
USING created_at AT TIME ZONE 'UTC';

-- Step 6: Set default for created_at if needed
ALTER TABLE your_table_name 
ALTER COLUMN created_at SET DEFAULT NOW();

-- Step 7: Drop old primary key constraint
ALTER TABLE your_table_name 
DROP CONSTRAINT your_table_name_pkey;

-- Step 8: Drop old id column
ALTER TABLE your_table_name 
DROP COLUMN id;

-- Step 9: Rename new column to id
ALTER TABLE your_table_name 
RENAME COLUMN id_new TO id;

-- Step 10: Set new primary key
ALTER TABLE your_table_name 
ADD PRIMARY KEY (id);


-- ============================================
-- DOWN: Revert to integer id and timestamp
-- ============================================

-- Step 1: Add integer id column back
ALTER TABLE your_table_name 
ADD COLUMN id_new INTEGER;

-- Step 2: Restore old integer values
UPDATE your_table_name 
SET id_new = id_old;

-- Step 3: Make id_new NOT NULL
ALTER TABLE your_table_name 
ALTER COLUMN id_new SET NOT NULL;

-- Step 4: Drop UUID primary key
ALTER TABLE your_table_name 
DROP CONSTRAINT your_table_name_pkey;

-- Step 5: Drop UUID id column
ALTER TABLE your_table_name 
DROP COLUMN id;

-- Step 6: Rename id_new back to id
ALTER TABLE your_table_name 
RENAME COLUMN id_new TO id;

-- Step 7: Recreate integer primary key
ALTER TABLE your_table_name 
ADD PRIMARY KEY (id);

-- Step 8: Restore sequence for auto-increment (if applicable)
CREATE SEQUENCE IF NOT EXISTS your_table_name_id_seq;

ALTER TABLE your_table_name 
ALTER COLUMN id SET DEFAULT nextval('your_table_name_id_seq');

SELECT setval('your_table_name_id_seq', (SELECT MAX(id) FROM your_table_name));

-- Step 9: Revert created_at to timestamp without timezone
ALTER TABLE your_table_name 
ALTER COLUMN created_at TYPE TIMESTAMP 
USING created_at AT TIME ZONE 'UTC';

-- Step 10: Set original default for created_at
ALTER TABLE your_table_name 
ALTER COLUMN created_at SET DEFAULT CURRENT_TIMESTAMP;

-- Step 11: Drop the backup column
ALTER TABLE your_table_name 
DROP COLUMN id_old;