import { TreeEdge, TreeNode } from './DecisionTree';

export interface TreeData {
  [key: string]: number | string | boolean;
}

export interface EvaluationResult {
  value: string;
  node_id: number;
  evalPath: string[];

  data: TreeData;
}

// export interface ObsidianJson {
//   nodes: ObsidianNode[];
//   edges: ObsidianEdge[];
// }

// export interface ObsidianEdge {
//   id: string;
//   fromNode: string;
//   fromSide: string;
//   toNode: string;
//   toSide: string;
//   label: string; // contains all data for the edge
//   color?: string;
// }

// export interface ObsidianNode {
//   id: string;
//   type: string;
//   text: string; // contains all data for the node
//   x: number;
//   y: number;
//   width: number;
//   height: number;
// }

// export interface ObsidianNodeText {
//   node_id: number;
//   type: string;
//   title: string;
//   value: string;
// }

export type ComparisonOperator = '==' | '!=' | '>' | '<' | '>=' | '<=';
export type LogicalOperator = '&&' | '||';

// Base type for an item in the comparison hierarchy
interface ComparisonBase {
  type: 'comparison' | 'comparisonGroup' | 'passthrough';
}

// Type definition for a single comparison
export interface Comparison extends ComparisonBase {
  type: 'comparison';
  key: string;
  operator: '==' | '!=' | '>' | '<' | '>=' | '<=';
  value: number | string | boolean;
}

// Type definition for a group of comparisons
interface ComparisonGroup extends ComparisonBase {
  type: 'comparisonGroup';
  logicalOperator: '&&' | '||';
  comparisons: ComparisonItem[]; // Recursive type to allow nesting
}

// Union type to handle both individual comparisons and groups
export type ComparisonItem = Comparison | ComparisonGroup;

// Optional root wrapper type to start the JSON structure

export interface DecisionTreeJson {
  nodes: TreeNode[];
  edges: TreeEdge[];
}
