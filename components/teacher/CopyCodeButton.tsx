'use client';

import { useState } from 'react';

export function CopyCodeButton({ code }: { code: string }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 1600);
    } catch {
      // clipboard API unavailable; silently ignore
    }
  };

  return (
    <button
      onClick={handleCopy}
      className="font-mono text-sm font-bold tracking-widest bg-gray-100 hover:bg-gray-200 text-gray-800 px-3 py-1.5 rounded-md transition-colors"
      title="Click to copy"
    >
      {copied ? 'Copied ✓' : code}
    </button>
  );
}
