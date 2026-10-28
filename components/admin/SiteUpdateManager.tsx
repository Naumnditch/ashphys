'use client';

import { useCallback, useEffect, useState } from 'react';
import { putFileToSignedUrl } from '@/lib/storage/directUpload';
import { formatUpdateDate, MEDIA_SLOTS, siteUpdateStatus, slugify, type AdminSiteUpdate, type MediaSlot, type SiteUpdateStatus } from '@/lib/siteUpdates/types';

const input = 'w-full border border-gray-300 rounded-lg px-3 py-2 text-sm bg-white';
const label = 'block text-xs font-medium text-gray-500 mb-1';

type Form = {
  slug: string;
  title: string;
  summary: string;
  ctaLabel: string;
  ctaHref: string;
  /** datetime-local value (the admin's own time zone), '' = not set */
  publishedAt: string;
} & Record<(typeof MEDIA_SLOTS)[MediaSlot]['column'], string>;

const EMPTY: Form = {
  slug: '',
  title: '',
  summary: '',
  ctaLabel: '',
  ctaHref: '',
  publishedAt: '',
  videoMp4Url: '',
  videoWebmUrl: '',
  loopMp4Url: '',
  loopWebmUrl: '',
  posterUrl: '',
  captionsVttUrl: '',
};

const STATUS_STYLE: Record<SiteUpdateStatus, string> = {
  live: 'bg-green-100 text-green-800',
  scheduled: 'bg-blue-100 text-blue-800',
  draft: 'bg-gray-100 text-gray-700',
  unpublished: 'bg-amber-100 text-amber-800',
};

/** ISO → value for <input type="datetime-local"> in the browser's time zone. */
function toLocalInput(iso: string | null): string {
  if (!iso) return '';
  const d = new Date(iso);
  const pad = (n: number) => String(n).padStart(2, '0');
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

function fromUpdate(u: AdminSiteUpdate): Form {
  return {
    slug: u.slug,
    title: u.title,
    summary: u.summary,
    ctaLabel: u.ctaLabel ?? '',
    ctaHref: u.ctaHref ?? '',
    publishedAt: toLocalInput(u.publishedAt),
    videoMp4Url: u.videoMp4Url ?? '',
    videoWebmUrl: u.videoWebmUrl ?? '',
    loopMp4Url: u.loopMp4Url ?? '',
    loopWebmUrl: u.loopWebmUrl ?? '',
    posterUrl: u.posterUrl ?? '',
    captionsVttUrl: u.captionsVttUrl ?? '',
  };
}

function MediaField({
  slot,
  form,
  setField,
  disabled,
}: {
  slot: MediaSlot;
  form: Form;
  setField: (k: keyof Form, v: string) => void;
  disabled: boolean;
}) {
  const spec = MEDIA_SLOTS[slot];
  const [state, setState] = useState<string | null>(null);
  const id = `su-${slot}`;

  const upload = async (file: File) => {
    if (!form.slug) return setState('Set the slug first (files are stored under it).');
    setState(`Uploading ${file.name}…`);
    try {
      const contentType = slot === 'captions' ? 'text/vtt' : file.type;
      const res = await fetch('/api/admin/site-updates/upload', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ slug: form.slug, slot, contentType }),
      });
      const data = await res.json();
      if (!res.ok || !data.success) return setState(data.error || 'Could not start the upload.');
      const put = await putFileToSignedUrl(data.signedUrl, file, data.contentType);
      if (!put.ok) return setState(`Upload failed: ${put.error}`);
      setField(spec.column, data.publicUrl);
      setState(`Uploaded ${file.name} (${(file.size / 1e6).toFixed(1)} MB). Save to keep it.`);
    } catch {
      setState('Network error during upload.');
    }
  };

  return (
    <div>
      <label htmlFor={id} className={label}>
        {spec.label}
      </label>
      <div className="flex gap-2">
        <input
          id={id}
          value={form[spec.column]}
          onChange={(e) => setField(spec.column, e.target.value)}
          placeholder="https://… or /path"
          className={input}
        />
        <label className="btn btn-secondary text-xs whitespace-nowrap cursor-pointer">
          Upload
          <input
            type="file"
            accept={spec.accept}
            className="sr-only"
            disabled={disabled}
            onChange={(e) => {
              const f = e.target.files?.[0];
              e.target.value = '';
              if (f) upload(f);
            }}
          />
        </label>
      </div>
      {state && <p className="text-xs text-gray-500 mt-1">{state}</p>}
    </div>
  );
}

