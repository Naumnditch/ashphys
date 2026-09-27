-- Links a practice problem to its full interactive solution in the
-- solutions catalog. Applied to production with the Supabase MCP as
-- migration "problems_solution_id".

ALTER TABLE problems ADD COLUMN IF NOT EXISTS solution_id uuid REFERENCES solutions(id) ON DELETE SET NULL;
CREATE INDEX IF NOT EXISTS idx_problems_solution_id ON problems(solution_id);
