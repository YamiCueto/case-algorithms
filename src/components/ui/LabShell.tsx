import React from 'react';
import { Card } from './Card';

export interface LabShellProps {
  readonly title: string;
  readonly subtitle?: string;
  readonly category?: string;
  readonly visualizationSlot?: React.ReactNode;
  readonly codeSlot?: React.ReactNode;
  readonly timeTravelSlot?: React.ReactNode;
  readonly controlsSlot?: React.ReactNode;
  readonly inspectorSlot?: React.ReactNode;
  readonly knowledgeSlot?: React.ReactNode;
  readonly viewportSlot?: React.ReactNode;
}

export const LabShell: React.FC<LabShellProps> = ({
  title,
  subtitle,
  category = 'Data Structures & Algorithms',
  visualizationSlot,
  codeSlot,
  timeTravelSlot,
  controlsSlot,
  inspectorSlot,
  knowledgeSlot,
  viewportSlot,
}) => {
  const activeVizSlot = visualizationSlot || viewportSlot;

  return (
    <main role="main" className="lab-shell">
      <section aria-labelledby="topic-heading" className="lab-topic-header">
        <span className="lab-category-tag">{category}</span>
        <h1 id="topic-heading" className="lab-topic-title">
          {title}
        </h1>
        {subtitle && <p className="lab-topic-subtitle">{subtitle}</p>}
      </section>

      {codeSlot ? (
        <div className="lab-stage-grid">
          <section aria-label="Interactive Visualization Area" className="visualization-stage-panel">
            <div className="panel-header">
              <span className="panel-title">Interactive Laboratory Viewport</span>
            </div>
            <div className="panel-body">{activeVizSlot}</div>
          </section>

          <section aria-label="Synchronized Code Surface" className="code-stage-panel">
            {codeSlot}
          </section>
        </div>
      ) : (
        <div className="lab-stage-grid">
          <section aria-label="Interactive Visualization Area" className="viewport-panel">
            <div className="panel-header">
              <span className="panel-title">Interactive Laboratory Viewport</span>
            </div>
            <div className="panel-body">{activeVizSlot}</div>
          </section>
        </div>
      )}

      {timeTravelSlot && (
        <section aria-label="Time Travel Step Controller" className="time-travel-panel">
          {timeTravelSlot}
        </section>
      )}

      {(controlsSlot || inspectorSlot) && (
        <div className="lab-controls-grid">
          {controlsSlot && (
            <section aria-label="Interactive Operations" className="lab-controls-section">
              <div className="control-panel-heading">Interactive Operations</div>
              {controlsSlot}
            </section>
          )}
          {inspectorSlot && (
            <section aria-label="State & Metrics Inspector" className="lab-inspector-section">
              {inspectorSlot}
            </section>
          )}
        </div>
      )}

      {knowledgeSlot && (
        <section aria-label="Multi-Dimensional Pedagogical Knowledge" className="lab-knowledge-section">
          <Card title="Multi-Dimensional Knowledge">{knowledgeSlot}</Card>
        </section>
      )}
    </main>
  );
};