function UpdateForm({ editing, onDone }: { editing: AdminSiteUpdate | null; onDone: () => void }) {
  const [form, setForm] = useState<Form>(editing ? fromUpdate(editing) : EMPTY);
  const [slugTouched, setSlugTouched] = useState(Boolean(editing));
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const setField = useCallback((k: keyof Form, v: string) => setForm((f) => ({ ...f, [k]: v })), []);

  const save = async (publish: boolean) => {
    setError(null);
    setSaving(true);
    try {
      const body = {
        ...form,
        publishedAt: form.publishedAt ? new Date(form.publishedAt).toISOString() : null,
        publish,
      };
      const res = await fetch(editing ? `/api/admin/site-updates/${editing.id}` : '/api/admin/site-updates', {
        method: editing ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });
      const data = await res.json();
      if (!res.ok || !data.success) return setError(data.error || 'Save failed');
      onDone();
    } catch {
      setError('Network error');
    } finally {
      setSaving(false);
    }
  };

  const videoSrc = form.videoMp4Url || form.loopMp4Url;

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        save(false);
      }}
      className="bg-white border border-gray-200 rounded-xl p-6 mb-10"
    >
      <h2 className="font-semibold text-gray-900 mb-4">{editing ? `Edit “${editing.title}”` : 'New announcement'}</h2>
      <div className="grid gap-6 lg:grid-cols-2">
        <div className="space-y-3">
          <div>
            <label htmlFor="su-title" className={label}>Title</label>
            <input
              id="su-title"
              value={form.title}
              maxLength={120}
              required
              onChange={(e) => {
                setField('title', e.target.value);
                if (!slugTouched) setField('slug', slugify(e.target.value));
              }}
              className={input}
            />
          </div>
          <div>
            <label htmlFor="su-slug" className={label}>Slug (folder for the files; also the video pipeline&rsquo;s --update name)</label>
            <input
              id="su-slug"
              value={form.slug}
              maxLength={80}
              required
              onChange={(e) => {
                setSlugTouched(true);
                setField('slug', e.target.value);
              }}
              className={`${input} font-mono`}
            />
          </div>
          <div>
            <label htmlFor="su-summary" className={label}>One-line summary ({form.summary.length}/280)</label>
            <textarea id="su-summary" value={form.summary} maxLength={280} rows={2} onChange={(e) => setField('summary', e.target.value)} className={input} />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label htmlFor="su-cta-label" className={label}>Button label</label>
              <input id="su-cta-label" value={form.ctaLabel} maxLength={40} onChange={(e) => setField('ctaLabel', e.target.value)} placeholder="Try a practice question" className={input} />
            </div>
            <div>
              <label htmlFor="su-cta-href" className={label}>Button link</label>
              <input id="su-cta-href" value={form.ctaHref} onChange={(e) => setField('ctaHref', e.target.value)} placeholder="/curriculum" className={input} />
            </div>
          </div>
          <div>
            <label htmlFor="su-date" className={label}>Publish date (empty = now, when you publish; a future date schedules it)</label>
            <input id="su-date" type="datetime-local" value={form.publishedAt} onChange={(e) => setField('publishedAt', e.target.value)} className={input} />
          </div>
        </div>
        <div className="space-y-3">
          {(Object.keys(MEDIA_SLOTS) as MediaSlot[]).map((slot) => (
            <MediaField key={slot} slot={slot} form={form} setField={setField} disabled={saving} />
          ))}
          {(form.posterUrl || videoSrc) && (
            <div className="aspect-video rounded-lg overflow-hidden bg-gray-900">
              {/* eslint-disable-next-line jsx-a11y/media-has-caption -- admin preview only */}
              <video key={videoSrc + form.posterUrl} className="h-full w-full object-contain" src={videoSrc || undefined} poster={form.posterUrl || undefined} controls muted playsInline preload="metadata" />
            </div>
          )}
        </div>
      </div>
      {error && <p className="text-sm text-red-600 mt-4">{error}</p>}
      <div className="flex flex-wrap gap-3 mt-6">
        <button type="submit" disabled={saving} className="btn btn-secondary">
          {editing ? 'Save' : 'Save draft'}
        </button>
        {!editing && (
          <button type="button" disabled={saving} onClick={() => save(true)} className="btn btn-primary">
            Save &amp; publish
          </button>
        )}
        <button type="button" onClick={onDone} className="btn text-gray-600 hover:bg-gray-100">
          Cancel
        </button>
      </div>
    </form>
  );
}

