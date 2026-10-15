'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { youtubeThumbnailUrl } from '@/lib/youtube/videoId';
import { YouTubeEmbed } from '@/components/video/YouTubeEmbed';
import type { StudentVideoRequest, VideoRequestStatus } from '@/lib/videoRequests/types';

export type RequestFilter = 'all' | 'ready' | 'in_progress' | 'declined';

const FILTERS: { id: RequestFilter; label: string }[] = [
  { id: 'all', label: 'All' },
  { id: 'ready', label: 'Ready' },
  { id: 'in_progress', label: 'In progress' },
  { id: 'declined', label: 'Declined' },
];

/** "In progress" covers both waiting states: not started yet and being recorded. */
export function matchesFilter(r: StudentVideoRequest, filter: RequestFilter): boolean {
  if (filter === 'all') return true;
  if (filter === 'ready') return r.status === 'fulfilled' && Boolean(r.youtubeId);
  if (filter === 'in_progress') return r.status === 'open' || r.status === 'in_progress';
  return r.status === 'declined';
}

const STATUS: Record<VideoRequestStatus, { label: string; cls: string }> = {
  open: { label: 'Waiting', cls: 'bg-amber-50 text-amber-800 ring-amber-200' },
  in_progress: { label: 'Recording', cls: 'bg-blue-50 text-blue-800 ring-blue-200' },
  fulfilled: { label: 'Ready', cls: 'bg-green-50 text-green-800 ring-green-200' },
  declined: { label: 'Declined', cls: 'bg-gray-100 text-gray-600 ring-gray-200' },
};

function placeLabel(r: StudentVideoRequest): string {
  const chapter = r.chapterTitle ? `Ch. ${r.chapterNumber} — ${r.chapterTitle}` : 'General';
  return r.topicName ? `${chapter} · ${r.topicName}` : chapter;
}

function questionText(r: StudentVideoRequest): string {
  return r.questionNumber ? `Question ${r.questionNumber}: ${r.description}` : r.description;
}

/** Alt text names the lesson and the question, e.g. "Video for Circular motion: Question 7b…". */
export function thumbnailAlt(r: StudentVideoRequest): string {
  const where = r.topicName ?? r.chapterTitle ?? 'your question';
  const q = questionText(r);
  return `Video for ${where}: ${q.length > 90 ? `${q.slice(0, 87)}…` : q}`;
}

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric', timeZone: 'Europe/Istanbul' });
}

function RequestCard({ r, onPlay }: { r: StudentVideoRequest; onPlay: (r: StudentVideoRequest) => void }) {
  const status = STATUS[r.status];
  const playable = r.status === 'fulfilled' && r.youtubeId;
  const isNew = playable && !r.openedAt;
  return (
    <li className="flex flex-col bg-white border border-gray-200 rounded-xl overflow-hidden">
      {playable && (
        <button
          type="button"
          onClick={() => onPlay(r)}
          className="group relative block aspect-video w-full bg-gray-900 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
          aria-label={`Play: ${thumbnailAlt(r)}`}
        >
          {/* eslint-disable-next-line @next/next/no-img-element -- a remote still, no optimisation needed */}
          <img src={youtubeThumbnailUrl(r.youtubeId!)} alt={thumbnailAlt(r)} loading="lazy" className="h-full w-full object-cover opacity-90 group-hover:opacity-100" />
          <span className="absolute inset-0 flex items-center justify-center" aria-hidden="true">
            <span className="flex h-14 w-14 items-center justify-center rounded-full bg-black/70 group-hover:bg-rose-600 transition-colors">
              <svg viewBox="0 0 24 24" className="ml-1 h-7 w-7 fill-white">
                <path d="M8 5v14l11-7z" />
              </svg>
            </span>
          </span>
          {isNew && (
            <span className="absolute left-2 top-2 rounded-full bg-rose-600 px-2 py-0.5 text-[11px] font-bold text-white">New</span>
          )}
        </button>
      )}
      <div className="flex flex-1 flex-col gap-2 p-4">
        <div className="flex items-start justify-between gap-2">
          <p className="text-xs text-gray-500">{placeLabel(r)}</p>
          <span className={`shrink-0 rounded-full px-2 py-0.5 text-[11px] font-bold uppercase tracking-wide ring-1 ${status.cls}`}>
            {status.label}
          </span>
        </div>
        <p className="text-sm text-gray-900 line-clamp-3 whitespace-pre-line">{questionText(r)}</p>
        {r.status === 'declined' && r.adminNote && (
          <p className="text-sm text-gray-700 bg-gray-50 border-l-[3px] border-gray-300 px-3 py-1.5 rounded-r">
            <span className="font-semibold">Note from your teacher:</span> {r.adminNote}
          </p>
        )}
        <p className="mt-auto text-[11px] text-gray-400">Requested {formatDate(r.createdAt)}</p>
      </div>
    </li>
  );
}

