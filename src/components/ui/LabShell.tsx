import React from 'react';
import { Card } from './Card';

export interface LabShellProps {
  title: string;
  subtitle?: string;
  category?: string;
  viewportSlot: React.ReactNode;
  controlsSlot: React.ReactNode;
  knowledgeSlot?: React.ReactNode;
}

export const LabShell: React.FC<LabShellProps> = ({
  title,
  subtitle,
  category = 'Data Structures & Algorithms',
  viewportSlot,
  controlsSlot,
  knowledgeSlot,
}) => {
  return (
    <main role="main" className="lab-shell">
      {/* Topic Header Section */}
      <section
        aria-labelledby="topic-heading"
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: 'var(--space-1)',
        }}
      >
        <span
          style={{
            fontSize: '12px',
            fontFamily: 'var(--font-mono)',
            color: 'var(--accent-cyan)',
            textTransform: 'uppercase',
            letterSpacing: '0.05em',
            fontWeight: 600,
          }}
        >
          {category}
        </span>
        <h1
          id="topic-heading"
          style={{
            fontSize: '24px',
            fontWeight: 700,
            letterSpacing: '-0.02em',
            color: 'var(--text-primary)',
          }}
        >
          {title}
        </h1>
        {subtitle && (
          <p
            style={{
              fontSize: '14px',
              color: 'var(--text-secondary)',
              lineHeight: 1.5,
              maxWidth: '800px',
            }}
          >
            {subtitle}
          </p>
        )}
      </section>

      {/* Main Interactive Grid: Viewport + Controls */}
      <div className="lab-grid">
        <section aria-label="Interactive Visualization Area" className="viewport-panel">
          <div className="panel-header">
            <span className="panel-title">Interactive Laboratory Viewport</span>
          </div>
          <div className="panel-body">{viewportSlot}</div>
        </section>

        <aside aria-label="Control & Inspection Panel" className="control-panel">
          <div
            style={{
              fontSize: '13px',
              fontWeight: 600,
              fontFamily: 'var(--font-mono)',
              color: 'var(--text-secondary)',
              textTransform: 'uppercase',
              letterSpacing: '0.05em',
              borderBottom: '1px solid var(--border-subtle)',
              paddingBottom: 'var(--space-2)',
            }}
          >
            Controls & State Inspector
          </div>
          {controlsSlot}
        </aside>
      </div>

      {/* Knowledge & Multi-Dimensional Section */}
      {knowledgeSlot && (
        <section aria-label="Algorithmic Knowledge & Code">
          <Card title="Multi-Dimensional Knowledge">{knowledgeSlot}</Card>
        </section>
      )}
    </main>
  );
};
