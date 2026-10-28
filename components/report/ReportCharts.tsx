/**
 * Small, dependency-free charts for the student progress report. Plain SVG /
 * HTML (server-renderable, no hooks), every mark carries a native hover title
 * and every chart states its numbers in text too, so nothing relies on colour.
 */

import type { ReportDay, ReportDifficulty, ReportMistakes, ReportWeek, ScoreBandId } from '@/lib/reports/types';

export const RIGHT = 'var(--viz-1, #2a78d6)';
export const WRONG = 'var(--viz-2, #eb6834)';

export const BAND_COLOR: Record<ScoreBandId, string> = {
  excellent: '#059669',
  good: '#2563eb',
  developing: '#d97706',
  support: '#e11d48',
  start: '#9ca3af',
};

/** Accuracy → colour, used on every accuracy bar (the % is always printed beside it). */
export function accuracyTone(acc: number | null): { bar: string; text: string; hex: string; label: string } {
  if (acc === null) return { bar: 'bg-gray-300', text: 'text-gray-500', hex: '#d1d5db', label: 'No data' };
  if (acc >= 0.8) return { bar: 'bg-emerald-500', text: 'text-emerald-700', hex: '#10b981', label: 'Strong' };
  if (acc >= 0.6) return { bar: 'bg-blue-500', text: 'text-blue-700', hex: '#3b82f6', label: 'Good' };
  if (acc >= 0.4) return { bar: 'bg-amber-500', text: 'text-amber-700', hex: '#f59e0b', label: 'Shaky' };
  return { bar: 'bg-rose-500', text: 'text-rose-700', hex: '#f43f5e', label: 'Weak' };
}

const pctText = (v: number) => `${Math.round(v * 100)}%`;

export function ScoreRing({ value, band }: { value: number; band: ScoreBandId }) {
  const r = 52;
  const c = 2 * Math.PI * r;
  const shown = band === 'start' ? 0 : Math.max(0, Math.min(100, value));
  return (
    <svg viewBox="0 0 120 120" className="h-[104px] w-[104px] shrink-0 sm:h-[132px] sm:w-[132px]" role="img" aria-label={band === 'start' ? 'Not rated yet' : `Progress score ${shown} out of 100`}>
      <circle cx="60" cy="60" r={r} fill="none" stroke="#eef0f3" strokeWidth="11" />
      <circle
        cx="60"
        cy="60"
        r={r}
        fill="none"
        stroke={BAND_COLOR[band]}
        strokeWidth="11"
        strokeLinecap="round"
        strokeDasharray={`${(shown / 100) * c} ${c}`}
        transform="rotate(-90 60 60)"
      />
      <text x="60" y={band === 'start' ? 66 : 62} textAnchor="middle" className="fill-gray-900" style={{ font: '700 30px system-ui, sans-serif' }}>
        {band === 'start' ? '—' : shown}
      </text>
      {band !== 'start' && (
        <text x="60" y="80" textAnchor="middle" className="fill-gray-400" style={{ font: '600 10px system-ui, sans-serif', letterSpacing: '0.08em' }}>
          OUT OF 100
        </text>
      )}
    </svg>
  );
}

function shortDate(iso: string) {
  return new Date(`${iso}T00:00:00Z`).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', timeZone: 'UTC' });
}

