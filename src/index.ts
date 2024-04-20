import { DecisionTree } from './DecisionTree/DecisionTree';
import { EvaluationResult, TreeData } from './DecisionTree/types';
import { UntreatedCLLJson } from './UntreatedCLLJson';

// create a new decision tree
const decisionTree = new DecisionTree(
  UntreatedCLLJson.nodes,
  UntreatedCLLJson.edges,
);

const data: TreeData = {
  symptomatic: true,
  asymptomatic: false,
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
