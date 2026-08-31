import React from 'react';
import { Card } from './Card';
import { Button } from './Button';
import { CodeViewer } from '@/components/code-viewer';

export interface PedagogicalPhaseItem {
  readonly id: string;
  readonly name: string;
  readonly title: string;
  readonly content: string;
}

export interface PedagogicalKnowledgePanelProps {
  readonly phases: readonly PedagogicalPhaseItem[];
  readonly activePhaseIndex: number;
  readonly onPhaseSelect: (index: number) => void;
  readonly pseudocodeActiveLine?: number;
  readonly typescriptActiveLine?: number;
  readonly className?: string;
}

export const PedagogicalKnowledgePanel: React.FC<PedagogicalKnowledgePanelProps> = ({
  phases,
  activePhaseIndex,
  onPhaseSelect,
  pseudocodeActiveLine,
  typescriptActiveLine,
  className = '',
}) => {
  const activePhase = phases[activePhaseIndex] || phases[0];

  return (
    <div className={`control-group ${className}`.trim()}>
      <div className="pedagogical-tabs-container">
        {phases.map((phase, idx) => (
          <Button
            key={phase.id}
            variant={activePhaseIndex === idx ? 'primary' : 'outline'}
            size="sm"
            onClick={() => onPhaseSelect(idx)}
          >
            {phase.name}
          </Button>
        ))}
      </div>

      <Card title={activePhase?.title}>
        {activePhase?.id === '06' ? (
          <CodeViewer
            code={activePhase.content}
            language="pseudocode"
            activeLine={pseudocodeActiveLine}
          />
        ) : activePhase?.id === '07' ? (
          <CodeViewer
            code={activePhase.content}
            language="typescript"
            activeLine={typescriptActiveLine}
          />
        ) : (
          <p className="phase-content-text">{activePhase?.content}</p>
        )}
      </Card>
    </div>
  );
};
