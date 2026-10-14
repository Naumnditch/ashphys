import { LessonVideoManager } from '@/components/admin/LessonVideoManager';

export default function AdminLessonVideosPage() {
  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-1">Lesson videos</h1>
      <p className="text-gray-500 text-sm mb-8">
        Attach unlisted YouTube videos to a lesson. Plus and Pro students watch them on the lesson page without leaving
        the site; Free students see the titles with a lock.
      </p>
      <LessonVideoManager />
    </div>
  );
}
