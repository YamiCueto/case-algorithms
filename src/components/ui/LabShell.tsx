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
      <section aria-labelledby="topic-heading" className="lab-topic-header">
        <span className="lab-category-tag">{category}</span>
        <h1 id="topic-heading" className="lab-topic-title">
          {title}
        </h1>
        {subtitle && <p className="lab-topic-subtitle">{subtitle}</p>}
      </section>

      <div className="lab-grid">
        <section aria-label="Interactive Visualization Area" className="viewport-panel">
          <div className="panel-header">
            <span className="panel-title">Interactive Laboratory Viewport</span>
          </div>
          <div className="panel-body">{viewportSlot}</div>
        </section>

        <aside aria-label="Control & Inspection Panel" className="control-panel">
          <div className="control-panel-heading">Controls & State Inspector</div>
          {controlsSlot}
        </aside>
      </div>

      {knowledgeSlot && (
        <section aria-label="Algorithmic Knowledge & Code">
          <Card title="Multi-Dimensional Knowledge">{knowledgeSlot}</Card>
        </section>
      )}
    </main>
  );
};
