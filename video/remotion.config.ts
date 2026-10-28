import { Config } from '@remotion/cli/config';
import { makeWebpackOverride } from './webpack-override.mjs';

// The CLI and Studio run from this folder (npm run studio / npx remotion …).
Config.overrideWebpackConfig(makeWebpackOverride(process.cwd()));
Config.setVideoImageFormat('jpeg');
Config.setJpegQuality(95);
// Render with a local Chrome / chrome-headless-shell when one is configured.
if (process.env.CHROME_PATH) Config.setBrowserExecutable(process.env.CHROME_PATH);
