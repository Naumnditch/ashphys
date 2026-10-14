import { SimulationIcon } from '@/components/icons/SimulationIcon';
import { LESSON_KIND_LABEL, type LessonKind } from '@/lib/curricula/courseLayout';

const SVG_PROPS = {
  viewBox: '0 0 24 24',
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 1.8,
  strokeLinecap: 'round' as const,
  strokeLinejoin: 'round' as const,
  'aria-hidden': true,
};

function PlayIcon({ className }: { className: string }) {
  return (
    <svg {...SVG_PROPS} className={className}>
      <circle cx="12" cy="12" r="9" />
      <path d="M10 8.5v7l5.5-3.5z" fill="currentColor" stroke="none" />
    </svg>
  );
}

function PencilIcon({ className }: { className: string }) {
  return (
    <svg {...SVG_PROPS} className={className}>
      <path d="M4 20h4L18.5 9.5a2.1 2.1 0 0 0-3-3L5 17v3z" />
      <path d="M13.5 8.5l2 2" />
    </svg>
  );
}

/** Also the neutral fallback for any kind without its own icon. */
function DocumentIcon({ className }: { className: string }) {
  return (
    <svg {...SVG_PROPS} className={className}>
      <path d="M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8z" />
      <path d="M14 3v5h5" />
      <path d="M9 13h6M9 17h4" />
    </svg>
  );
}

const ICONS: Partial<Record<LessonKind, (p: { className: string }) => JSX.Element>> = {
  video: PlayIcon,
  practice: PencilIcon,
  simulation: SimulationIcon as (p: { className: string }) => JSX.Element,
  reading: DocumentIcon,
};

/** The row's type icon; screen readers hear its kind ("Practice set"). */
export function LessonTypeIcon({ kind, className = 'w-5 h-5' }: { kind: LessonKind; className?: string }) {
  const Icon = ICONS[kind] ?? DocumentIcon;
  return (
    <span role="img" aria-label={LESSON_KIND_LABEL[kind] ?? 'Lesson'} className="inline-flex flex-shrink-0">
      <Icon className={className} />
    </span>
  );
}

export function LockIcon({ label, className = 'w-4 h-4' }: { label: string; className?: string }) {
  return (
    <span role="img" aria-label={label} title={label} className="inline-flex flex-shrink-0">
      <svg {...SVG_PROPS} className={className}>
        <rect x="5" y="11" width="14" height="9" rx="2" />
        <path d="M8 11V8a4 4 0 0 1 8 0v3" />
      </svg>
    </span>
  );
}

export function MasteredCheck({ className = 'w-4 h-4' }: { className?: string }) {
  return (
    <span role="img" aria-label="Mastered" title="Mastered" className="inline-flex flex-shrink-0 text-green-600">
      <svg {...SVG_PROPS} strokeWidth={2.2} className={className}>
        <circle cx="12" cy="12" r="9" />
        <path d="M8 12.5l2.7 2.7L16 9.8" />
      </svg>
    </span>
  );
}

/** A small ring filled to `fraction` (0–1). */
export function ProgressRing({ fraction, label }: { fraction: number; label: string }) {
  const r = 7;
  const circumference = 2 * Math.PI * r;
  const filled = Math.max(0, Math.min(1, fraction)) * circumference;
  return (
    <span role="img" aria-label={label} title={label} className="inline-flex flex-shrink-0 text-h-5a67d8">
      <svg viewBox="0 0 18 18" className="w-4 h-4 -rotate-90" aria-hidden>
        <circle cx="9" cy="9" r={r} fill="none" stroke="currentColor" strokeOpacity={0.2} strokeWidth={2.2} />
        <circle
          cx="9"
          cy="9"
          r={r}
          fill="none"
          stroke="currentColor"
          strokeWidth={2.2}
          strokeLinecap="round"
          strokeDasharray={`${filled} ${circumference}`}
        />
      </svg>
    </span>
  );
}

export function InfoIcon({ className = 'w-3.5 h-3.5' }: { className?: string }) {
  return (
    <svg {...SVG_PROPS} className={className}>
      <circle cx="12" cy="12" r="9" />
      <path d="M12 11v5" />
      <circle cx="12" cy="7.8" r="0.6" fill="currentColor" stroke="none" />
    </svg>
  );
}

export function ChevronIcon({ open, className = 'w-4 h-4' }: { open: boolean; className?: string }) {
  return (
    <svg {...SVG_PROPS} className={`${className} transition-transform ${open ? 'rotate-180' : ''}`}>
      <path d="M6 9l6 6 6-6" />
    </svg>
  );
}
