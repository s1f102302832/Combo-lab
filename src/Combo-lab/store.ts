import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Move, ComboNode, ComboEdge, ComboRoute, Material, DrawerType, MoveRole, MoveCategory } from './types';

export const makeId = (): string => Date.now().toString(36) + Math.random().toString(36).slice(2);

const INITIAL_MOVES: Move[] = [
  { id: 'm1', name: '2LP', category: 'normal', roles: ['link'], tags: [], createdAt: '', updatedAt: '' },
  { id: 'm2', name: '2MP', category: 'normal', roles: ['link'], tags: [], createdAt: '', updatedAt: '' },
  { id: 'm3', name: '5HP', category: 'normal', roles: ['link'], tags: [], createdAt: '', updatedAt: '' },
  { id: 'm4', name: '5MP', category: 'normal', roles: ['link'], tags: [], createdAt: '', updatedAt: '' },
  { id: 'm5', name: '2中K', category: 'normal', roles: ['starter'], tags: [], createdAt: '', updatedAt: '' },
  { id: 'm6', name: 'DR', category: 'situation', roles: ['link'], tags: [], createdAt: '', updatedAt: '' },
  { id: 'm7', name: '2HP', category: 'normal', roles: ['link'], tags: [], createdAt: '', updatedAt: '' },
  { id: 'm8', name: '236P', category: 'special', roles: ['ender'], tags: [], createdAt: '', updatedAt: '' },
  { id: 'm9', name: '236K', category: 'special', roles: ['ender'], tags: [], createdAt: '', updatedAt: '' },
  { id: 'm10', name: '214K', category: 'special', roles: ['ender'], tags: [], createdAt: '', updatedAt: '' },
  { id: 'm11', name: '超必殺技', category: 'sa', roles: ['ender'], tags: [], createdAt: '', updatedAt: '' },
  { id: 'm12', name: '中継締め', category: 'situation', roles: ['situation'], tags: [], createdAt: '', updatedAt: '' },
  { id: 'm13', name: '画面端締め', category: 'situation', roles: ['situation'], tags: [], createdAt: '', updatedAt: '' },
];

function createSampleTree(): ComboNode {
  return {
    id: 'n_start',
    moveId: 'm5',
    label: '2中K',
    role: 'starter',
    x: 0,
    y: 0,
    tags: [],
    createdAt: '',
    updatedAt: '',
    children: [
      {
        id: 'n_5mp_1', moveId: 'm4', label: '5MP', role: 'link', x: 0, y: 0, tags: [], createdAt: '', updatedAt: '', children: [
          {
            id: 'n_2hp_1', moveId: 'm7', label: '2HP', role: 'link', x: 0, y: 0, tags: [], createdAt: '', updatedAt: '', children: [
              {
                id: 'n_236k', moveId: 'm9', label: '236K', role: 'ender', x: 0, y: 0, tags: [], createdAt: '', updatedAt: '', isComboEnd: true, children: [
                  {
                    id: 'n_situ_1', moveId: 'm12', label: '中継締め', role: 'situation', x: 0, y: 0, tags: [], createdAt: '', updatedAt: '', children: [
                      { id: 'n_situ_2', moveId: 'm13', label: '画面端締め', role: 'situation', x: 0, y: 0, tags: [], createdAt: '', updatedAt: '', children: [] }
                    ]
                  }
                ]
              }
            ]
          },
          { id: 'n_214k_1', moveId: 'm10', label: '214K', role: 'ender', x: 0, y: 0, tags: [], createdAt: '', updatedAt: '', isComboEnd: true, children: [] }
        ]
      },
      {
        id: 'n_dr', moveId: 'm6', label: 'DR', role: 'link', x: 0, y: 0, tags: [], createdAt: '', updatedAt: '', children: [
          {
            id: 'n_5mp_2', moveId: 'm4', label: '5MP', role: 'link', x: 0, y: 0, tags: [], createdAt: '', updatedAt: '', children: [
              {
                id: 'n_2hp_2', moveId: 'm7', label: '2HP', role: 'link', x: 0, y: 0, tags: [], createdAt: '', updatedAt: '', children: [
                  {
                    id: 'n_236p_1', moveId: 'm8', label: '236P', role: 'ender', x: 0, y: 0, tags: [], createdAt: '', updatedAt: '', isComboEnd: true, children: [
                      {
                        id: 'n_situ_3', moveId: 'm12', label: '中継締め', role: 'situation', x: 0, y: 0, tags: [], createdAt: '', updatedAt: '', children: [
                          { id: 'n_situ_4', moveId: 'm13', label: '画面端締め', role: 'situation', x: 0, y: 0, tags: [], createdAt: '', updatedAt: '', children: [] }
                        ]
                      }
                    ]
                  }
                ]
              }
            ]
          }
        ]
      },
      {
        id: 'n_2lp', moveId: 'm1', label: '2LP', role: 'link', x: 0, y: 0, tags: [], createdAt: '', updatedAt: '', children: [
          {
            id: 'n_5mp_3', moveId: 'm4', label: '5MP', role: 'link', x: 0, y: 0, tags: [], createdAt: '', updatedAt: '', children: [
              {
                id: 'n_2hp_3', moveId: 'm7', label: '2HP', role: 'link', x: 0, y: 0, tags: [], createdAt: '', updatedAt: '', children: [
                  { id: 'n_236p_2', moveId: 'm8', label: '236P', role: 'ender', x: 0, y: 0, tags: [], createdAt: '', updatedAt: '', isComboEnd: true, children: [] }
                ]
              }
            ]
          },
          { id: 'n_214k_2', moveId: 'm10', label: '214K', role: 'ender', x: 0, y: 0, tags: [], createdAt: '', updatedAt: '', isComboEnd: true, children: [] }
        ]
      },
      {
        id: 'n_5hp', moveId: 'm3', label: '5HP', role: 'link', x: 0, y: 0, tags: [], createdAt: '', updatedAt: '', children: [
          { id: 'n_236k_2', moveId: 'm9', label: '236K', role: 'ender', x: 0, y: 0, tags: [], createdAt: '', updatedAt: '', isComboEnd: true, children: [] }
        ]
      }
    ]
  };
}

