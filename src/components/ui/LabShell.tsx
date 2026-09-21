import React from 'react';
import { useTranslation } from 'react-i18next';
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
  category,
  visualizationSlot,
  codeSlot,
  timeTravelSlot,
  controlsSlot,
  inspectorSlot,
  knowledgeSlot,
  viewportSlot,
}) => {
  const { t } = useTranslation(['common']);
  const activeVizSlot = visualizationSlot || viewportSlot;
  const displayCategory = category || t('common:defaultCategory');

  return (
    <main role="main" className="lab-shell">
      <section aria-labelledby="topic-heading" className="lab-topic-header">
        <span className="lab-category-tag">{displayCategory}</span>
        <h1 id="topic-heading" className="lab-topic-title">
          {title}
        </h1>
        {subtitle && <p className="lab-topic-subtitle">{subtitle}</p>}
      </section>

      <div className="lab-stage-grid">
        <div className="lab-primary-column">
          <section aria-label={t('common:viewportAria')} className="visualization-stage-panel">
            <div className="panel-header">
              <span className="panel-title">{t('common:viewportTitle')}</span>
            </div>
            <div className="panel-body">{activeVizSlot}</div>
          </section>

          {(controlsSlot || inspectorSlot) && (
            <div className="lab-interactive-workspace lab-controls-grid">
              {controlsSlot && (
                <section aria-label={t('common:operationsAria')} className="lab-controls-section">
                  <div className="control-panel-heading">{t('common:operationsHeading')}</div>
                  {controlsSlot}
                </section>
              )}
              {inspectorSlot && (
                <section aria-label={t('common:inspectorAria')} className="lab-inspector-section">
                  {inspectorSlot}
                </section>
              )}
            </div>
          )}

          {timeTravelSlot && (
            <section aria-label={t('common:timeTravelAria')} className="time-travel-panel">
              {timeTravelSlot}
            </section>
          )}
        </div>

        <div className="lab-secondary-column">
          {codeSlot && (
            <section aria-label={t('common:codeStageAria')} className="code-stage-panel">
              {codeSlot}
            </section>
          )}

          {knowledgeSlot && (
            <section aria-label={t('common:knowledgeAria')} className="lab-knowledge-section">
              <Card title={t('common:knowledgeTitle')}>{knowledgeSlot}</Card>
            </section>
          )}
        </div>
      </div>
    </main>
  );
};

