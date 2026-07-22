const FORMULAS: { text: string; top: string; left?: string; right?: string; size: string; drift: string; delay: string }[] = [
  { text: 'F = ma', top: '8%', left: '4%', size: 'text-2xl', drift: 'animate-drift-a', delay: '0s' },
  { text: 'E = mc²', top: '18%', right: '6%', size: 'text-3xl', drift: 'animate-drift-b', delay: '1s' },
  { text: 'v = u + at', top: '58%', left: '3%', size: 'text-xl', drift: 'animate-drift-c', delay: '0.5s' },
  { text: 'V = IR', top: '70%', right: '10%', size: 'text-2xl', drift: 'animate-drift-d', delay: '2s' },
  { text: 'F = kx', top: '38%', left: '22%', size: 'text-lg', drift: 'animate-drift-e', delay: '1.5s' },
  { text: 'KE = ½mv²', top: '4%', right: '28%', size: 'text-lg', drift: 'animate-drift-a', delay: '3s' },
  { text: 'P = F/A', top: '80%', left: '30%', size: 'text-lg', drift: 'animate-drift-b', delay: '0.8s' },
  { text: 'ρ = m/V', top: '48%', right: '3%', size: 'text-xl', drift: 'animate-drift-c', delay: '2.5s' },
];

export function FloatingFormulas() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none select-none" aria-hidden="true">
      {FORMULAS.map((f, i) => (
        <div
          key={i}
          className={`absolute font-serif italic text-gray-200 ${f.size} ${f.drift}`}
          style={{
            top: f.top,
            left: f.left,
            right: f.right,
            animationDelay: f.delay,
          }}
        >
          {f.text}
        </div>
      ))}
    </div>
  );
}
