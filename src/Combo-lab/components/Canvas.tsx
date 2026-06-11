import React, { useRef, useState, useEffect } from 'react';
import { useComboLabStore } from '../store';
import { ComboNodeCard } from './ComboNodeCard';
import { ComboNode, ComboRoute, Move } from '../types';

export function Canvas() {
  const { rootNode, selectedNodeId, selectNode, viewMode, selectedRouteIds, routes, addNode } = useComboLabStore();
  const [scale, setScale] = useState(1);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const dragStartRef = useRef({ x: 0, y: 0, posX: 0, posY: 0 });
  const canvasRef = useRef<HTMLDivElement>(null);

  // Pan
  const handleMouseDown = (e: React.MouseEvent) => {
    if (e.target !== canvasRef.current && (e.target as Element).tagName !== 'svg') return;
    setIsDragging(true);
    dragStartRef.current = {
      x: e.clientX,
      y: e.clientY,
      posX: position.x,
      posY: position.y
    };
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    const dx = e.clientX - dragStartRef.current.x;
    const dy = e.clientY - dragStartRef.current.y;
    setPosition({
      x: dragStartRef.current.posX + dx,
      y: dragStartRef.current.posY + dy
    });
  };

  const handleMouseUp = () => setIsDragging(false);

  // Zoom
  const handleWheel = (e: React.WheelEvent) => {
    e.preventDefault();
    const zoomSensitivity = 0.001;
    const newScale = Math.max(0.2, Math.min(2, scale - e.deltaY * zoomSensitivity));
    setScale(newScale);
  };

  // Build tree columns for rendering
  const columns: { parentId: string | null; nodes: ComboNode[]; depth: number }[] = [];
  
  // We need to traverse the tree layer by layer.
  // Given we only have one root right now, columns will be built based on depth.
  const buildColumns = (nodes: ComboNode[], depth: number) => {
    if (nodes.length === 0) return;
    if (!columns[depth]) {
      columns[depth] = { parentId: null, nodes: [], depth };
    }
    columns[depth].nodes.push(...nodes);
    nodes.forEach(n => {
      if (n.children.length > 0) {
        buildColumns(n.children, depth + 1);
      }
    });
  };
  buildColumns([rootNode], 0);

  // Flatten active route nodes for viewMode filtering
  const getActiveRouteNodes = () => {
    if (viewMode === 'all') return null; // null means no dimming
    const activeRouteIds = viewMode === 'selected_route' 
      ? selectedRouteIds 
      : routes.filter(r => r.published).map(r => r.id);
    
    if (activeRouteIds.length === 0) return [];

    const nodeIds = new Set<string>();
    activeRouteIds.forEach(id => {
      const r = routes.find(rt => rt.id === id);
      if (r) r.nodeIds.forEach(nid => nodeIds.add(nid));
    });
    return Array.from(nodeIds);
  };

  const activeNodes = getActiveRouteNodes();
  const isNodeDimmed = (nodeId: string) => {
    if (activeNodes === null) return false;
    return !activeNodes.includes(nodeId);
  };

  const handleCanvasDrop = (e: React.DragEvent) => {
    e.preventDefault();
    try {
      const moveData = e.dataTransfer.getData('application/combo-move');
      if (moveData) {
        const move = JSON.parse(moveData) as Move;
        // In MVP, we only allow dropping on empty canvas to create a new root, 
        // but store implementation currently replaces root. Let's just alert.
        alert('キャンバスの空白へのドロップは現在未対応です。既存ノードへドロップして子ノードを追加してください。');
      }
    } catch(err) {}
  };

  const handleNodeDropMove = (parentId: string, move: Move) => {
    addNode(parentId, move.id, move.name, move.roles[0] || 'link');
  };

  return (
    <div 
      className="flex-1 overflow-hidden relative"
      style={{ background: '#f8fafc' }}
      onWheel={handleWheel}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
      onDragOver={(e) => e.preventDefault()}
      onDrop={handleCanvasDrop}
    >
      {/* ズームコントロール */}
      <div className="absolute top-4 left-4 flex flex-col gap-2 z-20 bg-white p-2 rounded shadow-md border border-gray-200">
        <button onClick={() => setScale(s => Math.min(2, s + 0.1))} className="w-8 h-8 flex items-center justify-center bg-gray-100 hover:bg-gray-200 rounded font-bold text-gray-700">+</button>
        <button onClick={() => setScale(s => Math.max(0.2, s - 0.1))} className="w-8 h-8 flex items-center justify-center bg-gray-100 hover:bg-gray-200 rounded font-bold text-gray-700">-</button>
        <button onClick={() => { setScale(1); setPosition({x:0,y:0}); }} className="w-8 h-8 flex items-center justify-center bg-gray-100 hover:bg-gray-200 rounded font-bold text-gray-700 text-xs">FIT</button>
      </div>

      <div 
        ref={canvasRef}
        className="w-full h-full absolute transform-origin-0"
        style={{
          transform: `translate(${position.x}px, ${position.y}px) scale(${scale})`,
          transition: isDragging ? 'none' : 'transform 0.1s ease-out'
        }}
        onClick={() => selectNode(null)}
      >
        <div className="flex p-24 gap-16 relative w-max h-max">
          <ConnectionsOverlay root={rootNode} activeNodes={activeNodes} />
          
          {columns.map((col, i) => (
            <div key={i} className="flex flex-col gap-8 justify-center relative z-10">
              {col.nodes.map(node => (
                <ComboNodeCard 
                  key={node.id} 
                  node={node} 
                  isSelected={selectedNodeId === node.id}
                  isDimmed={isNodeDimmed(node.id)}
                  onClick={() => selectNode(node.id)}
                  onDropMove={(move) => handleNodeDropMove(node.id, move)}
                />
              ))}
            </div>
          ))}
        </div>
      </div>

      {/* ミニマップ */}
      <div className="absolute bottom-4 left-4 w-48 h-32 bg-white border border-gray-300 shadow-lg rounded p-2 z-20">
        <div className="w-full h-full border border-gray-200 bg-gray-50 relative overflow-hidden flex items-center justify-center text-xs text-gray-400">
          Mini Map (Preview)
        </div>
      </div>
    </div>
  );
}

