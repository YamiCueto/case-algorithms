import React from 'react';
import { AppHeader } from '@/components/ui';
import { ArrayLab } from '@/modules';

export const App: React.FC = () => {
  return (
    <div className="app-container">
      <AppHeader breadcrumbs={['Laboratory', 'Data Structures', 'Array & Bubble Sort']} />
      <ArrayLab />
    </div>
  );
};

export default App;
