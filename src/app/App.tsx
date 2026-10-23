import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { AppHeader, Button } from '@/components/ui';
import { ArrayLab, StackLab, QueueLab, LinkedListLab } from '@/modules';
import { LabIcon } from '@/components/ui/LabIcon';

const labs = [
  { id: 'array', key: 'Array', number: '01' },
  { id: 'stack', key: 'Stack', number: '02' },
  { id: 'queue', key: 'Queue', number: '03' },
  { id: 'linked-list', key: 'LinkedList', number: '04' },
] as const;

export const App: React.FC = () => {
  const { t } = useTranslation(['navigation']);
  const [activeLab, setActiveLab] = useState<'array' | 'stack' | 'queue' | 'linked-list'>('linked-list');

  const getBreadcrumb = () => {
    switch (activeLab) {
      case 'array':
        return t('navigation:labArrayBreadcrumb');
      case 'stack':
        return t('navigation:labStackBreadcrumb');
      case 'queue':
        return t('navigation:labQueueBreadcrumb');
      case 'linked-list':
        return t('navigation:labLinkedListBreadcrumb');
    }
  };

  return (
    <div className="app-container" data-lab={activeLab}>
      <a href="#workspace" className="skip-link">{t('navigation:skipToWorkspace')}</a>
      <AppHeader
        breadcrumbs={[
          t('navigation:breadcrumbsRoot'),
          t('navigation:breadcrumbsSection'),
          getBreadcrumb(),
        ]}
      />
      <nav className="lab-selector-bar" aria-label={t('navigation:selectLabLabel')}>
        <span className="control-label">{t('navigation:selectLabLabel')}</span>
        <div className="lab-navigation-items">
          {labs.map(lab => (
            <Button key={lab.id} variant={activeLab === lab.id ? 'primary' : 'ghost'} className="lab-nav-item"
              onClick={() => setActiveLab(lab.id)} aria-label={t(`navigation:lab${lab.key}Aria`)}
              aria-current={activeLab === lab.id ? 'page' : undefined}>
              <span className="lab-nav-icon"><LabIcon kind={lab.id} /></span>
              <span className="lab-nav-copy"><span>{t(`navigation:lab${lab.key}Title`)}</span><small>{t(`navigation:lab${lab.key}Hint`)}</small></span>
              <span className="lab-nav-number">{lab.number}</span>
            </Button>
          ))}
        </div>
        <div className="sidebar-note"><span className="sidebar-note-symbol" aria-hidden="true">↳</span><strong>{t('navigation:learnByDoing')}</strong><p>{t('navigation:learnByDoingHint')}</p><span className="sidebar-footer">CASE / ALGORITHMS</span></div>
      </nav>
      {activeLab === 'array' ? (
        <ArrayLab />
      ) : activeLab === 'stack' ? (
        <StackLab />
      ) : activeLab === 'queue' ? (
        <QueueLab />
      ) : (
        <LinkedListLab />
      )}
    </div>
  );
};

export default App;

