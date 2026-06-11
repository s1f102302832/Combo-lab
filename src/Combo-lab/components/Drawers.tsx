import React, { useState } from 'react';
import { useComboLabStore } from '../store';
import { DrawerType } from '../types';

export function Drawers() {
  const { activeDrawer, setActiveDrawer } = useComboLabStore();

  if (!activeDrawer) return null;

  return (
    <div className="w-[340px] h-full bg-white border-l border-gray-200 flex flex-col shadow-lg flex-shrink-0 z-10 transition-transform">
      <div className="flex items-center justify-between p-4 border-b border-gray-200">
        <h2 className="text-lg font-bold text-gray-800">
          {activeDrawer === 'moves' && '技一覧'}
          {activeDrawer === 'selection' && '選択中'}
          {activeDrawer === 'combos' && '登録コンボ'}
          {activeDrawer === 'materials' && '素材BOX'}
        </h2>
        <button 
          onClick={() => setActiveDrawer(null)}
          className="w-8 h-8 flex items-center justify-center rounded hover:bg-gray-100 text-gray-500"
        >
          ✕
        </button>
      </div>
      <div className="flex-1 overflow-y-auto">
        {activeDrawer === 'moves' && <MovesDrawer />}
        {activeDrawer === 'selection' && <SelectionDrawer />}
        {activeDrawer === 'combos' && <CombosDrawer />}
        {activeDrawer === 'materials' && <MaterialsDrawer />}
      </div>
    </div>
  );
}

function MovesDrawer() {
  const { moves } = useComboLabStore();
  const [search, setSearch] = useState('');

  const filteredMoves = moves.filter(m => m.name.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="p-4 flex flex-col gap-4">
      <input 
        type="text" 
        placeholder="技名で検索" 
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
      <div className="flex gap-2 text-xs font-semibold overflow-x-auto pb-1">
        <span className="px-3 py-1 bg-blue-600 text-white rounded-full whitespace-nowrap cursor-pointer">通常技</span>
        <span className="px-3 py-1 bg-gray-100 text-gray-600 hover:bg-gray-200 rounded-full whitespace-nowrap cursor-pointer">必殺技</span>
        <span className="px-3 py-1 bg-gray-100 text-gray-600 hover:bg-gray-200 rounded-full whitespace-nowrap cursor-pointer">SA</span>
      </div>
      <div className="flex flex-col gap-2 mt-2">
        {filteredMoves.map(move => (
          <div 
            key={move.id} 
            draggable
            onDragStart={(e) => {
              e.dataTransfer.setData('application/combo-move', JSON.stringify(move));
            }}
            className="flex items-center justify-between p-3 border border-gray-200 rounded bg-white shadow-sm hover:shadow-md cursor-grab active:cursor-grabbing"
          >
            <div className="flex items-center gap-3">
              <span className="text-gray-400">⣿</span>
              <span className="font-bold text-gray-800">{move.name}</span>
            </div>
            {move.roles.length > 0 && (
              <span className="text-xs px-2 py-1 bg-green-50 text-green-700 rounded border border-green-200">
                {move.roles[0] === 'starter' ? '始動' : move.roles[0] === 'ender' ? '締め' : '中継'}
              </span>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

function SelectionDrawer() {
  const { selectedNodeId, rootNode, updateNode, registerCombo } = useComboLabStore();
  
  if (!selectedNodeId) {
    return <div className="p-4 text-gray-500 text-sm">ノードやルートが選択されていません。</div>;
  }

  // Simplified find node
  let selectedNode = null;
  const findN = (n: any) => {
    if (n.id === selectedNodeId) selectedNode = n;
    n.children.forEach(findN);
  };
  findN(rootNode);

  if (!selectedNode) return null;

  return (
    <div className="p-4 flex flex-col gap-5">
      <div>
        <label className="block text-xs font-bold text-gray-600 mb-1">表示名</label>
        <input 
          type="text" 
          value={selectedNode.label}
          onChange={(e) => updateNode(selectedNodeId, { label: e.target.value })}
          className="w-full px-3 py-2 border border-gray-300 rounded"
        />
      </div>
      <div>
        <label className="block text-xs font-bold text-gray-600 mb-1">役割</label>
        <select 
          value={selectedNode.role}
          onChange={(e) => updateNode(selectedNodeId, { role: e.target.value as any })}
          className="w-full px-3 py-2 border border-gray-300 rounded"
        >
          <option value="starter">始動</option>
          <option value="link">中継</option>
          <option value="ender">締め</option>
          <option value="situation">状況</option>
        </select>
      </div>
      <div className="pt-4 border-t border-gray-200">
        <button 
          onClick={() => {
            registerCombo(selectedNodeId);
            alert('ルートを登録しました');
          }}
          className="w-full py-2 bg-yellow-500 hover:bg-yellow-600 text-white font-bold rounded shadow"
        >
          ★ このルートを登録
        </button>
      </div>
    </div>
  );
}

function CombosDrawer() {
  const { routes, selectedRouteIds, toggleRouteSelection } = useComboLabStore();

  return (
    <div className="p-4 flex flex-col gap-4">
      <div className="flex gap-2 text-xs font-semibold flex-wrap">
        <span className="px-3 py-1 bg-gray-100 text-gray-600 rounded-full">画面端</span>
        <span className="px-3 py-1 bg-gray-100 text-gray-600 rounded-full">SA使用</span>
        <span className="px-3 py-1 bg-gray-100 text-gray-600 rounded-full">高難度</span>
      </div>
      <div className="flex flex-col gap-3">
        {routes.map(r => {
          const isSelected = selectedRouteIds.includes(r.id);
          return (
            <div 
              key={r.id} 
              className={`p-3 border rounded cursor-pointer transition-colors ${isSelected ? 'border-blue-500 bg-blue-50' : 'border-gray-200 hover:border-blue-300'}`}
              onClick={() => toggleRouteSelection(r.id)}
            >
              <div className="flex items-center gap-2 mb-2">
                <input 
                  type="checkbox" 
                  checked={isSelected}
                  readOnly
                  className="w-4 h-4 text-blue-600"
                />
                <span className="font-bold text-gray-800">{r.title}</span>
              </div>
              <div className="flex gap-2 text-xs">
                <span className="text-gray-500">ダメ: 4200</span>
                <span className="text-gray-500">ゲージ: 3</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function MaterialsDrawer() {
  return (
    <div className="p-4 flex flex-col gap-4">
      <button className="w-full py-2 border border-dashed border-gray-400 text-gray-600 rounded hover:bg-gray-50">
        + 素材を追加
      </button>
      <div className="p-3 border border-gray-200 rounded bg-gray-50">
        <p className="text-sm text-gray-600">動画や検証メモをここに蓄積できます。</p>
      </div>
    </div>
  );
}
