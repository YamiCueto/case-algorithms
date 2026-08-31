import React, { useState } from 'react';
import { AppHeader, Button } from '@/components/ui';
import { ArrayLab, StackLab } from '@/modules';

export const App: React.FC = () => {
  const [activeLab, setActiveLab] = useState<'array' | 'stack'>('stack');

  return (
    <div className="app-container">
      <AppHeader
        breadcrumbs={[
          'Laboratory',
          'Data Structures',
          activeLab === 'array' ? 'Array & Bubble Sort' : 'Stack & LIFO Principle',
        ]}
      />
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
      </div>
      {activeLab === 'array' ? <ArrayLab /> : <StackLab />}
    </div>
  );
};

export default App;
