import React, { useState } from 'react';
import { AppHeader, Button } from '@/components/ui';
import { ArrayLab, StackLab, QueueLab } from '@/modules';

export const App: React.FC = () => {
  const [activeLab, setActiveLab] = useState<'array' | 'stack' | 'queue'>('queue');

  const getBreadcrumb = () => {
    switch (activeLab) {
      case 'array':
        return 'Array & Bubble Sort';
      case 'stack':
        return 'Stack & LIFO Principle';
      case 'queue':
        return 'Queue & FIFO Principle';
    }
  };

  return (
    <div className="app-container">
      <AppHeader breadcrumbs={['Laboratory', 'Data Structures', getBreadcrumb()]} />
      <div className="lab-selector-bar">
        <span className="control-label">Select Laboratory:</span>
        <Button
          variant={activeLab === 'array' ? 'primary' : 'outline'}
          size="sm"
          onClick={() => setActiveLab('array')}
          aria-label="Switch to Array Laboratory"
        >
          Array & Bubble Sort
        </Button>
        <Button
          variant={activeLab === 'stack' ? 'primary' : 'outline'}
          size="sm"
          onClick={() => setActiveLab('stack')}
          aria-label="Switch to Stack Laboratory"
        >
          Stack (LIFO)
        </Button>
        <Button
          variant={activeLab === 'queue' ? 'primary' : 'outline'}
          size="sm"
          onClick={() => setActiveLab('queue')}
          aria-label="Switch to Queue Laboratory"
        >
          Queue (FIFO)
        </Button>
      </div>
      {activeLab === 'array' ? (
        <ArrayLab />
      ) : activeLab === 'stack' ? (
        <StackLab />
      ) : (
        <QueueLab />
      )}
    </div>
  );
};

export default App;