/** Answers per week, right stacked under wrong. */
export function WeeklyChart({ weeks }: { weeks: ReportWeek[] }) {
  const W = 360;
  const H = 150;
  const padL = 26;
  const padB = 22;
  const padT = 8;
  const max = Math.max(4, ...weeks.map((w) => w.correct + w.incorrect));
  const step = Math.pow(10, Math.floor(Math.log10(max)));
  const top = Math.ceil(max / step) * step;
  const slot = (W - padL) / Math.max(1, weeks.length);
  const bw = Math.min(20, slot * 0.62);
  const y = (v: number) => padT + (H - padT - padB) * (1 - v / top);
  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="w-full h-auto" role="img" aria-label="Answers per week, right and wrong">
      {[0, top / 2, top].map((v) => (
        <g key={v}>
          <line x1={padL} x2={W} y1={y(v)} y2={y(v)} stroke="#eef0f3" />
          <text x={padL - 5} y={y(v) + 3} textAnchor="end" style={{ font: '9px system-ui' }} className="fill-gray-400">
            {Math.round(v)}
          </text>
        </g>
      ))}
      {weeks.map((w, i) => {
        const x = padL + i * slot + (slot - bw) / 2;
        const total = w.correct + w.incorrect;
        return (
          <g key={w.week}>
            <title>{`Week of ${shortDate(w.week)}: ${w.correct} right, ${w.incorrect} wrong${total ? ` (${pctText(w.correct / total)})` : ''}`}</title>
            {w.correct > 0 && <rect x={x} y={y(w.correct)} width={bw} height={y(0) - y(w.correct)} rx="2" fill={RIGHT} />}
            {w.incorrect > 0 && <rect x={x} y={y(total)} width={bw} height={y(w.correct) - y(total) - 1} rx="2" fill={WRONG} />}
            {(weeks.length - 1 - i) % 2 === 0 && (
              <text x={x + bw / 2} y={H - 7} textAnchor="middle" style={{ font: '9px system-ui' }} className="fill-gray-400">
                {i === weeks.length - 1 ? 'This wk' : shortDate(w.week)}
              </text>
            )}
          </g>
        );
      })}
    </svg>
  );
}

const HEAT = ['#eef0f3', '#c7dcf7', '#8db8ee', '#4f8fe0', '#1d5fbf'];

/** GitHub-style study calendar: 12 weeks × 7 days, Monday first. */
export function StudyCalendar({ days }: { days: ReportDay[] }) {
  if (!days.length) return null;
  const firstDow = (new Date(`${days[0].day}T00:00:00Z`).getUTCDay() + 6) % 7; // Mon = 0
  const cells = [...Array.from({ length: firstDow }, () => null), ...days];
  const cols = Math.ceil(cells.length / 7);
  const nonZero = days.map((d) => d.count).filter((c) => c > 0).sort((a, b) => a - b);
  const q = (p: number) => nonZero[Math.min(nonZero.length - 1, Math.floor(p * nonZero.length))] ?? 1;
  const level = (c: number) => (c === 0 ? 0 : c <= q(0.25) ? 1 : c <= q(0.5) ? 2 : c <= q(0.8) ? 3 : 4);
  const S = 12;
  const G = 3;
  const left = 16;
  const topPad = 12;
  const months: { col: number; label: string }[] = [];
  for (let col = 0; col < cols; col++) {
    const first = cells.slice(col * 7, col * 7 + 7).find(Boolean) as ReportDay | undefined;
    if (!first) continue;
    const label = new Date(`${first.day}T00:00:00Z`).toLocaleDateString('en-GB', { month: 'short', timeZone: 'UTC' });
    if (!months.length || months[months.length - 1].label !== label) months.push({ col, label });
  }
  const width = left + cols * (S + G);
  const height = topPad + 7 * (S + G);
  return (
    <div>
      <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-auto max-w-[360px]" role="img" aria-label="Study calendar for the last 12 weeks">
        {months.map((m) => (
          <text key={m.col} x={left + m.col * (S + G)} y={8} style={{ font: '8px system-ui' }} className="fill-gray-400">
            {m.label}
          </text>
        ))}
        {['M', '', 'W', '', 'F', '', ''].map((d, i) =>
          d ? (
            <text key={i} x={0} y={topPad + i * (S + G) + 9} style={{ font: '8px system-ui' }} className="fill-gray-400">
              {d}
            </text>
          ) : null
        )}
        {cells.map((c, i) =>
          c ? (
            <rect
              key={c.day}
              x={left + Math.floor(i / 7) * (S + G)}
              y={topPad + (i % 7) * (S + G)}
              width={S}
              height={S}
              rx="2.5"
              fill={HEAT[level(c.count)]}
            >
              <title>{`${new Date(`${c.day}T00:00:00Z`).toLocaleDateString('en-GB', { weekday: 'short', day: 'numeric', month: 'short', timeZone: 'UTC' })}: ${c.count ? `${c.count} action${c.count === 1 ? '' : 's'}` : 'no activity'}`}</title>
            </rect>
          ) : null
        )}
      </svg>
      <div className="mt-1 flex items-center gap-1 text-[10px] text-gray-400">
        Less
        {HEAT.map((h) => (
          <span key={h} className="inline-block w-2.5 h-2.5 rounded-[2px]" style={{ background: h }} />
        ))}
        More
      </div>
    </div>
  );
}

