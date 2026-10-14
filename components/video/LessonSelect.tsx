import type { LessonPickerGroup } from '@/lib/videos/lessonPicker';

/** A <select> of lessons grouped by chapter (one <optgroup> per chapter). */
export function LessonSelect({
  groups,
  value,
  onChange,
  placeholder = 'Choose a lesson…',
  id,
  required,
  className = 'w-full border border-gray-300 rounded-lg px-3 py-2 text-sm bg-white',
}: {
  groups: LessonPickerGroup[];
  value: string;
  onChange: (lessonId: string) => void;
  placeholder?: string;
  id?: string;
  required?: boolean;
  className?: string;
}) {
  return (
    <select id={id} value={value} required={required} onChange={(e) => onChange(e.target.value)} className={className}>
      <option value="">{placeholder}</option>
      {groups.map((g) => (
        <optgroup key={g.chapterId} label={g.label}>
          {g.lessons.map((l) => (
            <option key={l.id} value={l.id}>
              {l.name}
            </option>
          ))}
        </optgroup>
      ))}
    </select>
  );
}
