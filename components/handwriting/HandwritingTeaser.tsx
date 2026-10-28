import type { HwSnapshot } from '@/lib/handwriting/types';

/** A non-interactive teaser (top of page 1) that fades out, for viewers who are out of views. */
export function HandwritingTeaser({ preview }: { preview: HwSnapshot }) {
  return (
    <div className="relative overflow-hidden rounded-xl border border-gray-200" style={{ backgroundColor: '#ffffff' }}>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox={`${preview.x} ${preview.y} ${preview.width} ${preview.height}`}
        className="block w-full h-auto max-h-56"
        preserveAspectRatio="xMidYMin slice"
        aria-hidden="true"
        dangerouslySetInnerHTML={{ __html: preview.body }}
      />
      <div aria-hidden="true" className="absolute inset-x-0 bottom-0 h-2/3" style={{ background: 'linear-gradient(to bottom, rgba(255,255,255,0), #ffffff)' }} />
    </div>
  );
}
