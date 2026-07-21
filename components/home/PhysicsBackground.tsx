function AtomIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 60 60" fill="none" className={className}>
      <circle cx="30" cy="30" r="3" fill="currentColor" />
      <ellipse cx="30" cy="30" rx="26" ry="10" stroke="currentColor" strokeWidth="1.4" />
      <ellipse cx="30" cy="30" rx="26" ry="10" stroke="currentColor" strokeWidth="1.4" transform="rotate(60 30 30)" />
      <ellipse cx="30" cy="30" rx="26" ry="10" stroke="currentColor" strokeWidth="1.4" transform="rotate(120 30 30)" />
    </svg>
  );
}

function PendulumIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 40 60" fill="none" className={className}>
      <line x1="6" y1="4" x2="34" y2="4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      <line x1="20" y1="4" x2="32" y2="42" stroke="currentColor" strokeWidth="1.6" />
      <circle cx="32" cy="48" r="7" stroke="currentColor" strokeWidth="1.6" />
    </svg>
  );
}

function WaveIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 80 30" fill="none" className={className}>
      <path
        d="M0 15 C 8 0, 16 0, 20 15 S 32 30, 40 15 S 52 0, 60 15 S 72 30, 80 15"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  );
}

function OrbitIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 50 50" fill="none" className={className}>
      <circle cx="25" cy="25" r="21" stroke="currentColor" strokeWidth="1.2" strokeDasharray="3 4" />
      <circle cx="25" cy="25" r="2.5" fill="currentColor" />
    </svg>
  );
}

interface FloatingIconProps {
  icon: 'atom' | 'pendulum' | 'wave' | 'orbit';
  className: string;
  size?: number;
  color?: string;
}

function FloatingIcon({ icon, className, size = 60, color = 'text-gray-300' }: FloatingIconProps) {
  const Icon = { atom: AtomIcon, pendulum: PendulumIcon, wave: WaveIcon, orbit: OrbitIcon }[icon];
  return (
    <div className={className} style={{ width: size, height: size }} aria-hidden="true">
      <Icon className={`w-full h-full ${color}`} />
    </div>
  );
}

export function PhysicsBackground() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none" aria-hidden="true">
      <FloatingIcon
        icon="atom"
        className="absolute top-10 left-[8%] animate-drift-a"
        size={56}
        color="text-blue-200"
      />
      <div className="absolute top-24 right-[12%] animate-spin-slow">
        <FloatingIcon icon="orbit" className="" size={46} color="text-gray-200" />
      </div>
      <FloatingIcon
        icon="pendulum"
        className="absolute bottom-8 left-[16%] animate-drift-b"
        size={40}
        color="text-gray-200"
      />
      <FloatingIcon
        icon="wave"
        className="absolute bottom-16 right-[18%] animate-drift-c"
        size={64}
        color="text-blue-200"
      />
      <div className="absolute top-6 right-[30%] animate-spin-slower">
        <FloatingIcon icon="orbit" className="" size={30} color="text-gray-200" />
      </div>
      <FloatingIcon
        icon="atom"
        className="absolute bottom-24 right-[6%] animate-drift-a"
        size={38}
        color="text-gray-200"
      />
    </div>
  );
}
