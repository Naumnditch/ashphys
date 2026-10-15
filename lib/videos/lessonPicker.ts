/**
 * Every lesson, grouped by chapter, for the lesson pickers (admin lesson
 * videos, the video-request forms). IGCSE chapters come first; 9702 units
 * and IB themes carry their course code, matching the existing forms.
 */

import { query } from '@/lib/db/client';
import { chapterLabel } from '@/lib/curricula';

export interface LessonPickerGroup {
  chapterId: string;
  label: string;
  lessons: { id: string; name: string }[];
}

export async function getLessonPickerGroups(): Promise<LessonPickerGroup[]> {
  const result = await query(
    `SELECT c.id AS chapter_id, c.chapter_number, c.title AS chapter_title, co.code AS course_code,
            t.id AS topic_id, t.topic_name
     FROM chapters c
     JOIN courses co ON co.id = c.course_id
     JOIN topics t ON t.chapter_id = c.id
     WHERE c.status = 'published'
     ORDER BY co.code = '0625' DESC, co.code, c.chapter_number, t."order", t.topic_name`
  );
  const groups: LessonPickerGroup[] = [];
  for (const r of result.rows) {
    let group = groups[groups.length - 1];
    if (!group || group.chapterId !== r.chapter_id) {
      const prefix = r.course_code && r.course_code !== '0625' ? `${r.course_code} · ` : '';
      group = { chapterId: r.chapter_id, label: `${prefix}${chapterLabel(r.course_code, r.chapter_number)} — ${r.chapter_title}`, lessons: [] };
      groups.push(group);
    }
    group.lessons.push({ id: r.topic_id, name: r.topic_name });
  }
  return groups;
}
