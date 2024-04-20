// tree.test.ts
import { DecisionTree, TreeEdge, TreeNode } from '../DecisionTree/DecisionTree';
import { DecisionTreeJson } from '../DecisionTree/types';
import {
  ActiveSurveillanceData,
  MissingData,
  TreatmentPlanAData,
  TreatmentPlanBData,
  TreatmentPlanCData,
  TreatmentPlanDData,
  UntreatedCLLJson,
} from '../UntreatedCLLJson';

describe('DecisionTree Basic Evaluation', () => {
  let tree: DecisionTree;

  beforeEach(() => {
    const testJSON: DecisionTreeJson = UntreatedCLLJson;
    const nodes: TreeNode[] = testJSON.nodes;
    const edges: TreeEdge[] = testJSON.edges;
    tree = new DecisionTree(nodes, edges);
  });

  test('should create a tree', () => {
    expect(tree).toBeInstanceOf(DecisionTree);
  });

  test('should return the correct node', () => {
    const t1 = tree.evaluate(ActiveSurveillanceData);
    expect(t1).toHaveProperty('value', 'Active Surveillance');

    const t2 = tree.evaluate(TreatmentPlanAData);
    expect(t2).toHaveProperty('value', 'A');

    const t3 = tree.evaluate(TreatmentPlanBData);
    expect(t3).toHaveProperty('value', 'B');

    const t4 = tree.evaluate(TreatmentPlanCData);
    expect(t4).toHaveProperty('value', 'C');

    const t5 = tree.evaluate(TreatmentPlanDData);
    expect(t5).toHaveProperty('value', 'D');
  });

  test('should pass first correct edge', () => {
    const t1 = tree.evaluate({
      ...TreatmentPlanAData,
      symptomatic: true,
      asymptomatic: true,
    });
    expect(t1).toHaveProperty('value', 'A');
  });

  test('should throw an error if required data is not present', () => {
    expect(() => tree.evaluate(MissingData)).toThrow();
  });
});
