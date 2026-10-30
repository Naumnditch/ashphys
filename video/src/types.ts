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
  /** Move the focus off centre, in fractions of the output (e.g. [0, 0.1] puts it 10 % lower, leaving room for a label above). */
  shift?: [number, number];
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

export type TransitionType = 'fade' | 'slide' | 'wipe' | 'none';

export interface TransitionConfig {
  type: TransitionType;
  seconds: number;
  /** slide / wipe: where the incoming scene comes from (default from-right). */
  direction?: 'from-left' | 'from-right' | 'from-top' | 'from-bottom';
}

/**
 * Hand-drawn marks over the footage (src/components/Annotations.tsx): notes in
 * a handwriting stroke font and rough.js shapes, written on frame by frame.
 * They point at real UI and never stand in for it. Positions follow the
 * camera when anchored to a captured rectangle; sizes are px at 1080p.
 */
export interface Annotation {
  kind: 'note' | 'step' | 'underline' | 'double-underline' | 'circle' | 'box' | 'arrow' | 'tick';
  /** Scene seconds when the pen starts. */
  from: number;
  /** Seconds the pen takes (default: from the length of the line). */
  draw?: number;
  /** Fades out by this time (default: stays to the end of the scene). */
  to?: number;
  /** The real UI it marks: "shotId:rectName" (follows the camera). */
  anchor?: RectRef;
  /** Or a point on the output in fractions of its width and height (a note's top-left; with align, its top-centre or top-right). */
  at?: [number, number];
  /** Or a fixed rect on the output, in fractions (for marks on the title and end cards, which have no captures). */
  rect?: [number, number, number, number];
  /** note: which side of the anchor it sits on (default top). */
  side?: 'left' | 'right' | 'top' | 'bottom';
  align?: 'left' | 'center' | 'right';
  /** Nudge, px at 1080p. */
  offset?: [number, number];
  /** note / step: the words; step: also `number`. */
  text?: string;
  number?: string;
  /** Handwriting cap height, px at 1080p (default 56). */
  size?: number;
  /** marker (blue, default) | red | green | ink | highlight | any CSS colour. */
  color?: string;
  /** circle / box / underline: space around the anchor, px at 1080p. */
  pad?: number;
  /** arrow: where it starts, output fractions or a rect ("shot:rect"); it ends at the anchor's edge. */
  start?: [number, number] | RectRef;
  /** note: underline its own words once written. */
  underline?: 'single' | 'double';
  /** rough.js seed (default: from the annotation's position in the list). */
  seed?: number;
}

interface SceneBase {
  id: string;
  seconds: number;
  captions?: Caption[];
  /** The transition into this scene (default: the config's). */
  transition?: TransitionConfig;
  annotations?: Annotation[];
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
  transition: TransitionConfig;
  scenes: Scene[];
  outputs: {
    heroLoop?: Partial<VariantConfig> & { maxBytes?: number };
    vertical?: Partial<VariantConfig>;
    poster?: { variant?: VariantName; scene: string; at: number };
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
  /** Per frame: 'pen' while the step wrote with the pen (null = mouse). */
  tools?: ('pen' | null)[];
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
  /** The config's default transition length. */
  transitionFrames: number;
  /** Per scene: the transition into it (index 0 has none). */
  transitions: (TransitionConfig & { frames: number })[];
}
