export function SimulationIcon({ className = 'w-4 h-4' }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.8}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      {/* flask outline */}
      <path d="M9 3h6" />
      <path d="M10 3v5.2c0 .4-.13.8-.37 1.13L5.7 15.1A2.5 2.5 0 0 0 7.7 19h8.6a2.5 2.5 0 0 0 2-3.9l-3.93-5.77A2 2 0 0 1 14 8.2V3" />
      {/* liquid fill line */}
      <path d="M7.2 14.5h9.6" />
      {/* small bubble */}
      <circle cx="12" cy="16.3" r="0.6" fill="currentColor" stroke="none" />
    </svg>
  );
}
