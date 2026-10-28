'use client';

/** Small pieces shared by the editor and the read-only viewer: zoom bar, icon buttons, anchored popovers. */

import { useEffect, useLayoutEffect, useRef, useState, type ReactNode } from 'react';
import { ExitFullscreenIcon, FitIcon, FullscreenIcon, MinusIcon, PlusIcon } from './icons';

export function IconButton({
  label,
  onClick,
  active = false,
  disabled = false,
  children,
  className = '',
  ...rest
}: {
  label: string;
  onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void;
  active?: boolean;
  disabled?: boolean;
  children: ReactNode;
  className?: string;
} & Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, 'onClick'>) {
  return (
    <button
      type="button"
      title={label}
      aria-label={label}
      aria-pressed={active || undefined}
      disabled={disabled}
      onClick={onClick}
      className={`inline-flex items-center justify-center shrink-0 w-9 h-9 rounded-lg transition-colors disabled:opacity-35 disabled:pointer-events-none ${
        active ? 'bg-gray-900 text-on-ink' : 'text-gray-700 hover:bg-gray-100'
      } ${className}`}
      {...rest}
    >
      {children}
    </button>
  );
}

export function ZoomBar({
  zoom,
  onZoomIn,
  onZoomOut,
  onFit,
  onReset,
  fullscreen,
  onToggleFullscreen,
  className = '',
}: {
  zoom: number;
  onZoomIn: () => void;
  onZoomOut: () => void;
  onFit: () => void;
  onReset: () => void;
  fullscreen: boolean;
  onToggleFullscreen: () => void;
  className?: string;
}) {
  return (
    <div
      className={`flex items-center gap-0.5 rounded-xl border border-gray-200 bg-white/95 shadow-sm p-0.5 ${className}`}
      role="toolbar"
      aria-label="Zoom"
    >
      <IconButton label="Zoom out" onClick={onZoomOut}>
        <MinusIcon />
      </IconButton>
      <button
        type="button"
        onClick={onReset}
        title="Reset to 100%"
        aria-label={`Zoom ${Math.round(zoom * 100)}%, reset to 100%`}
        className="min-w-[3.25rem] h-9 px-1 rounded-lg text-xs font-semibold tabular-nums text-gray-700 hover:bg-gray-100"
      >
        {Math.round(zoom * 100)}%
      </button>
      <IconButton label="Zoom in" onClick={onZoomIn}>
        <PlusIcon />
      </IconButton>
      <IconButton label="Fit to screen" onClick={onFit}>
        <FitIcon />
      </IconButton>
      <IconButton label={fullscreen ? 'Exit full screen' : 'Full screen'} onClick={onToggleFullscreen}>
        {fullscreen ? <ExitFullscreenIcon /> : <FullscreenIcon />}
      </IconButton>
    </div>
  );
}

/**
 * A panel anchored under (or above) a button. Positioned `fixed` from the
 * anchor's rectangle so a scrolling toolbar can't clip it; closes on an
 * outside press or Escape.
 */
export function Popover({
  anchor,
  onClose,
  children,
  label,
  placement = 'below',
}: {
  anchor: HTMLElement | null;
  onClose: () => void;
  children: ReactNode;
  label: string;
  placement?: 'below' | 'above';
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [pos, setPos] = useState<{ left: number; top: number } | null>(null);

  useLayoutEffect(() => {
    if (!anchor || !ref.current) return;
    const a = anchor.getBoundingClientRect();
    const p = ref.current.getBoundingClientRect();
    const vw = window.innerWidth;
    const vh = window.innerHeight;
    const left = Math.max(8, Math.min(a.left, vw - p.width - 8));
    const below = a.bottom + 6;
    const above = a.top - p.height - 6;
    const top = placement === 'above' ? (above >= 8 ? above : below) : below + p.height <= vh - 8 ? below : Math.max(8, above);
    setPos({ left, top });
  }, [anchor, placement]);

  useEffect(() => {
    const onDown = (e: PointerEvent) => {
      const t = e.target as Node;
      if (ref.current?.contains(t) || anchor?.contains(t)) return;
      onClose();
    };
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onClose();
    document.addEventListener('pointerdown', onDown, true);
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('pointerdown', onDown, true);
      document.removeEventListener('keydown', onKey);
    };
  }, [anchor, onClose]);

  return (
    <div
      ref={ref}
      role="dialog"
      aria-label={label}
      className="fixed z-[80] rounded-xl border border-gray-200 bg-white shadow-lg p-3 text-sm text-gray-800"
      style={{ left: pos?.left ?? -9999, top: pos?.top ?? -9999 }}
    >
      {children}
    </div>
  );
}
