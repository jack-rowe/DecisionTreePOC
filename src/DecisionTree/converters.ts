import { MalformedDataError } from './DAGErrors';
import { DecisionTree } from './DecisionTree';

export function convertObsidianJSONToDecisionTree(jsonData: any): DecisionTree {
  return new DecisionTree();
}
