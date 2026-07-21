import Link from 'next/link';

const FEATURES = [
  {
    title: 'The Full Curriculum',
    desc: 'Every unit of Cambridge IGCSE Physics (0625), 25 chapters and 89 lessons, structured exactly to the syllabus — not a partial selection of "highlights".',
  },
  {
    title: 'Real, Interactive Simulations',
    desc: 'Not diagrams — actual physics engines you can drag, load, and break. Watch a pendulum lose energy in real time, solve a circuit by really solving it, load a spring past its limit and watch it deform.',
  },
  {
    title: 'A Real Teacher, Not Just Content',
    desc: "Built by a working IGCSE Physics teacher with an engineering background, not assembled from a generic content mill. Every lesson reflects what actually gets asked, and what actually confuses students.",
  },
  {
    title: 'Your Class, Online Too',
    desc: "Join your teacher's section with a class code, and everything they assign lives in the same place you study — no separate app for homework, another for notes, a third for practice.",
  },
];

const ROADMAP = [
  { label: 'Live now', items: ['Full curriculum (25 chapters)', 'Interactive simulations', 'Teacher classes & sections', 'Topic-by-topic practice with instant feedback'] },
  { label: 'Coming next', items: ['Timed quizzes & exams', 'Personalized revision suggestions at scale', 'Subscriptions for full access'] },
];

export default function AboutPage() {
  return (
    <div>
      {/* Hero */}
      <section className="text-center max-w-2xl mx-auto px-4 py-14">
        <h1 className="text-4xl font-bold tracking-tight text-gray-900 mb-4">
          One website. All of IGCSE Physics.
        </h1>
        <p className="text-lg text-gray-600 leading-relaxed">
          AshPhys is built to be the only place a student needs to study IGCSE Physics —
          the full syllabus, real interactive simulations, and topic-by-topic practice that
          actually adapts to you, all built by a teacher who teaches this course every day.
        </p>
        <div className="flex items-center justify-center gap-3 mt-8">
          <Link
            href="/curriculum"
            className="bg-gray-900 hover:bg-black text-white px-6 py-3 rounded-lg font-semibold text-sm"
          >
            Browse the Curriculum
          </Link>
          <Link
            href="/auth/signup"
            className="border border-gray-300 hover:bg-gray-50 text-gray-800 px-6 py-3 rounded-lg font-semibold text-sm"
          >
            Create Free Account
          </Link>
        </div>
      </section>

      {/* Feature grid */}
      <section className="max-w-4xl mx-auto px-4 py-10">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          {FEATURES.map((f) => (
            <div key={f.title} className="border border-gray-200 rounded-xl p-6 bg-white">
              <h3 className="font-bold text-gray-900 mb-2">{f.title}</h3>
              <p className="text-sm text-gray-600 leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Roadmap - honest about what's live vs coming */}
      <section className="max-w-4xl mx-auto px-4 py-10">
        <h2 className="text-xl font-bold text-gray-900 mb-5 text-center">Where we are</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          {ROADMAP.map((col) => (
            <div key={col.label} className="bg-gray-50 border border-gray-200 rounded-xl p-6">
              <div className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-3">
                {col.label}
              </div>
              <ul className="space-y-2">
                {col.items.map((item) => (
                  <li key={item} className="text-sm text-gray-700 flex items-start gap-2">
                    <span className={col.label === 'Live now' ? 'text-green-600' : 'text-gray-300'}>
                      {col.label === 'Live now' ? '✓' : '○'}
                    </span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>

      {/* Founder */}
      <section className="max-w-2xl mx-auto px-4 py-14 text-center border-t border-gray-100 mt-6">
        <h2 className="text-xl font-bold text-gray-900 mb-3">Built by a physics teacher, not a content farm</h2>
        <p className="text-gray-600 leading-relaxed text-[15px]">
          AshPhys is written and built by an IGCSE Physics teacher with an engineering background
          (M.Sc. Industrial Engineering, B.Sc. Electrical &amp; Electronics Engineering) who teaches
          this exact course to real students every week. Every lesson, simulation, and question on
          this site exists because it&rsquo;s something a real physics class actually needed —
          not because it filled a template.
        </p>
      </section>
    </div>
  );
}