/** A labelled accuracy bar: "Coulomb's law   72% · 31/43". */
export function AccuracyRow({ label, sub, correct, attempted }: { label: string; sub?: string; correct: number; attempted: number }) {
  const acc = attempted ? correct / attempted : null;
  const t = accuracyTone(acc);
  return (
    <div className="min-w-0">
      <div className="flex items-baseline justify-between gap-3 text-sm">
        <span className="truncate text-gray-800" title={label}>
          {label}
          {sub && <span className="text-gray-400"> · {sub}</span>}
        </span>
        <span className="shrink-0 tabular-nums text-xs text-gray-500">
          <span className={`font-semibold ${t.text}`}>{acc === null ? '—' : pctText(acc)}</span> · {correct}/{attempted}
        </span>
      </div>
      <div className="mt-1 h-2 rounded-full bg-gray-100 overflow-hidden">
        <div className={`h-full rounded-full ${t.bar}`} style={{ width: `${(acc ?? 0) * 100}%` }} />
      </div>
    </div>
  );
}

export function DifficultyLadder({ rows }: { rows: ReportDifficulty[] }) {
  const shown = rows.filter((r) => r.attempted > 0);
  if (!shown.length) return <p className="text-sm text-gray-400">No answers yet.</p>;
  return (
    <div className="space-y-2.5">
      {shown.map((r) => (
        <AccuracyRow key={r.level} label={r.label} correct={r.correct} attempted={r.attempted} />
      ))}
    </div>
  );
}

const MISTAKE_PARTS: { key: keyof Omit<ReportMistakes, 'total'>; label: string; color: string; tip: string }[] = [
  { key: 'wrongValue', label: 'Wrong number', color: '#f97316', tip: 'Method or arithmetic slip' },
  { key: 'wrongUnit', label: 'Unit mistake', color: '#8b5cf6', tip: 'Right idea, wrong or missing unit' },
  { key: 'unreadable', label: 'Unreadable answer', color: '#64748b', tip: 'The checker could not read it' },
  { key: 'other', label: 'Wrong choice / other', color: '#f43f5e', tip: 'Multiple-choice and other answers' },
];

/** Why answers were marked wrong, as a donut with a legend. */
export function MistakeDonut({ m }: { m: ReportMistakes }) {
  if (m.total === 0) return <p className="text-sm text-gray-400">No wrong answers to analyse yet.</p>;
  const r = 34;
  const c = 2 * Math.PI * r;
  let offset = 0;
  return (
    <div className="flex items-center gap-4">
      <svg viewBox="0 0 90 90" width="96" height="96" className="shrink-0" role="img" aria-label="Why answers were marked wrong">
        <circle cx="45" cy="45" r={r} fill="none" stroke="#eef0f3" strokeWidth="14" />
        {MISTAKE_PARTS.map((p) => {
          const v = m[p.key];
          if (!v) return null;
          const len = (v / m.total) * c;
          const el = (
            <circle
              key={p.key}
              cx="45"
              cy="45"
              r={r}
              fill="none"
              stroke={p.color}
              strokeWidth="14"
              strokeDasharray={`${Math.max(0, len - 1.5)} ${c}`}
              strokeDashoffset={-offset}
              transform="rotate(-90 45 45)"
            >
              <title>{`${p.label}: ${v} (${pctText(v / m.total)})`}</title>
            </circle>
          );
          offset += len;
          return el;
        })}
        <text x="45" y="49" textAnchor="middle" style={{ font: '700 14px system-ui' }} className="fill-gray-900">
          {m.total}
        </text>
      </svg>
      <ul className="space-y-1.5 text-xs min-w-0">
        {MISTAKE_PARTS.filter((p) => m[p.key] > 0).map((p) => (
          <li key={p.key} className="flex items-start gap-2" title={p.tip}>
            <span className="mt-1 inline-block w-2.5 h-2.5 rounded-sm shrink-0" style={{ background: p.color }} />
            <span className="min-w-0">
              <span className="font-medium text-gray-800">{p.label}</span>{' '}
              <span className="text-gray-500 tabular-nums">
                {m[p.key]} · {pctText(m[p.key] / m.total)}
              </span>
              <span className="block text-gray-400">{p.tip}</span>
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}
