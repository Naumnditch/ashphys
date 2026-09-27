import { SolutionViewer } from '@/components/solutions/SolutionViewer';

export const dynamic = 'force-dynamic';

export default function SolutionPage({ params }: { params: { id: string } }) {
  return (
    <div
      className="min-h-screen"
      style={{
        background:
          'linear-gradient(#d8e3ec 1px, transparent 1px) 0 0/24px 24px, linear-gradient(90deg, #d8e3ec 1px, transparent 1px) 0 0/24px 24px, #faf7f0',
      }}
    >
      <div className="max-w-4xl mx-auto px-4 py-8">
        <SolutionViewer id={params.id} />
      </div>
    </div>
  );
}
