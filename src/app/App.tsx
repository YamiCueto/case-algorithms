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
            <Badge variant="cyan" style={{ marginBottom: 'var(--space-3)' }}>
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
                  <span style={{ color: 'var(--text-muted)' }}>status: </span>
                  <span style={{ color: 'var(--accent-emerald)' }}>idle</span>
                </div>
                <div>
                  <span style={{ color: 'var(--text-muted)' }}>stepIndex: </span>
                  <span style={{ color: 'var(--accent-cyan)' }}>0</span>
                </div>
                <div>
                  <span style={{ color: 'var(--text-muted)' }}>totalSteps: </span>
                  <span style={{ color: 'var(--text-primary)' }}>0</span>
                </div>
              </div>
            </Card>
          </div>
        }
        knowledgeSlot={
          <div className="knowledge-grid">
            <div className="knowledge-card">
              <div style={{ color: 'var(--accent-cyan)', fontWeight: 600 }}>01. Discover</div>
              <div style={{ color: 'var(--text-muted)', marginTop: '4px' }}>
                Interactive observation
              </div>
            </div>
            <div className="knowledge-card">
              <div style={{ color: 'var(--accent-emerald)', fontWeight: 600 }}>04. Explain</div>
              <div style={{ color: 'var(--text-muted)', marginTop: '4px' }}>
                Formal complexity O(n)
              </div>
            </div>
            <div className="knowledge-card">
              <div className="knowledge-card-title" style={{ color: 'var(--accent-amber)', fontWeight: 600 }}>
                07. Code
              </div>
              <div style={{ color: 'var(--text-muted)', marginTop: '4px' }}>
                TypeScript implementation
              </div>
            </div>
            <div className="knowledge-card">
              <div style={{ color: 'var(--accent-rose)', fontWeight: 600 }}>10. Challenge</div>
              <div style={{ color: 'var(--text-muted)', marginTop: '4px' }}>
                Automated test validation
              </div>
            </div>
          </div>
        }
      />
    </div>
  );
};

export default App;
