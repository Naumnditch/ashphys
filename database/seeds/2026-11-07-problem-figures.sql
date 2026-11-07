-- 2026-11-07: inline SVG figures for practice questions.
--
-- figure_svg  a self-contained <svg> (no scripts, raster images, external
--             assets or foreignObject; ≤ 60 KB) drawn in currentColor and
--             CSS variables, so it follows the site's light and dark themes.
-- figure_alt  the full text description of the figure (screen readers, and
--             the "Describe this figure" disclosure under it).
--
-- Both columns are nullable and default to NULL, so every existing question
-- (Chapter 22 included) is unchanged. Idempotent. Apply this BEFORE deploying
-- code that selects the columns.
ALTER TABLE problems ADD COLUMN IF NOT EXISTS figure_svg text;
ALTER TABLE problems ADD COLUMN IF NOT EXISTS figure_alt text;

DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'problems_figure_svg_check') THEN
    ALTER TABLE problems ADD CONSTRAINT problems_figure_svg_check CHECK (
      figure_svg IS NULL OR (
        octet_length(figure_svg) <= 61440
        AND figure_svg LIKE '<svg %'
        AND figure_svg !~* '<(script|foreignObject|image|iframe|object|embed)'
        AND figure_svg !~* '\son[a-z]+\s*='
        AND figure_alt IS NOT NULL AND length(figure_alt) >= 20
      )
    );
  END IF;
END $$;

COMMENT ON COLUMN problems.figure_svg IS 'Inline SVG figure (currentColor + CSS variables, no scripts/raster/external assets, ≤ 60 KB).';
COMMENT ON COLUMN problems.figure_alt IS 'Full text description of figure_svg.';
