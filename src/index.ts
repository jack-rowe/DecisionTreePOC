import { DecisionTree, TreeEdge, TreeNode } from './DecisionTree/DecisionTree';
import {
  DecisionTreeJson,
  EvaluationResult,
  TreeData,
} from './DecisionTree/types';

// create a new decision tree
const testJSON: DecisionTreeJson = {
  nodes: [
    {
      node_id: 2,
      type: 'root',
      title: 'ROOT NODE',
      value: '',
    },
    {
      node_id: 4,
      type: 'end',
      title: 'Plan A',
      value: 'A',
    },
    {
      node_id: 5,
      type: 'decision',
      title: 'DECISION C',
      value: 'C',
    },
    {
      node_id: 6,
      type: 'end',
      title: 'Plan D',
      value: 'D',
    },
    {
      node_id: 7,
      type: 'end',
      title: 'Plan E',
      value: 'E',
    },
  ],
  edges: [
    {
      edge_id: 1,
      fromNode: 2,
      toNode: 4,
      title: 'A Greater than 5',
      comparison: {
        type: 'comparison',
        key: 'a',
        operator: '>',
        value: 5,
      },
    },
    {
      edge_id: 2,
      fromNode: 2,
      toNode: 5,
      title: 'A Less than or Equal to 5',
      comparison: {
        type: 'comparison',
        key: 'a',
        operator: '<=',
        value: 5,
      },
    },
    {
      edge_id: 3,
      fromNode: 5,
      toNode: 6,
      title: 'B is true',
      comparison: {
        type: 'comparison',
        key: 'b',
        operator: '==',
        value: true,
      },
    },
    {
      edge_id: 4,
      fromNode: 5,
      toNode: 7,
      title: 'B is false',
      comparison: {
        type: 'comparison',
        key: 'b',
        operator: '==',
        value: false,
      },
    },
  ],
};
const nodes: TreeNode[] = testJSON.nodes;
const edges: TreeEdge[] = testJSON.edges;
const decisionTree = new DecisionTree(nodes, edges);

// evaluate the decision tree
const data: TreeData = { a: 2, b: true };
const result: EvaluationResult = decisionTree.evaluate(data);

decisionTree.printTree();

decisionTree.printResult(result);
