import React from 'react';
import { useComboLabStore } from '../store';
import { DrawerType } from '../types';

export function RibbonHeader({ onGoBack }: { onGoBack?: () => void }) {
  const { activeDrawer, setActiveDrawer, setViewMode } = useComboLabStore();

  const handleToggle = (drawer: DrawerType) => {
    setActiveDrawer(activeDrawer === drawer ? null : drawer);
  };

  const btnClass = (drawer: DrawerType) => {
    const base = "flex flex-col items-center justify-center w-20 h-16 rounded-md transition-colors text-xs gap-1";
    return activeDrawer === drawer 
      ? `${base} bg-blue-600 text-white font-bold`
      : `${base} text-gray-700 hover:bg-gray-100`;
  };

  return (
    <header className="flex items-center px-4 h-24 bg-white border-b border-gray-200 shadow-sm flex-shrink-0 gap-2">
      <div className="flex items-center border-r border-gray-200 pr-4">
        <button className="flex flex-col items-center justify-center w-16 h-16 rounded-md hover:bg-gray-100 text-gray-700 text-xs gap-1">
          <span className="text-xl">💾</span>
          <span>保存</span>
        </button>
      </div>

      <div className="flex items-center gap-1">
        <button onClick={onGoBack} className="flex flex-col items-center justify-center w-16 h-16 rounded-md hover:bg-gray-100 text-gray-700 text-xs gap-1">
          <span className="text-xl">←</span>
          <span>戻る</span>
        </button>
        <button className="flex flex-col items-center justify-center w-16 h-16 rounded-md hover:bg-gray-100 text-gray-300 text-xs gap-1 cursor-not-allowed">
          <span className="text-xl">→</span>
          <span>進む</span>
        </button>
      </div>

      <div className="h-10 w-px bg-gray-200 mx-2" />

      <div className="flex items-center gap-1">
        <button onClick={() => handleToggle('moves')} className={btnClass('moves')}>
          <span className="text-xl">📋</span>
          <span>技一覧</span>
        </button>
        <button onClick={() => handleToggle('selection')} className={btnClass('selection')}>
          <span className="text-xl">🎯</span>
          <span>選択中</span>
        </button>
        <button onClick={() => handleToggle('combos')} className={btnClass('combos')}>
          <span className="text-xl">⭐</span>
          <span>登録コンボ</span>
        </button>
        <button onClick={() => handleToggle('materials')} className={btnClass('materials')}>
          <span className="text-xl">📦</span>
          <span>素材BOX</span>
        </button>
      </div>

      <div className="h-10 w-px bg-gray-200 mx-2" />

      <div className="flex items-center gap-1">
        <button 
          onClick={() => setViewMode('all')} 
          className="flex flex-col items-center justify-center w-20 h-16 rounded-md hover:bg-gray-100 text-gray-700 text-xs gap-1"
        >
          <span className="text-xl">👁️</span>
          <span>表示切替</span>
        </button>
        <button className="flex flex-col items-center justify-center w-24 h-16 rounded-md hover:bg-gray-100 text-gray-700 text-xs gap-1">
          <span className="text-xl">🌐</span>
          <span>公開プレビュー</span>
        </button>
      </div>
    </header>
  );
}
