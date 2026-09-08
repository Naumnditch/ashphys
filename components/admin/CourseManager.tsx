'use client';

import { useEffect, useState } from 'react';

interface Course {
  id: string; title: string; slug: string; category: string; summary: string | null;
  description: string | null; level: string | null; price_try: string; status: string;
  order: number; module_count: number; enrolled_count: number;
}
interface Mod {
  id: string; course_id: string; title: string; description: string | null;
  video_url: string | null; resource_url: string | null; duration_minutes: number | null;
  is_free_preview: boolean; order: number;
}

const blankCourse = { id: '', title: '', slug: '', category: 'SolidWorks', summary: '', description: '', level: 'Beginner', price_try: '', status: 'draft', order: 0 };
const blankMod = { id: '', course_id: '', title: '', description: '', video_url: '', resource_url: '', duration_minutes: '', is_free_preview: false, order: 0 };

export function CourseManager() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [modules, setModules] = useState<Mod[]>([]);
  const [cForm, setCForm] = useState({ ...blankCourse });
  const [mForm, setMForm] = useState({ ...blankMod });
  const [openCourse, setOpenCourse] = useState<string | null>(null);
  const [msg, setMsg] = useState<{ ok: boolean; text: string } | null>(null);
  const [busy, setBusy] = useState(false);

  const load = async () => {
    const res = await fetch('/api/admin/courses');
    if (res.ok) {
      const d = await res.json();
      if (d.success) { setCourses(d.courses); setModules(d.modules); }
    }
  };
  useEffect(() => { load(); }, []);

  const saveCourse = async () => {
    setBusy(true); setMsg(null);
    const res = await fetch('/api/admin/courses', {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ kind: 'course', ...cForm, price_try: parseFloat(cForm.price_try) || 0 }),
    });
    const d = await res.json();
    setBusy(false);
    if (!res.ok || !d.success) { setMsg({ ok: false, text: d.error || 'Could not save' }); return; }
    setMsg({ ok: true, text: cForm.id ? 'Course updated' : 'Course created' });
    setCForm({ ...blankCourse });
    await load();
  };

  const saveModule = async () => {
    setBusy(true); setMsg(null);
    const res = await fetch('/api/admin/courses', {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ kind: 'module', ...mForm, duration_minutes: mForm.duration_minutes ? parseInt(mForm.duration_minutes, 10) : null }),
    });
    const d = await res.json();
    setBusy(false);
    if (!res.ok || !d.success) { setMsg({ ok: false, text: d.error || 'Could not save' }); return; }
    setMsg({ ok: true, text: mForm.id ? 'Lesson updated' : 'Lesson added' });
    setMForm({ ...blankMod, course_id: mForm.course_id });
    await load();
  };

  const del = async (kind: 'course' | 'module', id: string, label: string) => {
    if (!window.confirm(`Delete ${label}? This cannot be undone.`)) return;
    await fetch('/api/admin/courses', { method: 'DELETE', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ kind, id }) });
    await load();
  };

  const inp = 'w-full border border-gray-300 rounded-lg px-3 py-2 text-sm';

  return (
    <div className="space-y-8">
      <div className="bg-white border border-gray-200 rounded-xl p-5">
        <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-4">
          {cForm.id ? 'Edit course' : 'New course'}
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-3">
          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1">Title</label>
            <input className={inp} value={cForm.title} onChange={(e) => setCForm({ ...cForm, title: e.target.value })} placeholder="SolidWorks Essentials" />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1">Category</label>
            <input className={inp} value={cForm.category} onChange={(e) => setCForm({ ...cForm, category: e.target.value })} placeholder="SolidWorks / 3D Printing / Engineering" />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1">Price (TRY)</label>
            <input className={inp} type="number" min="0" step="any" value={cForm.price_try} onChange={(e) => setCForm({ ...cForm, price_try: e.target.value })} placeholder="500" />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1">Level</label>
            <select className={inp} value={cForm.level} onChange={(e) => setCForm({ ...cForm, level: e.target.value })}>
              {['Beginner', 'Intermediate', 'Advanced'].map((l) => <option key={l}>{l}</option>)}
            </select>
          </div>
        </div>
        <div className="mb-3">
          <label className="block text-xs font-medium text-gray-500 mb-1">Short summary (shown on the catalogue card)</label>
          <input className={inp} value={cForm.summary} onChange={(e) => setCForm({ ...cForm, summary: e.target.value })} />
        </div>
        <div className="mb-3">
          <label className="block text-xs font-medium text-gray-500 mb-1">Full description</label>
          <textarea rows={3} className={inp} value={cForm.description} onChange={(e) => setCForm({ ...cForm, description: e.target.value })} />
        </div>
        <div className="flex items-center gap-3 mb-4">
          <label className="text-xs font-medium text-gray-500">Status</label>
          <select className="border border-gray-300 rounded-lg px-3 py-2 text-sm" value={cForm.status} onChange={(e) => setCForm({ ...cForm, status: e.target.value })}>
            <option value="draft">Draft (hidden)</option>
            <option value="published">Published (live)</option>
          </select>
        </div>
        {msg && <p className={`text-sm mb-3 ${msg.ok ? 'text-green-700' : 'text-red-600'}`}>{msg.text}</p>}
        <div className="flex gap-2">
          <button onClick={saveCourse} disabled={busy || !cForm.title} className="bg-gray-900 hover:bg-gray-800 text-white text-sm font-semibold px-5 py-2.5 rounded-lg disabled:opacity-50">
            {busy ? 'Saving…' : cForm.id ? 'Update course' : 'Create course'}
          </button>
          {cForm.id && <button onClick={() => setCForm({ ...blankCourse })} className="text-sm text-gray-500 px-3">Cancel</button>}
        </div>
      </div>

      <div>
        <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-3">Courses</h2>
        {courses.length === 0 && <div className="bg-white border border-gray-200 rounded-xl px-5 py-8 text-center text-sm text-gray-400">No courses yet.</div>}
        <div className="space-y-3">
          {courses.map((c) => {
            const mods = modules.filter((m) => m.course_id === c.id);
            const open = openCourse === c.id;
            return (
              <div key={c.id} className="bg-white border border-gray-200 rounded-xl overflow-hidden">
                <div className="px-5 py-3.5 flex items-center justify-between gap-3">
                  <div className="min-w-0">
                    <div className="font-medium text-gray-900 text-[15px]">
                      {c.title}
                      <span className={`ml-2 text-[10px] font-bold uppercase px-1.5 py-0.5 rounded ${c.status === 'published' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}>
                        {c.status}
                      </span>
                    </div>
                    <div className="text-xs text-gray-400">
                      {c.category} · {parseFloat(c.price_try).toFixed(0)} TRY · {c.module_count} lesson{c.module_count === 1 ? '' : 's'} · {c.enrolled_count} enrolled · /courses/{c.slug}
                    </div>
                  </div>
                  <div className="flex gap-3 flex-shrink-0 text-sm">
                    <button onClick={() => setOpenCourse(open ? null : c.id)} className="font-medium text-gray-600 hover:text-gray-900">
                      {open ? 'Hide' : 'Lessons'}
                    </button>
                    <button onClick={() => { setCForm({ id: c.id, title: c.title, slug: c.slug, category: c.category, summary: c.summary ?? '', description: c.description ?? '', level: c.level ?? 'Beginner', price_try: c.price_try, status: c.status, order: c.order }); window.scrollTo({ top: 0, behavior: 'smooth' }); }} className="font-medium text-blue-600 hover:text-blue-800">
                      Edit
                    </button>
                    <button onClick={() => del('course', c.id, c.title)} className="font-medium text-red-500 hover:text-red-700">Delete</button>
                  </div>
                </div>

                {open && (
                  <div className="border-t border-gray-100 bg-gray-50 px-5 py-4">
                    <div className="space-y-2 mb-4">
                      {mods.length === 0 && <p className="text-sm text-gray-400">No lessons yet.</p>}
                      {mods.map((m, i) => (
                        <div key={m.id} className="bg-white border border-gray-200 rounded-lg px-3 py-2 flex items-center justify-between gap-3">
                          <div className="min-w-0">
                            <div className="text-[13.5px] text-gray-900">
                              <span className="font-mono text-[11px] text-gray-400 mr-2">{String(i + 1).padStart(2, '0')}</span>
                              {m.title}
                              {m.is_free_preview && <span className="ml-2 text-[9.5px] font-bold uppercase bg-green-100 text-green-700 px-1.5 py-0.5 rounded">preview</span>}
                            </div>
                            <div className="text-[11px] text-gray-400">
                              {m.video_url ? 'video ✓' : 'no video'}{m.resource_url ? ' · files ✓' : ''}{m.duration_minutes ? ` · ${m.duration_minutes} min` : ''}
                            </div>
                          </div>
                          <div className="flex gap-2 flex-shrink-0 text-[12.5px]">
                            <button onClick={() => setMForm({ id: m.id, course_id: m.course_id, title: m.title, description: m.description ?? '', video_url: m.video_url ?? '', resource_url: m.resource_url ?? '', duration_minutes: m.duration_minutes ? String(m.duration_minutes) : '', is_free_preview: m.is_free_preview, order: m.order })} className="text-blue-600">Edit</button>
                            <button onClick={() => del('module', m.id, m.title)} className="text-red-500">Delete</button>
                          </div>
                        </div>
                      ))}
                    </div>

                    <div className="bg-white border border-gray-200 rounded-lg p-3">
                      <div className="text-xs font-semibold text-gray-500 uppercase mb-2">{mForm.id ? 'Edit lesson' : 'Add lesson'}</div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mb-2">
                        <input className={inp} placeholder="Lesson title" value={mForm.course_id === c.id ? mForm.title : ''} onChange={(e) => setMForm({ ...mForm, course_id: c.id, title: e.target.value })} />
                        <input className={inp} placeholder="Video URL (YouTube etc)" value={mForm.course_id === c.id ? mForm.video_url : ''} onChange={(e) => setMForm({ ...mForm, course_id: c.id, video_url: e.target.value })} />
                        <input className={inp} placeholder="Files URL (optional)" value={mForm.course_id === c.id ? mForm.resource_url : ''} onChange={(e) => setMForm({ ...mForm, course_id: c.id, resource_url: e.target.value })} />
                        <input className={inp} type="number" placeholder="Minutes" value={mForm.course_id === c.id ? mForm.duration_minutes : ''} onChange={(e) => setMForm({ ...mForm, course_id: c.id, duration_minutes: e.target.value })} />
                      </div>
                      <input className={`${inp} mb-2`} placeholder="Short description (optional)" value={mForm.course_id === c.id ? mForm.description : ''} onChange={(e) => setMForm({ ...mForm, course_id: c.id, description: e.target.value })} />
                      <label className="flex items-center gap-2 mb-3 text-[12.5px] text-gray-600">
                        <input type="checkbox" checked={mForm.course_id === c.id ? mForm.is_free_preview : false} onChange={(e) => setMForm({ ...mForm, course_id: c.id, is_free_preview: e.target.checked })} />
                        Free preview — visible without buying
                      </label>
                      <button onClick={saveModule} disabled={busy || mForm.course_id !== c.id || !mForm.title} className="bg-gray-900 text-white text-[13px] font-semibold px-4 py-2 rounded-lg disabled:opacity-40">
                        {mForm.id ? 'Update lesson' : 'Add lesson'}
                      </button>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
