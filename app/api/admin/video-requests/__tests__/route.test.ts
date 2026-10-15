import { beforeEach, describe, expect, it, vi } from 'vitest';

const mocks = vi.hoisted(() => ({
  user: null as null | { id: string; role: string },
  features: { rlsRole: false, questionNumber: false, requestYoutubeId: false, lessonVideos: false, videoRequestRls: false, requestOpens: false },
  query: vi.fn(),
}));

vi.mock('@/lib/auth/session', () => ({ getCurrentUser: async () => mocks.user }));
vi.mock('@/lib/db/client', () => ({ query: mocks.query }));
vi.mock('@/lib/db/schemaFeatures', () => ({ getSchemaFeatures: async () => mocks.features }));
vi.mock('@/lib/db/rls', () => ({
  withRlsContext: vi.fn(async () => {
    throw new Error('role "ashphys_user" does not exist');
  }),
}));
vi.mock('@/lib/videos/lessonPicker', () => ({ getLessonPickerGroups: async () => [] }));
vi.mock('@/lib/storage/signed', () => ({ signedFileUrl: async () => null }));

import { GET, PATCH } from '@/app/api/admin/video-requests/route';

const REQ_ID = 'aaaaaaaa-0000-4000-8000-000000000001';
const patch = (body: unknown) =>
  PATCH(new Request('http://localhost/api/admin/video-requests', { method: 'PATCH', body: JSON.stringify(body) }) as never);

beforeEach(() => {
  mocks.query.mockReset();
  mocks.user = { id: 'admin-1', role: 'admin' };
  mocks.features = { rlsRole: false, questionNumber: false, requestYoutubeId: false, lessonVideos: false, videoRequestRls: false, requestOpens: false };
});

describe('GET /api/admin/video-requests', () => {
  it('refuses a non-admin with "Not authorized" and returns no rows', async () => {
    mocks.user = { id: 'student-1', role: 'student' };
    const res = await GET();
    expect(res.status).toBe(403);
    const body = await res.json();
    expect(body).toEqual({ success: false, error: 'Not authorized' });
    expect(body.requests).toBeUndefined();
    expect(mocks.query).not.toHaveBeenCalled();
  });

  it('refuses a missing user with 401', async () => {
    mocks.user = null;
    const res = await GET();
    expect(res.status).toBe(401);
    expect(mocks.query).not.toHaveBeenCalled();
  });

  it('works on the pre-migration production schema (no question_number, no lesson_videos)', async () => {
    mocks.query.mockResolvedValueOnce({
      rows: [
        {
          id: REQ_ID, student_id: 'stu-1', description: 'd', screenshot_path: null, status: 'open', youtube_url: null,
          admin_note: null, created_at: '2026-10-14T09:00:00Z', topic_id: null, question_number: null,
          first_name: 'Pia', last_name: 'Plus', email: 'p@x', topic_name: null, chapter_number: null, chapter_title: null,
          lesson_videos: [],
        },
      ],
    });
    const res = await GET();
    expect(res.status).toBe(200);
    const sql: string = mocks.query.mock.calls[0][0];
    expect(sql).not.toMatch(/r\.question_number/);
    expect(sql).not.toMatch(/FROM lesson_videos/);
    expect(sql).not.toMatch(/SELECT \*/);
    expect(sql).toMatch(/ORDER BY r\.created_at DESC/);
    const body = await res.json();
    expect(body.requests[0]).toMatchObject({ id: REQ_ID, studentId: 'stu-1', studentName: 'Pia Plus' });
    expect(body.lessonVideosAvailable).toBe(false);
  });

  it('selects the new columns once the migrations are applied', async () => {
    mocks.features = { rlsRole: true, questionNumber: true, requestYoutubeId: true, lessonVideos: true, videoRequestRls: true, requestOpens: true };
    mocks.query.mockResolvedValueOnce({ rows: [] });
    await GET();
    const sql: string = mocks.query.mock.calls[0][0];
    expect(sql).toMatch(/r\.question_number/);
    expect(sql).toMatch(/FROM lesson_videos/);
  });

  it('returns a JSON error (not a bare 500) when the query fails', async () => {
    mocks.query.mockRejectedValueOnce(new Error('column r.question_number does not exist'));
    const res = await GET();
    expect(res.status).toBe(500);
    expect(await res.json()).toEqual({
      success: false,
      error: 'Could not load video requests: column r.question_number does not exist',
    });
  });
});

describe('PATCH /api/admin/video-requests', () => {
  it('saves a link on the pre-migration schema without the RLS role', async () => {
    mocks.query.mockResolvedValueOnce({ rowCount: 1 });
    const res = await patch({ id: REQ_ID, status: 'fulfilled', youtubeUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ&si=x', adminNote: ' see 1:20 ' });
    expect(res.status).toBe(200);
    expect(await res.json()).toEqual({ success: true, youtubeUrl: 'https://youtu.be/dQw4w9WgXcQ', lessonVideo: null });
    const [sql, params] = mocks.query.mock.calls[0];
    expect(sql).not.toMatch(/youtube_id/);
    expect(params).toEqual([REQ_ID, 'fulfilled', 'https://youtu.be/dQw4w9WgXcQ', 'see 1:20']);
  });

  it('also stores youtube_id when that column exists', async () => {
    mocks.features = { rlsRole: false, questionNumber: true, requestYoutubeId: true, lessonVideos: false, videoRequestRls: false, requestOpens: false };
    mocks.query.mockResolvedValueOnce({ rowCount: 1 });
    await patch({ id: REQ_ID, status: 'fulfilled', youtubeUrl: 'https://youtu.be/dQw4w9WgXcQ' });
    const [sql, params] = mocks.query.mock.calls[0];
    expect(sql).toMatch(/youtube_id = \$5/);
    expect(params[4]).toBe('dQw4w9WgXcQ');
  });

  it('explains instead of failing when "add to a lesson" needs the migrations', async () => {
    const res = await patch({
      id: REQ_ID, status: 'fulfilled', youtubeUrl: 'https://youtu.be/dQw4w9WgXcQ',
      attachLessonId: 'bbbbbbbb-0000-4000-8000-000000000002', lessonVideoTitle: 'Worked example',
    });
    expect(res.status).toBe(409);
    expect((await res.json()).error).toMatch(/needs the 2026-10-14 database migrations/);
    expect(mocks.query).not.toHaveBeenCalled();
  });

  it('refuses a non-admin', async () => {
    mocks.user = { id: 'student-1', role: 'student' };
    const res = await patch({ id: REQ_ID, status: 'fulfilled' });
    expect(res.status).toBe(403);
    expect(mocks.query).not.toHaveBeenCalled();
  });

  it('reports a bad link clearly', async () => {
    const res = await patch({ id: REQ_ID, status: 'fulfilled', youtubeUrl: 'https://vimeo.com/1' });
    expect(res.status).toBe(400);
    expect((await res.json()).error).toMatch(/not a YouTube video link/);
  });
});
