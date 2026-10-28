/** Line icons for the handwriting toolbar (24×24, currentColor). */

import type { SVGProps } from 'react';

function Icon({ children, ...props }: SVGProps<SVGSVGElement>) {
  return (
    <svg
      viewBox="0 0 24 24"
      width="20"
      height="20"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
      {...props}
    >
      {children}
    </svg>
  );
}

type P = SVGProps<SVGSVGElement>;

export const PenIcon = (p: P) => (
  <Icon {...p}>
    <path d="M4 20l1.2-4.4L15.6 5.2a2 2 0 0 1 2.8 0l.4.4a2 2 0 0 1 0 2.8L8.4 18.8 4 20z" />
    <path d="M13.8 7l3.2 3.2" />
  </Icon>
);
export const HighlighterIcon = (p: P) => (
  <Icon {...p}>
    <path d="M9 15l-4 4h5l2-2" />
    <path d="M9 15l7.5-10.5a1.8 1.8 0 0 1 2.6-.3l.7.7a1.8 1.8 0 0 1-.3 2.6L9 15z" />
    <path d="M7.5 13.5l3 3" />
  </Icon>
);
export const EraserIcon = (p: P) => (
  <Icon {...p}>
    <path d="M8.5 20H20" />
    <path d="M4.6 15.4l9.9-9.9a2 2 0 0 1 2.8 0l2.2 2.2a2 2 0 0 1 0 2.8L12 18.1a2 2 0 0 1-1.4.6H8.2a2 2 0 0 1-1.4-.6l-2.2-2.2a1.2 1.2 0 0 1 0-1.7z" />
    <path d="M9 11l5 5" />
  </Icon>
);
export const LassoIcon = (p: P) => (
  <Icon {...p}>
    <path d="M7 15.5C4.6 14.6 3 13 3 11c0-3.9 4-7 9-7s9 3.1 9 7-4 7-9 7c-.9 0-1.8-.1-2.6-.3" strokeDasharray="2.5 2.5" />
    <path d="M7 15.5a2 2 0 1 0 1 3.7c.6 1.2.3 2.3-.5 2.8" />
  </Icon>
);
export const ShapesIcon = (p: P) => (
  <Icon {...p}>
    <rect x="3.5" y="11" width="9" height="9" rx="1" />
    <circle cx="16" cy="8" r="4.5" />
  </Icon>
);
export const LineIcon = (p: P) => (
  <Icon {...p}>
    <path d="M5 19L19 5" />
  </Icon>
);
export const ArrowIcon = (p: P) => (
  <Icon {...p}>
    <path d="M5 19L19 5" />
    <path d="M10 5h9v9" />
  </Icon>
);
export const RectIcon = (p: P) => (
  <Icon {...p}>
    <rect x="4" y="6" width="16" height="12" rx="1" />
  </Icon>
);
export const EllipseIcon = (p: P) => (
  <Icon {...p}>
    <ellipse cx="12" cy="12" rx="8.5" ry="6" />
  </Icon>
);
export const HandIcon = (p: P) => (
  <Icon {...p}>
    <path d="M8 13V5.5a1.5 1.5 0 0 1 3 0V11" />
    <path d="M11 10.5V4a1.5 1.5 0 0 1 3 0v6.5" />
    <path d="M14 10.5V5.5a1.5 1.5 0 0 1 3 0V12" />
    <path d="M17 9.5a1.5 1.5 0 0 1 3 0V14a7 7 0 0 1-7 7h-1.3a6 6 0 0 1-4.6-2.2L4 15a1.6 1.6 0 0 1 2.3-2.2L8 14.5" />
  </Icon>
);
export const UndoIcon = (p: P) => (
  <Icon {...p}>
    <path d="M9 14L4 9l5-5" />
    <path d="M4 9h10.5a5.5 5.5 0 0 1 0 11H11" />
  </Icon>
);
export const RedoIcon = (p: P) => (
  <Icon {...p}>
    <path d="M15 14l5-5-5-5" />
    <path d="M20 9H9.5a5.5 5.5 0 0 0 0 11H13" />
  </Icon>
);
export const TrashIcon = (p: P) => (
  <Icon {...p}>
    <path d="M4 7h16" />
    <path d="M10 11v6M14 11v6" />
    <path d="M5 7l1 12a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2l1-12" />
    <path d="M9 7V4h6v3" />
  </Icon>
);
export const PlusIcon = (p: P) => (
  <Icon {...p}>
    <path d="M12 5v14M5 12h14" />
  </Icon>
);
export const MinusIcon = (p: P) => (
  <Icon {...p}>
    <path d="M5 12h14" />
  </Icon>
);
export const FitIcon = (p: P) => (
  <Icon {...p}>
    <path d="M4 9V4h5M20 9V4h-5M4 15v5h5M20 15v5h-5" />
    <rect x="8" y="8" width="8" height="8" rx="1" />
  </Icon>
);
export const FullscreenIcon = (p: P) => (
  <Icon {...p}>
    <path d="M4 9V4h5M15 4h5v5M20 15v5h-5M9 20H4v-5" />
  </Icon>
);
export const ExitFullscreenIcon = (p: P) => (
  <Icon {...p}>
    <path d="M9 4v5H4M20 9h-5V4M15 20v-5h5M4 15h5v5" />
  </Icon>
);
export const ChevronLeftIcon = (p: P) => (
  <Icon {...p}>
    <path d="M15 18l-6-6 6-6" />
  </Icon>
);
export const ChevronRightIcon = (p: P) => (
  <Icon {...p}>
    <path d="M9 18l6-6-6-6" />
  </Icon>
);
export const ChevronDownIcon = (p: P) => (
  <Icon {...p}>
    <path d="M6 9l6 6 6-6" />
  </Icon>
);
/** Pencil only: a pencil over a crossed-out finger. */
export const PencilOnlyIcon = (p: P) => (
  <Icon {...p}>
    <path d="M3 21l1-3.6 8.3-8.3 2.6 2.6L6.6 20 3 21z" />
    <path d="M14.5 6.9l1.6-1.6a1.6 1.6 0 0 1 2.3 0l.3.3a1.6 1.6 0 0 1 0 2.3l-1.6 1.6" />
    <path d="M15 21l6-6" />
  </Icon>
);
export const MoreIcon = (p: P) => (
  <Icon {...p}>
    <circle cx="5" cy="12" r="1" fill="currentColor" />
    <circle cx="12" cy="12" r="1" fill="currentColor" />
    <circle cx="19" cy="12" r="1" fill="currentColor" />
  </Icon>
);
export const CheckIcon = (p: P) => (
  <Icon {...p}>
    <path d="M5 12.5l4.5 4.5L19 7.5" />
  </Icon>
);
export const CloseIcon = (p: P) => (
  <Icon {...p}>
    <path d="M6 6l12 12M18 6L6 18" />
  </Icon>
);
