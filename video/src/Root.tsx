import { Composition, type CalculateMetadataFunction } from 'remotion';
import { z } from 'zod';
import { Announcement, type AnnouncementProps } from './Announcement';
import { loadManifest, resolveVariant, SLUGS, UPDATES } from './data';
import { ReplayCheck, type ReplayCheckProps } from './handwriting/ReplayCheck';
import type { VariantName } from './types';

const slugSchema = z.enum(SLUGS as [string, ...string[]]);
const announcementSchema = z.object({ slug: slugSchema, variant: z.enum(['master', 'heroLoop', 'vertical']) });
const checkSchema = z.object({
  slug: slugSchema,
  scene: z.string(),
  mode: z.enum(['replay', 'reference', 'snapshot', 'difference', 'side-by-side']),
  showIndices: z.boolean(),
  showHud: z.boolean(),
});

const announcementMetadata: CalculateMetadataFunction<AnnouncementProps> = async ({ props }) => {
  const update = UPDATES[props.slug];
  if (!update) throw new Error(`Unknown announcement "${props.slug}" (known: ${SLUGS.join(', ')})`);
  const data = resolveVariant(update.config, await loadManifest(props.slug), props.variant as VariantName);
  return { durationInFrames: data.durationInFrames, width: data.width, height: data.height, fps: update.config.fps, props: { ...props, data } };
};

const checkMetadata: CalculateMetadataFunction<ReplayCheckProps> = async ({ props }) => {
  const update = UPDATES[props.slug];
  const data = resolveVariant(update.config, await loadManifest(props.slug), 'master');
  const scene = update.config.scenes.find((s) => s.id === props.scene);
  if (!scene || scene.type !== 'handwriting') throw new Error(`"${props.scene}" is not a handwriting scene`);
  const viewport = data.manifest.shots[scene.plate]?.viewport ?? { width: 1920, height: 1080 };
  return { durationInFrames: Math.round(scene.seconds * update.config.fps), width: viewport.width, height: viewport.height, fps: update.config.fps, props: { ...props, data } };
};

const first = SLUGS[0];
const firstHandwriting = UPDATES[first]?.config.scenes.find((s) => s.type === 'handwriting')?.id ?? '';

export function Root() {
  return (
    <>
      <Composition
        id="Announcement"
        component={Announcement}
        schema={announcementSchema}
        defaultProps={{ slug: first, variant: 'master' as const }}
        calculateMetadata={announcementMetadata}
        durationInFrames={300}
        fps={30}
        width={1920}
        height={1080}
      />
      <Composition
        id="AnnouncementVertical"
        component={Announcement}
        schema={announcementSchema}
        defaultProps={{ slug: first, variant: 'vertical' as const }}
        calculateMetadata={announcementMetadata}
        durationInFrames={300}
        fps={30}
        width={1080}
        height={1920}
      />
      <Composition
        id="HeroLoop"
        component={Announcement}
        schema={announcementSchema}
        defaultProps={{ slug: first, variant: 'heroLoop' as const }}
        calculateMetadata={announcementMetadata}
        durationInFrames={300}
        fps={30}
        width={1280}
        height={720}
      />
      <Composition
        id="ReplayCheck"
        component={ReplayCheck}
        schema={checkSchema}
        defaultProps={{ slug: first, scene: firstHandwriting, mode: 'side-by-side' as const, showIndices: false, showHud: true }}
        calculateMetadata={checkMetadata}
        durationInFrames={300}
        fps={30}
        width={1920}
        height={1080}
      />
    </>
  );
}
