/**
 * Chapters and lessons for the video request form's two dropdowns. Moved
 * from app/video-requests/page.tsx (same query) when that page became a
 * redirect to the dashboard's Video Solve Requests tab.
 */

import { query } from '@/lib/db/client';

export async function getVideoRequestFormOptions() {
  const [chapters, topics] = await Promise.all([
    query(
      // IGCSE chapters first; 9702 units and IB themes are labelled with their course.
      `SELECT c.id, c.chapter_number,
              CASE WHEN co.code = '0625' THEN c.title ELSE co.code || ' · ' || c.title END AS title
       FROM chapters c JOIN courses co ON co.id = c.course_id
       ORDER BY co.code = '0625' DESC, co.code, c.chapter_number ASC`
    ),
    query(`SELECT id, chapter_id, topic_name, "order" FROM topics ORDER BY "order" ASC`),
  ]);
  return { chapters: chapters.rows, topics: topics.rows };
}
