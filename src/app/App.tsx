import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { AppHeader, Button } from '@/components/ui';
import { ArrayLab, StackLab, QueueLab, LinkedListLab } from '@/modules';

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
    <div className="app-container">
      <AppHeader
        breadcrumbs={[
          t('navigation:breadcrumbsRoot'),
          t('navigation:breadcrumbsSection'),
          getBreadcrumb(),
        ]}
      />
      <div className="lab-selector-bar">
        <span className="control-label">{t('navigation:selectLabLabel')}</span>
        <Button
          variant={activeLab === 'array' ? 'primary' : 'outline'}
          size="sm"
          onClick={() => setActiveLab('array')}
          aria-label={t('navigation:labArrayAria')}
        >
          {t('navigation:labArrayTitle')}
        </Button>
        <Button
          variant={activeLab === 'stack' ? 'primary' : 'outline'}
          size="sm"
          onClick={() => setActiveLab('stack')}
          aria-label={t('navigation:labStackAria')}
        >
          {t('navigation:labStackTitle')}
        </Button>
        <Button
          variant={activeLab === 'queue' ? 'primary' : 'outline'}
          size="sm"
          onClick={() => setActiveLab('queue')}
          aria-label={t('navigation:labQueueAria')}
        >
          {t('navigation:labQueueTitle')}
        </Button>
        <Button
          variant={activeLab === 'linked-list' ? 'primary' : 'outline'}
          size="sm"
          onClick={() => setActiveLab('linked-list')}
          aria-label={t('navigation:labLinkedListAria')}
        >
          {t('navigation:labLinkedListTitle')}
        </Button>
      </div>
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

