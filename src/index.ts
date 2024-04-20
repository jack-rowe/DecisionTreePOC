import { DecisionTree, TreeEdge, TreeNode } from './DecisionTree/DecisionTree';
import {
  DecisionTreeJson,
  EvaluationResult,
  TreeData,
} from './DecisionTree/types';
import { UntreatedCLLJson } from './UntreatedCLLJson';

// create a new decision tree
const testJSON: DecisionTreeJson = UntreatedCLLJson;
const nodes: TreeNode[] = testJSON.nodes;
const edges: TreeEdge[] = testJSON.edges;
const decisionTree = new DecisionTree(nodes, edges);

// evaluate the decision tree
const data: TreeData = {
  symptomatic: false,
  asymptomatic: true,
  mutatedIgHv: true,
  adverseGeneticMarkers: false,
  age: 85,
  CIRS: 7,
  _17pDeletion: false,
  TP53Mutation: false,
};
const result: EvaluationResult = decisionTree.evaluate(data);

decisionTree.printTree();

decisionTree.printResult(result);
