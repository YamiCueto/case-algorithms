import React from 'react';
import { AppHeader, LabShell, Button, Badge, Card } from '@/components/ui';

export const App: React.FC = () => {
  return (
    <div className="app-container">
      <AppHeader breadcrumbs={['Laboratory', 'Foundation', 'Design System Shell']} />

      <LabShell
        category="Laboratory Shell Foundation"
        title="Interactive Laboratory Workspace"
        subtitle="Responsive workspace ready for algorithm visualization engines, time-travel step controls, and multi-dimensional knowledge panels."
        viewportSlot={
          <div className="viewport-placeholder">
            <Badge variant="cyan" className="viewport-placeholder-badge">
              VIEWPORT CANVAS READY
            </Badge>
            <h2 className="viewport-placeholder-title">Visualization Engine Viewport</h2>
            <p className="viewport-placeholder-desc">
              This slot will host SVG / Canvas renderers for Array, Stack, Queue, Trees, and Graph
              data structures with deterministic step frames.
            </p>
          </div>
        }
        controlsSlot={
          <div className="control-group">
            <div className="control-group">
              <span className="control-label">Sandbox Actions</span>
              <div className="control-actions">
                <Button variant="primary" size="sm">
                  Primary Action
                </Button>
                <Button variant="secondary" size="sm">
                  Secondary
                </Button>
                <Button variant="outline" size="sm">
                  Reset
                </Button>
              </div>
            </div>

            <div className="control-group">
              <span className="control-label">Time-Travel Controls</span>
              <div className="control-actions">
                <Button variant="outline" size="sm" aria-label="First step">
                  |&lt;
                </Button>
                <Button variant="outline" size="sm" aria-label="Step back">
                  &lt; Step
                </Button>
                <Button variant="primary" size="sm" aria-label="Play execution">
                  Play
                </Button>
                <Button variant="outline" size="sm" aria-label="Step forward">
                  Step &gt;
                </Button>
              </div>
            </div>

            <Card title="State Inspector">
              <div className="inspector-list">
                <div>
                  <span className="inspector-label">status: </span>
                  <span className="inspector-val-idle">idle</span>
                </div>
                <div>
                  <span className="inspector-label">stepIndex: </span>
                  <span className="inspector-val-index">0</span>
                </div>
                <div>
                  <span className="inspector-label">totalSteps: </span>
                  <span className="inspector-val-total">0</span>
                </div>
              </div>
            </Card>
          </div>
        }
        knowledgeSlot={
          <div className="knowledge-grid">
            <div className="knowledge-card">
              <div className="knowledge-card-title-cyan">01. Discover</div>
              <div className="knowledge-card-desc">Interactive observation</div>
            </div>
            <div className="knowledge-card">
              <div className="knowledge-card-title-emerald">04. Explain</div>
              <div className="knowledge-card-desc">Formal complexity O(n)</div>
            </div>
            <div className="knowledge-card">
              <div className="knowledge-card-title-amber">07. Code</div>
              <div className="knowledge-card-desc">TypeScript implementation</div>
            </div>
            <div className="knowledge-card">
              <div className="knowledge-card-title-rose">10. Challenge</div>
              <div className="knowledge-card-desc">Automated test validation</div>
            </div>
          </div>
        }
      />
    </div>
  );
};

export default App;
