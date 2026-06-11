export type MoveCategory = "normal" | "special" | "sa" | "throw" | "situation";

export type MoveRole =
  | "starter"
  | "link"
  | "ender"
  | "setup"
  | "situation"
  | "other";

export type MaterialStatus =
  | "unorganized"
  | "needs_verification"
  | "candidate"
  | "registered";

export interface Move {
  id: string;
  name: string;
  command?: string;
  category: MoveCategory;
  roles: MoveRole[];
  tags: string[];
  damage?: number;
  meterCost?: number;
  meterGain?: number;
  note?: string;
  createdAt: string;
  updatedAt: string;
}

export interface ComboNode {
  id: string;
  moveId?: string; // 結びつくMoveがある場合
  label: string;
  role: MoveRole;
  x: number;
  y: number;
  tags: string[];
  note?: string;
  isComboEnd?: boolean;
  createdAt: string;
  updatedAt: string;
  children: ComboNode[]; // 階層構造として保持
}

export interface ComboEdge {
  id: string;
  fromNodeId: string;
  toNodeId: string;
  connectionType?: "cancel" | "link" | "delay" | "jump_cancel" | "situation";
  conditionTags: string[];
  note?: string;
  createdAt: string;
  updatedAt: string;
}

export interface ComboRoute {
  id: string;
  title: string;
  startNodeId: string;
  endNodeId: string;
  nodeIds: string[];
  edgeIds: string[];
  damage?: number;
  meterCost?: number;
  meterGain?: number;
  difficulty?: "beginner" | "normal" | "hard" | "expert";
  situationTags: string[];
  endSituation?: string;
  note?: string;
  materialIds: string[];
  published: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Material {
  id: string;
  type: "video_url" | "timestamp" | "text" | "image";
  url?: string;
  timestamp?: string;
  text?: string;
  status: MaterialStatus;
  linkedMoveIds: string[];
  linkedNodeIds: string[];
  linkedComboIds: string[];
  createdAt: string;
  updatedAt: string;
}

export type DrawerType = "moves" | "selection" | "combos" | "materials" | null;
