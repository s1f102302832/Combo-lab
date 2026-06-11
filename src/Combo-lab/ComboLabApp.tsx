import React from 'react';
import { RibbonHeader } from './components/RibbonHeader';
import { Canvas } from './components/Canvas';
import { Drawers } from './components/Drawers';

interface ComboLabAppProps {
  onGoBack?: () => void;
}

export function ComboLabApp({ onGoBack }: ComboLabAppProps) {
  return (
    <div className="flex flex-col w-full h-screen bg-gray-100 overflow-hidden font-sans text-gray-800">
      <RibbonHeader onGoBack={onGoBack} />
      <div className="flex flex-1 overflow-hidden relative">
        <Canvas />
        <Drawers />
      </div>
    </div>
  );
}
