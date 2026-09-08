import { query } from '@/lib/db/client';

export interface Course {
  id: string;
  title: string;
  slug: string;
  category: string;
  summary: string | null;
  description: string | null;
  level: string | null;
  price_try: string;
  status: string;
  order: number;
  module_count?: number;
}

export interface CourseModule {
  id: string;
  course_id: string;
  title: string;
  description: string | null;
  video_url: string | null;
  resource_url: string | null;
  duration_minutes: number | null;
  is_free_preview: boolean;
  order: number;
}

export async function getPublishedCourses(): Promise<Course[]> {
  const res = await query(`
    SELECT c.*, (SELECT COUNT(*) FROM course_modules m WHERE m.course_id = c.id)::int AS module_count
    FROM courses c WHERE c.status = 'published' ORDER BY c."order", c.created_at
  `);
  return res.rows as Course[];
}

export async function getCourseBySlug(slug: string): Promise<Course | null> {
  const res = await query(`SELECT * FROM courses WHERE slug = $1`, [slug]);
  return (res.rows[0] as Course) ?? null;
}

export async function getModules(courseId: string): Promise<CourseModule[]> {
  const res = await query(`SELECT * FROM course_modules WHERE course_id = $1 ORDER BY "order", created_at`, [courseId]);
  return res.rows as CourseModule[];
}

/** Enrolled and not expired. A null expires_at means lifetime access. */
export async function isEnrolled(studentId: string, courseId: string): Promise<boolean> {
  const res = await query(
    `SELECT 1 FROM course_enrollments
     WHERE student_id = $1 AND course_id = $2 AND (expires_at IS NULL OR expires_at > now())`,
    [studentId, courseId]
  );
  return res.rows.length > 0;
}
