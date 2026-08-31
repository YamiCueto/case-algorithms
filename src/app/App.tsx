import React from 'react';

export const App: React.FC = () => {
  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        backgroundColor: 'var(--bg-canvas)',
        color: 'var(--text-primary)',
      }}
    >
      <header
        style={{
          height: '64px',
          borderBottom: '1px solid var(--border-default)',
          backgroundColor: 'var(--bg-surface-primary)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '0 var(--space-6)',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)' }}>
          <div
            style={{
              width: '32px',
              height: '32px',
              borderRadius: 'var(--radius-md)',
              backgroundColor: 'var(--bg-surface-secondary)',
              border: '1px solid var(--accent-cyan)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontWeight: 700,
              fontSize: '14px',
              color: 'var(--accent-cyan)',
              fontFamily: 'var(--font-mono)',
            }}
          >
            CA
          </div>
          <div>
            <h1 style={{ fontSize: '16px', fontWeight: 600, letterSpacing: '-0.02em' }}>
              CASE Algorithms
            </h1>
            <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
              Interactive Algorithm Laboratory
            </span>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-4)' }}>
          <span
            style={{
              fontSize: '12px',
              fontFamily: 'var(--font-mono)',
              padding: 'var(--space-1) var(--space-2)',
              borderRadius: 'var(--radius-sm)',
              backgroundColor: 'rgba(16, 185, 129, 0.1)',
              color: 'var(--accent-emerald)',
              border: '1px solid rgba(16, 185, 129, 0.3)',
            }}
          >
            Milestone v0.1 — First Learning Experience
          </span>
        </div>
      </header>

      <main
        style={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          padding: 'var(--space-8)',
          textAlign: 'center',
        }}
      >
        <div
          style={{
            maxWidth: '640px',
            padding: 'var(--space-8)',
            backgroundColor: 'var(--bg-surface-primary)',
            borderRadius: 'var(--radius-lg)',
            border: '1px solid var(--border-default)',
            boxShadow: 'var(--shadow-lg)',
          }}
        >
          <div
            style={{
              display: 'inline-block',
              fontSize: '12px',
              fontFamily: 'var(--font-mono)',
              color: 'var(--accent-cyan)',
              marginBottom: 'var(--space-3)',
              textTransform: 'uppercase',
              letterSpacing: '0.05em',
            }}
          >
            Understand before memorizing
          </div>
          <h2
            style={{
              fontSize: '24px',
              fontWeight: 700,
              marginBottom: 'var(--space-3)',
              letterSpacing: '-0.02em',
            }}
          >
            Laboratory Scaffolding Active
          </h2>
          <p
            style={{
              fontSize: '15px',
              color: 'var(--text-secondary)',
              lineHeight: 1.6,
              marginBottom: 'var(--space-6)',
            }}
          >
            Platform foundations initialized with React, TypeScript strict mode, Vitest, CSS design
            tokens, and decoupled architecture.
          </p>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(3, 1fr)',
              gap: 'var(--space-3)',
              textAlign: 'left',
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
              <div style={{ color: 'var(--text-muted)' }}>ENGINE</div>
              <div style={{ color: 'var(--accent-cyan)', marginTop: '4px' }}>Pure TypeScript</div>
            </div>
            <div
              style={{
                padding: 'var(--space-3)',
                backgroundColor: 'var(--bg-surface-secondary)',
                borderRadius: 'var(--radius-md)',
                border: '1px solid var(--border-subtle)',
              }}
            >
              <div style={{ color: 'var(--text-muted)' }}>TESTS</div>
              <div style={{ color: 'var(--accent-emerald)', marginTop: '4px' }}>Vitest + JSDOM</div>
            </div>
            <div
              style={{
                padding: 'var(--space-3)',
                backgroundColor: 'var(--bg-surface-secondary)',
                borderRadius: 'var(--radius-md)',
                border: '1px solid var(--border-subtle)',
              }}
            >
              <div style={{ color: 'var(--text-muted)' }}>A11Y</div>
              <div style={{ color: 'var(--accent-amber)', marginTop: '4px' }}>ARIA Live Ready</div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default App;
