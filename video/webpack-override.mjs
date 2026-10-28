/**
 * Shared by remotion.config.ts (Studio, CLI) and scripts/build.mjs (renders):
 * the composition imports the site's own handwriting geometry (`@site/lib/…`),
 * so the replayed ink is drawn by exactly the code that draws it on the site.
 * `videoDir` is this workspace (the CLI runs from it; build.mjs passes it).
 */
import path from 'node:path';

export const makeWebpackOverride = (videoDir) => (config) => ({
  ...config,
  resolve: {
    ...config.resolve,
    alias: {
      ...(config.resolve?.alias ?? {}),
      '@site': path.resolve(videoDir, '..'),
      // The site's lib/handwriting imports perfect-freehand; resolve it from this workspace.
      'perfect-freehand': path.resolve(videoDir, 'node_modules/perfect-freehand'),
    },
  },
});
