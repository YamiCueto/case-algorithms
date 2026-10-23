import React from 'react';

export const LabIcon: React.FC<{ kind: string }> = ({ kind }) => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    {kind === 'array' ? <><rect x="2" y="6" width="20" height="12" rx="3" /><path d="M9 6v12M15 6v12" /></>
      : kind === 'stack' ? <><path d="m3 7 9-4 9 4-9 4-9-4Zm0 5 9 4 9-4M3 17l9 4 9-4" /></>
        : kind === 'queue' ? <><path d="M3 8h18M3 16h18m-3-3 3 3-3 3M6 5 3 8l3 3" /><path d="M8 11v2m4-2v2m4-2v2" /></>
          : <><rect x="2" y="7" width="6" height="10" rx="2" /><rect x="16" y="7" width="6" height="10" rx="2" /><path d="M8 12h8m-3-3 3 3-3 3" /></>}
  </svg>
);
