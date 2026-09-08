import { CourseManager } from '@/components/admin/CourseManager';

export const dynamic = 'force-dynamic';

export default function AdminCoursesPage() {
  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-1">Engineering Courses</h1>
      <p className="text-gray-500 text-sm mb-8 max-w-2xl">
        Supplementary paid courses — SolidWorks, 3D printing, and anything else outside the physics syllabus. Courses
        stay hidden until you set them to Published. Mark a lesson as a free preview to let people sample the course
        before buying.
      </p>
      <CourseManager />
    </div>
  );
}
