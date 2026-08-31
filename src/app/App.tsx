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
          <div
            style={{
              flex: 1,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              minHeight: '280px',
              padding: 'var(--space-6)',
              textAlign: 'center',
              background: 'radial-gradient(circle at center, rgba(6, 182, 212, 0.05) 0%, transparent 70%)',
            }}
          >
            <Badge variant="cyan" style={{ marginBottom: 'var(--space-3)' }}>
              VIEWPORT CANVAS READY
            </Badge>
            <h2
              style={{
                fontSize: '20px',
                fontWeight: 600,
                color: 'var(--text-primary)',
                marginBottom: 'var(--space-2)',
              }}
            >
              Visualization Engine Viewport
            </h2>
            <p
              style={{
                fontSize: '14px',
                color: 'var(--text-secondary)',
                maxWidth: '480px',
                lineHeight: 1.5,
              }}
            >
              This slot will host SVG / Canvas renderers for Array, Stack, Queue, Trees, and Graph
              data structures with deterministic step frames.
            </p>
          </div>
        }
        controlsSlot={
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
            <div>
              <span
                style={{
                  fontSize: '11px',
                  fontFamily: 'var(--font-mono)',
                  color: 'var(--text-muted)',
                  textTransform: 'uppercase',
                }}
              >
                Sandbox Actions
              </span>
              <div
                style={{
                  display: 'flex',
                  gap: 'var(--space-2)',
                  flexWrap: 'wrap',
                  marginTop: 'var(--space-2)',
                }}
              >
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

            <div>
              <span
                style={{
                  fontSize: '11px',
                  fontFamily: 'var(--font-mono)',
                  color: 'var(--text-muted)',
                  textTransform: 'uppercase',
                }}
              >
                Time-Travel Controls
              </span>
              <div
                style={{
                  display: 'flex',
                  gap: 'var(--space-2)',
                  marginTop: 'var(--space-2)',
                }}
              >
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

            <Card
              title="State Inspector"
              style={{
                backgroundColor: 'var(--bg-surface-secondary)',
                boxShadow: 'none',
              }}
            >
              <div
                style={{
                  fontSize: '12px',
                  fontFamily: 'var(--font-mono)',
                  color: 'var(--text-secondary)',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 'var(--space-1)',
                }}
              >
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
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
              gap: 'var(--space-3)',
              fontFamily: 'var(--font-mono)',
              fontSize: '12px',
            }}
          >
            <div
              style={{
                padding: 'var(--space-3)',
                backgroundColor: 'var(--bg-surface-secondary)',
                borderRadius: 'var(--radius-md)',
                border: '1px solid var(--border-subtle)',
              }}
            >
              <div style={{ color: 'var(--accent-cyan)', fontWeight: 600 }}>01. Discover</div>
              <div style={{ color: 'var(--text-muted)', marginTop: '4px' }}>
                Interactive observation
              </div>
            </div>
            <div
              style={{
                padding: 'var(--space-3)',
                backgroundColor: 'var(--bg-surface-secondary)',
                borderRadius: 'var(--radius-md)',
                border: '1px solid var(--border-subtle)',
              }}
            >
              <div style={{ color: 'var(--accent-emerald)', fontWeight: 600 }}>04. Explain</div>
              <div style={{ color: 'var(--text-muted)', marginTop: '4px' }}>
                Formal complexity O(n)
              </div>
            </div>
            <div
              style={{
                padding: 'var(--space-3)',
                backgroundColor: 'var(--bg-surface-secondary)',
                borderRadius: 'var(--radius-md)',
                border: '1px solid var(--border-subtle)',
              }}
            >
              <div style={{ color: 'var(--accent-amber)', fontWeight: 600 }}>07. Code</div>
              <div style={{ color: 'var(--text-muted)', marginTop: '4px' }}>
                TypeScript implementation
              </div>
            </div>
            <div
              style={{
                padding: 'var(--space-3)',
                backgroundColor: 'var(--bg-surface-secondary)',
                borderRadius: 'var(--radius-md)',
                border: '1px solid var(--border-subtle)',
              }}
            >
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