function ConnectionsOverlay({ root, activeNodes }: { root: ComboNode, activeNodes: string[] | null }) {
  const svgRef = useRef<SVGSVGElement>(null);
  const [paths, setPaths] = useState<{ id: string; d: string; dimmed: boolean; highlighted: boolean }[]>([]);
  const { selectedRouteIds, routes } = useComboLabStore();

  useEffect(() => {
    let animationFrameId: number;
    const updateLines = () => {
      const svg = svgRef.current;
      if (!svg) {
        animationFrameId = requestAnimationFrame(updateLines);
        return;
      }
      
      const svgRect = svg.getBoundingClientRect();
      const newPaths: { id: string; d: string; dimmed: boolean; highlighted: boolean }[] = [];

      const buildLinks = (node: ComboNode) => {
        node.children.forEach(child => {
          const parentEl = document.getElementById(`node-${node.id}`);
          const childEl = document.getElementById(`node-${child.id}`);

          if (parentEl && childEl) {
            const pRect = parentEl.getBoundingClientRect();
            const cRect = childEl.getBoundingClientRect();

            // Transform back by inverse scale (bounding rects include scale, so we must calculate relative to svgRect which also includes scale)
            const startX = (pRect.right - svgRect.left);
            const startY = (pRect.top + pRect.height / 2 - svgRect.top);
            const endX = (cRect.left - svgRect.left);
            const endY = (cRect.top + cRect.height / 2 - svgRect.top);

            const distanceX = Math.max((endX - startX) / 2, 20);
            const cp1x = startX + distanceX;
            const cp1y = startY;
            const cp2x = endX - distanceX;
            const cp2y = endY;

            const d = `M ${startX} ${startY} C ${cp1x} ${cp1y}, ${cp2x} ${cp2y}, ${endX} ${endY}`;
            
            let dimmed = false;
            if (activeNodes !== null) {
              dimmed = !(activeNodes.includes(node.id) && activeNodes.includes(child.id));
            }

            // Check if this edge is part of a selected route
            let highlighted = false;
            selectedRouteIds.forEach(rId => {
              const r = routes.find(rt => rt.id === rId);
              if (r && r.nodeIds.includes(node.id) && r.nodeIds.includes(child.id)) {
                // Approximate edge checking for MVP: if both nodes are in the route, highlight it
                // A better approach would be to store edgeIds and check them.
                const pIdx = r.nodeIds.indexOf(node.id);
                const cIdx = r.nodeIds.indexOf(child.id);
                if (pIdx !== -1 && cIdx === pIdx + 1) {
                  highlighted = true;
                }
              }
            });

            newPaths.push({ id: `${node.id}-${child.id}`, d, dimmed, highlighted });
          }
          buildLinks(child);
        });
      };
      buildLinks(root);

      setPaths(newPaths);
      animationFrameId = requestAnimationFrame(updateLines);
    };

    animationFrameId = requestAnimationFrame(updateLines);
    return () => cancelAnimationFrame(animationFrameId);
  }, [root, activeNodes, selectedRouteIds, routes]);

  return (
    <svg
      ref={svgRef}
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        pointerEvents: 'none',
        zIndex: 0,
        overflow: 'visible',
      }}
    >
      {paths.map((path) => (
        <path
          key={path.id}
          d={path.d}
          fill="none"
          stroke={path.highlighted ? '#3b82f6' : path.dimmed ? '#e2e8f0' : '#cbd5e1'}
          strokeWidth={path.highlighted ? "3" : "2"}
          className="transition-colors duration-200"
        />
      ))}
    </svg>
  );
}
