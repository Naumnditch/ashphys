-- Structured worked-solution explanations (Given / Unit conversion / Principle /
-- Substitution and calculation / Result / Common errors), written in Markdown
-- with LaTeX and rendered with KaTeX on the practice page.
--
-- The original `explanation` column is never overwritten: it is the source text
-- every rewrite starts from, and what students see until a structured version
-- exists and passes validation. Re-running this file is a no-op.

ALTER TABLE problems ADD COLUMN IF NOT EXISTS explanation_structured TEXT;
-- ok: shown to students. needs_review: failed an automatic check (word count,
-- missing section, boxed result disagrees with the stored answer, bad LaTeX),
-- kept for the admin to fix and NOT shown to students.
ALTER TABLE problems ADD COLUMN IF NOT EXISTS explanation_structured_status VARCHAR(20);
ALTER TABLE problems ADD COLUMN IF NOT EXISTS explanation_structured_issues TEXT[];
-- ai: written by the rewrite tool. manual: written or edited by an admin.
ALTER TABLE problems ADD COLUMN IF NOT EXISTS explanation_structured_source VARCHAR(10);
ALTER TABLE problems ADD COLUMN IF NOT EXISTS explanation_structured_at TIMESTAMPTZ;

DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'problems_explanation_structured_status_check') THEN
    ALTER TABLE problems ADD CONSTRAINT problems_explanation_structured_status_check
      CHECK (explanation_structured_status IS NULL OR explanation_structured_status IN ('ok', 'needs_review'));
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'problems_explanation_structured_source_check') THEN
    ALTER TABLE problems ADD CONSTRAINT problems_explanation_structured_source_check
      CHECK (explanation_structured_source IS NULL OR explanation_structured_source IN ('ai', 'manual'));
  END IF;
END $$;

CREATE INDEX IF NOT EXISTS idx_problems_explanation_structured_status
  ON problems (explanation_structured_status);