const INITIAL_ROUTES: ComboRoute[] = [
  { id: 'r1', title: '2中K > 5MP > 2HP > 236K', startNodeId: 'n_start', endNodeId: 'n_236k', nodeIds: ['n_start', 'n_5mp_1', 'n_2hp_1', 'n_236k'], edgeIds: [], situationTags: [], published: false, createdAt: '', updatedAt: '' },
  { id: 'r2', title: '2中K > 5MP > 214K', startNodeId: 'n_start', endNodeId: 'n_214k_1', nodeIds: ['n_start', 'n_5mp_1', 'n_214k_1'], edgeIds: [], situationTags: [], published: false, createdAt: '', updatedAt: '' },
  { id: 'r3', title: 'DR基礎ルート', startNodeId: 'n_start', endNodeId: 'n_236p_1', nodeIds: ['n_start', 'n_dr', 'n_5mp_2', 'n_2hp_2', 'n_236p_1'], edgeIds: [], situationTags: [], published: false, createdAt: '', updatedAt: '' },
];

export interface ComboLabState {
  moves: Move[];
  rootNode: ComboNode;
  edges: ComboEdge[];
  routes: ComboRoute[];
  materials: Material[];

  // UI State
  activeDrawer: DrawerType;
  selectedNodeId: string | null;
  selectedRouteIds: string[];
  viewMode: 'all' | 'selected_route' | 'published';

  // Actions
  setActiveDrawer: (drawer: DrawerType) => void;
  selectNode: (nodeId: string | null) => void;
  toggleRouteSelection: (routeId: string) => void;
  clearRouteSelection: () => void;
  setViewMode: (mode: 'all' | 'selected_route' | 'published') => void;

  // Tree Actions
  addNode: (parentId: string | null, moveId: string, label: string, role: MoveRole) => string;
  updateNode: (nodeId: string, updates: Partial<ComboNode>) => void;
  registerCombo: (endNodeId: string) => void;
}

// Tree helpers
function mapNode(node: ComboNode, targetId: string, fn: (n: ComboNode) => ComboNode): ComboNode {
  if (node.id === targetId) return fn(node);
  return { ...node, children: node.children.map((c) => mapNode(c, targetId, fn)) };
}

function findPathToNode(node: ComboNode, targetId: string, currentPath: string[] = []): string[] | null {
  const newPath = [...currentPath, node.id];
  if (node.id === targetId) return newPath;
  for (const child of node.children) {
    const res = findPathToNode(child, targetId, newPath);
    if (res) return res;
  }
  return null;
}

export const useComboLabStore = create<ComboLabState>()(
  persist(
    (set, get) => ({
      moves: INITIAL_MOVES,
      rootNode: createSampleTree(),
      edges: [],
      routes: INITIAL_ROUTES,
      materials: [],

      activeDrawer: null,
      selectedNodeId: null,
      selectedRouteIds: [],
      viewMode: 'all',

      setActiveDrawer: (drawer) => set({ activeDrawer: drawer }),
      selectNode: (nodeId) => set({ selectedNodeId: nodeId, activeDrawer: nodeId ? 'selection' : null }),
      toggleRouteSelection: (routeId) => set((state) => ({
        selectedRouteIds: state.selectedRouteIds.includes(routeId)
          ? state.selectedRouteIds.filter(id => id !== routeId)
          : [...state.selectedRouteIds, routeId]
      })),
      clearRouteSelection: () => set({ selectedRouteIds: [] }),
      setViewMode: (mode) => set({ viewMode: mode }),

      addNode: (parentId, moveId, label, role) => {
        const newNode: ComboNode = {
          id: makeId(),
          moveId,
          label,
          role,
          x: 0,
          y: 0,
          tags: [],
          children: [],
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        };

        if (!parentId) {
          // If no parent, we replace root for MVP? Or we can't do multiple roots easily with a single tree.
          // Simplification: just return id and fail if no parent (unless creating a whole new tree).
          set({ rootNode: newNode });
          return newNode.id;
        }

        set((state) => ({
          rootNode: mapNode(state.rootNode, parentId, (n) => ({
            ...n,
            children: [...n.children, newNode]
          }))
        }));
        return newNode.id;
      },

      updateNode: (nodeId, updates) => {
        set((state) => ({
          rootNode: mapNode(state.rootNode, nodeId, (n) => ({ ...n, ...updates }))
        }));
      },

      registerCombo: (endNodeId) => {
        const state = get();
        const path = findPathToNode(state.rootNode, endNodeId);
        if (!path) return;

        const newRoute: ComboRoute = {
          id: makeId(),
          title: `Route to ${endNodeId.slice(0, 4)}`, // Need a better title generator
          startNodeId: path[0],
          endNodeId: endNodeId,
          nodeIds: path,
          edgeIds: [],
          situationTags: [],
          published: false,
          materialIds: [],
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        };

        set((s) => ({
          routes: [...s.routes, newRoute],
          rootNode: mapNode(s.rootNode, endNodeId, (n) => ({ ...n, isComboEnd: true }))
        }));
      }
    }),
    {
      name: 'combo-lab-storage',
      partialize: (state) => ({
        moves: state.moves,
        rootNode: state.rootNode,
        routes: state.routes,
        materials: state.materials,
      })
    }
  )
);