function Player({ r, onBack }: { r: StudentVideoRequest; onBack: () => void }) {
  const backRef = useRef<HTMLButtonElement>(null);
  // Show the player from the top of the panel and give keyboard users the way back.
  useEffect(() => {
    backRef.current?.closest('[role=tabpanel]')?.scrollTo({ top: 0 });
    backRef.current?.focus();
  }, []);
  return (
    <div>
      <button
        ref={backRef}
        type="button"
        onClick={onBack}
        className="mb-4 min-h-[44px] inline-flex items-center gap-1 rounded-lg px-3 text-sm font-semibold text-blue-700 hover:bg-blue-50"
      >
        ← Back to requests
      </button>
      <p className="text-xs text-gray-500 mb-1">{placeLabel(r)}</p>
      <h3 className="text-base font-semibold text-gray-900 mb-3">{questionText(r)}</h3>
      <div className="max-w-3xl">
        {/* Mounted only now, after the click: the iframe never exists before. */}
        <YouTubeEmbed youtubeId={r.youtubeId!} title={thumbnailAlt(r)} autoplay />
      </div>
      {r.adminNote && (
        <p className="mt-3 max-w-3xl text-sm text-gray-700 bg-gray-50 border-l-[3px] border-gray-300 px-3 py-1.5 rounded-r">
          <span className="font-semibold">Note from your teacher:</span> {r.adminNote}
        </p>
      )}
    </div>
  );
}

/**
 * "Your requests": filter chips and a responsive card grid, newest first.
 * Clicking a fulfilled card's thumbnail swaps the grid for a player (the
 * iframe is created only then) and reports the video as opened.
 */
export function VideoRequestsGrid({
  requests,
  loading = false,
  onOpen,
  onPlayingChange,
}: {
  requests: StudentVideoRequest[];
  loading?: boolean;
  onOpen?: (r: StudentVideoRequest) => void;
  /** Lets the parent give the player the whole panel (e.g. hide the form above). */
  onPlayingChange?: (playing: boolean) => void;
}) {
  const [filter, setFilter] = useState<RequestFilter>('all');
  const [playingId, setPlayingIdState] = useState<string | null>(null);
  const setPlayingId = (id: string | null) => {
    setPlayingIdState(id);
    onPlayingChange?.(id !== null);
  };

  const sorted = useMemo(() => [...requests].sort((a, b) => b.createdAt.localeCompare(a.createdAt)), [requests]);
  const playing = playingId ? sorted.find((r) => r.id === playingId && r.youtubeId) : undefined;

  if (playing) return <Player r={playing} onBack={() => setPlayingId(null)} />;

  const visible = sorted.filter((r) => matchesFilter(r, filter));
  const count = (f: RequestFilter) => sorted.filter((r) => matchesFilter(r, f)).length;

  return (
    <section aria-labelledby="your-requests">
      <div className="flex flex-wrap items-center justify-between gap-3 mb-3">
        <h2 id="your-requests" className="text-sm font-semibold uppercase tracking-wide text-gray-500">
          Your requests
        </h2>
        <div className="flex flex-wrap gap-1.5" role="group" aria-label="Filter requests">
          {FILTERS.map((f) => (
            <button
              key={f.id}
              type="button"
              aria-pressed={filter === f.id}
              onClick={() => setFilter(f.id)}
              className={`min-h-[44px] sm:min-h-[36px] rounded-full border px-3.5 text-xs font-semibold ${
                filter === f.id ? 'bg-gray-900 text-on-ink border-gray-900' : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
              }`}
            >
              {f.label} <span className="tabular-nums opacity-70">{count(f.id)}</span>
            </button>
          ))}
        </div>
      </div>
      {loading && sorted.length === 0 ? (
        <p className="text-sm text-gray-400">Loading your requests…</p>
      ) : visible.length === 0 ? (
        <p className="text-sm text-gray-500 bg-gray-50 border border-gray-200 rounded-lg px-4 py-3">
          {sorted.length === 0 ? 'No requests yet. Stuck on a question? Ask above.' : 'Nothing here with this filter.'}
        </p>
      ) : (
        <ul className="grid gap-4 grid-cols-1 sm:grid-cols-2 xl:grid-cols-3">
          {visible.map((r) => (
            <RequestCard
              key={r.id}
              r={r}
              onPlay={(req) => {
                setPlayingId(req.id);
                onOpen?.(req);
              }}
            />
          ))}
        </ul>
      )}
    </section>
  );
}
