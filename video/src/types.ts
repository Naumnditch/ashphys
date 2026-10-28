/**
 * The announcement config (updates/<slug>/config.json) and the capture
 * manifest (public/captures/<slug>/manifest.json). The template knows nothing
 * about any particular announcement: everything specific lives in these.
 */

import type { HandwritingDoc, HwSnapshot } from '@site/lib/handwriting/types';

export type Rect = [x: number, y: number, w: number, h: number];
export type Matrix = [a: number, b: number, c: number, d: number, e: number, f: number];

export interface Caption {
  from: number;
  to: number;
  text: string;
}

export interface BrandConfig {
  logo: string;
  url: string;
  font: string;
  colors: Record<'ink' | 'muted' | 'page' | 'surface' | 'accent' | 'accentSoft' | 'highlight' | 'grid', string>;
}

/** "shotId:rectName" — a named element rectangle captured with a shot. */
export type RectRef = string;

export interface CameraKey {
  at: number;
  zoom: number;
  /** Rect to centre on; omitted = the whole screen. */
  focus?: RectRef;
}

export interface CursorKey {
  at: number;
  target: RectRef;
  click?: boolean;
}

export interface Callout {
  from: number;
  to: number;
  text: string;
  anchor: RectRef;
  side?: 'left' | 'right' | 'top' | 'bottom';
}

interface SceneBase {
  id: string;
  seconds: number;
  captions?: Caption[];
}

export interface TitleScene extends SceneBase {
  type: 'title';
  kicker?: string;
  title: string;
  subtitle?: string;
}

export interface ScreensScene extends SceneBase {
  type: 'screens';
  device: 'browser' | 'tablet';
  shots: { capture: string; at: number }[];
  /** A captured frame sequence played over the stills from `at`. */
  clip?: { capture: string; at: number };
  cursor?: CursorKey[];
  camera?: CameraKey[];
  callouts?: Callout[];
}

export interface ReplayOptions {
  /** Longest pause kept between strokes when strokes carry real timestamps (s). */
  pauseCompression?: number;
  /** Still frames after the last stroke (s). */
  endHold?: number;
  /** Before the first stroke (s). */
  startDelay?: number;
  /** Synthesized pacing: pen speed in stored px/s before the global fit. */
  penSpeed?: number;
}

export interface Highlight {
  label: string;
  /** Inclusive [first, last] stroke-index ranges (stored order, page 1 first). */
  strokes: [number, number][];
}

export interface FollowCamera {
  mode: 'follow';
  maxZoom: number;
  minZoom: number;
  /** Seconds at the end spent easing back to the whole page. */
  settle: number;
}

export interface HandwritingScene extends SceneBase {
  type: 'handwriting';
  device: 'browser' | 'tablet';
  /** Key of strokes/<key>.json. */
  strokes: string;
  /** Capture of the viewer with the ink hidden (paper + grid). */
  plate: string;
  /** Capture of the same view with the stored ink (for the alignment check). */
  reference: string;
  replay?: ReplayOptions;
  camera?: FollowCamera;
  highlights?: Highlight[];
}

export interface SequenceScene extends SceneBase {
  type: 'sequence';
  device: 'browser' | 'tablet';
  capture: string;
  callouts?: Callout[];
  camera?: CameraKey[];
}

export interface CtaScene extends SceneBase {
  type: 'cta';
  title: string;
  button: string;
  note?: string;
}

export type Scene = TitleScene | ScreensScene | HandwritingScene | SequenceScene | CtaScene;

export interface VariantConfig {
  width: number;
  height: number;
  scenes?: string[];
  seconds?: number;
  captions?: boolean;
  loop?: boolean;
  /** Per-scene overrides for this output (e.g. tablet plates and tighter cameras for 9:16). */
  sceneOverrides?: Record<string, Partial<Scene>>;
}

export interface UpdateConfig {
  slug: string;
  title: string;
  summary: string;
  cta: { label: string; href: string };
  fps: number;
  brand: BrandConfig;
  showcase: Record<string, { questionIncludes: string[]; answer?: string }>;
  transition: { type: 'fade' | 'slide' | 'none'; seconds: number };
  scenes: Scene[];
  outputs: {
    heroLoop?: Partial<VariantConfig> & { maxBytes?: number };
    vertical?: Partial<VariantConfig>;
    poster?: { scene: string; at: number };
  };
  capture?: Record<string, unknown>;
}

export interface StrokesFile {
  key: string;
  source: { lesson: string; questionNumber: number; question: string; answer: string; version: number; updatedAt: string };
  timing: { timedStrokes: number; totalStrokes: number };
  doc: HandwritingDoc;
  snapshots: HwSnapshot[];
}

export interface InkTransform {
  matrix: Matrix;
  pages: Matrix[];
  clip: Rect;
  viewBox: string;
}

export interface Shot {
  kind: 'still' | 'sequence';
  file?: string;
  dir?: string;
  frames?: number;
  fps?: number;
  form: 'desktop' | 'tablet';
  viewport: { width: number; height: number };
  scale: number;
  path: string;
  rects: Record<string, Rect>;
  ink?: InkTransform;
  pointer?: ([number, number] | null)[];
  events?: { frame: number; kind: 'pinch' | 'press' | 'click' }[];
}

export interface Manifest {
  slug: string;
  shots: Record<string, Shot>;
  capturedAt?: string;
}

export type VariantName = 'master' | 'heroLoop' | 'vertical';

/** Everything a composition needs, resolved by calculateMetadata. */
export interface AnnouncementData {
  config: UpdateConfig;
  manifest: Manifest;
  strokes: Record<string, StrokesFile>;
  variant: VariantName;
  width: number;
  height: number;
  scenes: Scene[];
  captions: Caption[];
  showCaptions: boolean;
  loop: boolean;
  /** Absolute start frame of each scene (after transitions). */
  starts: Record<string, number>;
  durationInFrames: number;
  transitionFrames: number;
}
