-- Tier-gated interactive problem solutions: a catalog of step-by-step worked
-- solutions, gated by a per-user lifetime view cap (Free/Plus) or unlimited
-- (Pro), plus an optional per-solution tier floor for Pro-exclusive content.
-- Applied to production with the Supabase MCP as migration "solutions_catalog".

CREATE TABLE IF NOT EXISTS solutions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  chapter INT NOT NULL,
  topic TEXT NOT NULL,
  problem_title TEXT NOT NULL,
  problem_number TEXT,
  difficulty TEXT DEFAULT 'intermediate' CHECK (difficulty IN ('basic', 'intermediate', 'advanced')),
  interactive_html TEXT,
  interactive_html_url TEXT,
  static_preview TEXT NOT NULL,
  description TEXT,
  tags TEXT[] DEFAULT '{}',
  solution_type TEXT DEFAULT 'interactive' CHECK (solution_type IN ('interactive', 'static')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()),
  created_by UUID REFERENCES users(id) ON DELETE SET NULL,
  is_published BOOLEAN DEFAULT FALSE,
  tier_required TEXT DEFAULT 'free' CHECK (tier_required IN ('free', 'plus', 'pro'))
);

CREATE TABLE IF NOT EXISTS solution_access_log (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  solution_id UUID REFERENCES solutions(id) ON DELETE CASCADE,
  accessed_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()),
  action TEXT CHECK (action IN ('view_preview', 'view_full', 'blocked', 'attempted_upgrade'))
);

CREATE TABLE IF NOT EXISTS user_solution_views (
  user_id UUID PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
  views_count INT DEFAULT 0,
  last_view_at TIMESTAMP WITH TIME ZONE,
  first_view_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW())
);

CREATE INDEX IF NOT EXISTS idx_solutions_chapter ON solutions(chapter);
CREATE INDEX IF NOT EXISTS idx_solutions_published ON solutions(is_published);
CREATE INDEX IF NOT EXISTS idx_solutions_tier ON solutions(tier_required);
CREATE INDEX IF NOT EXISTS idx_access_log_user ON solution_access_log(user_id);
-- Added beyond the spec: a solution is looked up by id constantly (detail
-- page, gating check) and access log is queried per (user, solution) to
-- tell "already unlocked" apart from "would consume a new view".
CREATE INDEX IF NOT EXISTS idx_access_log_user_solution ON solution_access_log(user_id, solution_id);
CREATE INDEX IF NOT EXISTS idx_access_log_solution ON solution_access_log(solution_id);

ALTER TABLE solutions ENABLE ROW LEVEL SECURITY;
ALTER TABLE solution_access_log ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_solution_views ENABLE ROW LEVEL SECURITY;
