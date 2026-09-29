-- Multi-curriculum support: IGCSE (0625), AS & A Level (9702) and IB Physics.
--
-- A lesson is a `topics` row. It can belong to several curricula at once and
-- carries its own syllabus code for each one; simulations hang off the lesson
-- so they are shared. Practice questions (`problems`) belong to exactly one
-- curriculum, so each curriculum gets its own question bank on a shared lesson.
--
-- Additive only: every new column has a default that describes the existing
-- data (everything already on the site is IGCSE), so code that predates this
-- migration keeps working unchanged. Safe to re-run.
-- Applied to Supabase as migration `multi_curriculum_schema`.

BEGIN;

-- ── Lessons ──────────────────────────────────────────────────────────────
ALTER TABLE topics
  ADD COLUMN IF NOT EXISTS curriculum_ids TEXT[] NOT NULL DEFAULT ARRAY['igcse']::TEXT[],
  ADD COLUMN IF NOT EXISTS topic_code VARCHAR(50),          -- IGCSE 0625 syllabus section, e.g. '1.2'
  ADD COLUMN IF NOT EXISTS as_topic_code VARCHAR(50),       -- 9702 AS section, e.g. '2.1'
  ADD COLUMN IF NOT EXISTS a_level_topic_code VARCHAR(50),  -- 9702 A Level section, e.g. '18.3'
  ADD COLUMN IF NOT EXISTS ib_topic_code VARCHAR(50),       -- IB Physics subtopic, e.g. 'A.1'
  ADD COLUMN IF NOT EXISTS syllabus_reference TEXT;         -- what the lesson covers, in syllabus terms

DO $$ BEGIN
  ALTER TABLE topics ADD CONSTRAINT topics_curriculum_ids_valid CHECK (
    cardinality(curriculum_ids) > 0
    AND curriculum_ids <@ ARRAY['igcse', 'as', 'a-level', 'ib']::TEXT[]
  );
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

CREATE INDEX IF NOT EXISTS idx_topics_curriculum_ids ON topics USING GIN (curriculum_ids);

-- ── Practice questions ───────────────────────────────────────────────────
ALTER TABLE problems
  ADD COLUMN IF NOT EXISTS curriculum_id VARCHAR(20) NOT NULL DEFAULT 'igcse',
  ADD COLUMN IF NOT EXISTS topic_code VARCHAR(50),   -- the curriculum's own code for what this question tests
  ADD COLUMN IF NOT EXISTS syllabus_cite TEXT;       -- the syllabus statement it addresses

DO $$ BEGIN
  ALTER TABLE problems ADD CONSTRAINT problems_curriculum_id_valid
    CHECK (curriculum_id IN ('igcse', 'as', 'a-level', 'ib'));
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

CREATE INDEX IF NOT EXISTS idx_problems_curriculum_topic ON problems (curriculum_id, topic_id);

-- ── Which curriculum each student is studying ────────────────────────────
CREATE TABLE IF NOT EXISTS user_preferences (
  user_id UUID PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
  selected_curriculum VARCHAR(20) NOT NULL DEFAULT 'igcse'
    CHECK (selected_curriculum IN ('igcse', 'as', 'a-level', 'ib')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_user_preferences_curriculum ON user_preferences (selected_curriculum);

-- Like every other table here, only the server (which connects as the
-- database owner) reads or writes it; nothing is exposed through PostgREST.
ALTER TABLE user_preferences ENABLE ROW LEVEL SECURITY;

COMMIT;
