import React, { useId, useRef } from 'react';
import { useTranslation } from 'react-i18next';
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
  const { t } = useTranslation('common');
  const panelId = useId();
  const tabsRef = useRef<HTMLDivElement>(null);
  const selectAdjacent = (event: React.KeyboardEvent, index: number) => {
    let next = index;
    if (event.key === 'ArrowDown' || event.key === 'ArrowRight') next = (index + 1) % phases.length;
    else if (event.key === 'ArrowUp' || event.key === 'ArrowLeft') next = (index - 1 + phases.length) % phases.length;
    else if (event.key === 'Home') next = 0;
    else if (event.key === 'End') next = phases.length - 1;
    else return;
    event.preventDefault();
    event.stopPropagation();
    onPhaseSelect(next);
    tabsRef.current?.querySelectorAll<HTMLButtonElement>('[role="tab"]')[next]?.focus();
  };

  return (
    <div className={`learning-layout ${className}`.trim()}>
      <div ref={tabsRef} className="pedagogical-tabs-container" role="tablist" aria-label={t('learningPath')}>
        {phases.map((phase, idx) => (
          <Button
            key={phase.id}
            variant={activePhaseIndex === idx ? 'primary' : 'outline'}
            size="sm"
            role="tab"
            id={`${panelId}-tab-${idx}`}
            aria-controls={`${panelId}-content`}
            aria-selected={activePhaseIndex === idx}
            tabIndex={activePhaseIndex === idx ? 0 : -1}
            onKeyDown={(event) => selectAdjacent(event, idx)}
            onClick={() => onPhaseSelect(idx)}
          >
            {phase.name}
          </Button>
        ))}
      </div>

      <div className="learning-content" id={`${panelId}-content`} role="tabpanel" aria-labelledby={`${panelId}-tab-${activePhaseIndex}`} tabIndex={0}>
      <div className="learning-progress"><span>{t('learningStep', { current: activePhaseIndex + 1, total: phases.length })}</span><div aria-hidden="true">{phases.map((phase, idx) => <i key={phase.id} className={idx === activePhaseIndex ? 'active' : ''} />)}</div></div>
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
      <div className="learning-pagination"><Button variant="ghost" disabled={activePhaseIndex === 0} onClick={() => onPhaseSelect(activePhaseIndex - 1)}>{t('previousConcept')}</Button><Button variant="outline" disabled={activePhaseIndex >= phases.length - 1} onClick={() => onPhaseSelect(activePhaseIndex + 1)}>{t('nextConcept')} <span aria-hidden="true">→</span></Button></div>
      </div>
    </div>
  );
};