export function SiteUpdateManager() {
  const [updates, setUpdates] = useState<AdminSiteUpdate[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [editing, setEditing] = useState<AdminSiteUpdate | 'new' | null>(null);
  const [busy, setBusy] = useState<string | null>(null);
  const now = Date.now();

  const load = useCallback(async () => {
    try {
      const res = await fetch('/api/admin/site-updates', { cache: 'no-store' });
      const data = await res.json();
      if (!res.ok || !data.success) throw new Error(data.error || 'Could not load the updates.');
      setUpdates(data.updates);
      setError(null);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Could not load the updates.');
      setUpdates([]);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const act = async (u: AdminSiteUpdate, action: 'publish' | 'unpublish' | 'delete') => {
    if (action === 'delete' && !window.confirm(`Delete “${u.title}”? Its files stay in storage.`)) return;
    setBusy(u.id);
    try {
      const res = await fetch(`/api/admin/site-updates/${u.id}`, {
        method: action === 'delete' ? 'DELETE' : 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: action === 'delete' ? undefined : JSON.stringify({ action }),
      });
      const data = await res.json();
      if (!res.ok || !data.success) setError(data.error || 'That did not work.');
      await load();
    } finally {
      setBusy(null);
    }
  };

  const liveId = updates?.find((u) => siteUpdateStatus(u, now) === 'live')?.id;

  return (
    <div>
      {editing ? (
        <UpdateForm
          key={editing === 'new' ? 'new' : editing.id}
          editing={editing === 'new' ? null : editing}
          onDone={() => {
            setEditing(null);
            load();
          }}
        />
      ) : (
        <button type="button" onClick={() => setEditing('new')} className="btn btn-primary mb-8">
          New announcement
        </button>
      )}

      {error && <p className="text-sm text-red-600 mb-4">{error}</p>}
      {updates === null ? (
        <p className="text-sm text-gray-500">Loading…</p>
      ) : updates.length === 0 ? (
        <p className="text-sm text-gray-500">No announcements yet. The homepage shows nothing extra until one is published.</p>
      ) : (
        <ul className="space-y-3">
          {updates.map((u) => {
            const status = siteUpdateStatus(u, now);
            return (
              <li key={u.id} className="bg-white border border-gray-200 rounded-xl p-4 flex flex-col sm:flex-row gap-4">
                <div className="sm:w-40 shrink-0 aspect-video rounded-lg overflow-hidden bg-gray-100">
                  {u.posterUrl && (
                    // eslint-disable-next-line @next/next/no-img-element -- storage URL, admin-only thumbnail
                    <img src={u.posterUrl} alt="" className="h-full w-full object-cover" loading="lazy" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex flex-wrap items-center gap-2 mb-1">
                    <span className={`text-[11px] font-semibold uppercase tracking-wide rounded-full px-2 py-0.5 ${STATUS_STYLE[status]}`}>{status}</span>
                    {u.id === liveId && <span className="text-[11px] font-semibold text-green-700">In the hero now</span>}
                    {u.publishedAt && <span className="text-xs text-gray-500">{formatUpdateDate(u.publishedAt)}</span>}
                  </div>
                  <p className="font-semibold text-gray-900 truncate">{u.title}</p>
                  <p className="text-sm text-gray-500 line-clamp-2">{u.summary}</p>
                  <p className="text-xs text-gray-400 font-mono mt-1">{u.slug}</p>
                </div>
                <div className="flex sm:flex-col gap-2 shrink-0">
                  <button type="button" className="btn btn-secondary text-xs" onClick={() => setEditing(u)} disabled={busy === u.id}>
                    Edit
                  </button>
                  {u.isActive ? (
                    <button type="button" className="btn btn-secondary text-xs" onClick={() => act(u, 'unpublish')} disabled={busy === u.id}>
                      Unpublish
                    </button>
                  ) : (
                    <button type="button" className="btn btn-primary text-xs" onClick={() => act(u, 'publish')} disabled={busy === u.id}>
                      Publish
                    </button>
                  )}
                  <button type="button" className="btn text-xs text-red-600 hover:bg-red-50" onClick={() => act(u, 'delete')} disabled={busy === u.id}>
                    Delete
                  </button>
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
