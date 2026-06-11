import React from 'react';
import { ComboNode, Move } from '../types';

interface ComboNodeCardProps {
  node: ComboNode;
  isSelected: boolean;
  isDimmed: boolean;
  onClick: () => void;
  onDropMove: (move: Move) => void;
}

export function ComboNodeCard({ node, isSelected, isDimmed, onClick, onDropMove }: ComboNodeCardProps) {
  const isEndNode = node.isComboEnd;
  const isSituation = node.role === 'situation';

  let borderClass = 'border-gray-300';
  let bgClass = 'bg-white';
  
  if (isSituation) {
    borderClass = 'border-blue-500 border-2';
  } else if (isEndNode) {
    borderClass = 'border-yellow-400 border-2';
    bgClass = 'bg-yellow-50';
  }

  if (isSelected) {
    borderClass = 'border-blue-500 border-2 shadow-md';
    bgClass = 'bg-blue-50';
  }

  return (
    <div
      id={`node-${node.id}`}
      className={`relative flex flex-col items-center justify-center w-24 h-24 rounded-full transition-all cursor-pointer ${bgClass} ${borderClass} ${isDimmed ? 'opacity-30' : 'opacity-100'}`}
      onClick={(e) => {
        e.stopPropagation();
        onClick();
      }}
      onDragOver={(e) => {
        e.preventDefault();
        e.dataTransfer.dropEffect = 'copy';
      }}
      onDrop={(e) => {
        e.preventDefault();
        try {
          const moveData = e.dataTransfer.getData('application/combo-move');
          if (moveData) {
            onDropMove(JSON.parse(moveData));
          }
        } catch(err) {
          console.error(err);
        }
      }}
    >
      <div className="font-bold text-gray-800 text-lg z-10">{node.label}</div>
      <div className="text-xs text-gray-500 z-10 mt-1">
        {node.role === 'starter' ? '始動' : node.role === 'ender' ? '締め' : node.role === 'situation' ? '状況' : '中継'}
      </div>
      
      {isEndNode && (
        <div className="absolute -top-1 -right-1 text-yellow-500 text-xl" style={{ filter: 'drop-shadow(0 2px 2px rgba(0,0,0,0.2))' }}>
          ★
        </div>
      )}
    </div>
  );
}
