import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';

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
  const [focused, setFocused] = useState(false);
  const activeVizSlot = visualizationSlot || viewportSlot;
  const displayCategory = category || t('common:defaultCategory');

  return (
    <main id="workspace" tabIndex={-1} role="main" className={`lab-shell${focused ? ' lab-focus-mode' : ''}`}>
      <section aria-labelledby="topic-heading" className="lab-topic-header">
        <span className="lab-category-tag">{displayCategory}</span>
        <h1 id="topic-heading" className="lab-topic-title">
          {title}
        </h1>
        {subtitle && <p className="lab-topic-subtitle">{subtitle}</p>}
        <div className="workspace-toolbar"><span className="workspace-instruction">{t('common:workspaceHint')}</span><button type="button" className="btn btn-outline focus-toggle" aria-pressed={focused} onClick={() => setFocused(!focused)}><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden="true"><path d="M8 3H3v5m13-5h5v5M3 16v5h5m13-5v5h-5" /></svg>{t(focused ? 'common:exitFocus' : 'common:focusMode')}</button></div>
      </section>

      <div className="lab-stage-grid">
        <div className="lab-primary-column">
          <section aria-label={t('common:viewportAria')} className="visualization-stage-panel">
            <div className="panel-header">
              <span className="panel-title"><span className="panel-index">01</span>{t('common:viewportTitle')}</span><span className="live-indicator" aria-hidden="true" />
            </div>
            <div className="panel-body">{activeVizSlot}</div>
            {timeTravelSlot && (
              <section aria-label={t('common:timeTravelAria')} className="time-travel-panel stage-playback-dock">
                {timeTravelSlot}
              </section>
            )}
          </section>

          {(controlsSlot || inspectorSlot) && (
            <div className="lab-interactive-workspace lab-controls-grid">
              {controlsSlot && (
                <section aria-label={t('common:operationsAria')} className="lab-controls-section">
                  <div className="control-panel-heading"><span className="panel-index">02</span>{t('common:operationsHeading')}</div>
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
        </div>

        <div className="lab-secondary-column">
          {codeSlot && (
            <section aria-label={t('common:codeStageAria')} className="code-stage-panel">
              {codeSlot}
            </section>
          )}

          {knowledgeSlot && (
            <section aria-label={t('common:knowledgeAria')} className="lab-knowledge-section">
              <div className="knowledge-heading"><div><span className="lab-category-tag">{t('common:learningPath')}</span><h2>{t('common:knowledgeTitle')}</h2></div><span>{t('common:learningHint')}</span></div>{knowledgeSlot}
            </section>
          )}
        </div>
      </div>
    </main>
  );
};

