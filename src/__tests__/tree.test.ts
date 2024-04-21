// tree.test.ts
import { DecisionTree, TreeEdge, TreeNode } from '../DecisionTree/DecisionTree';
import { ComparisonItem, DecisionTreeJson } from '../DecisionTree/types';
import {
  ActiveSurveillanceData,
  MissingData,
  TreatmentPlanAData,
  TreatmentPlanBData,
  TreatmentPlanCData,
  TreatmentPlanDData,
  UntreatedCLLJson,
} from '../UntreatedCLLJson';

describe('DecisionTree basic evaluation', () => {
  let tree: DecisionTree;

  beforeAll(() => {
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
});

describe('DecisionTree error handling', () => {
  let tree: DecisionTree;

  beforeAll(() => {
    const testJSON: DecisionTreeJson = UntreatedCLLJson;
    const nodes: TreeNode[] = testJSON.nodes;
    const edges: TreeEdge[] = testJSON.edges;
    tree = new DecisionTree(nodes, edges);
  });

  test('should throw an error if no edges are found for a node', () => {
    const badJSON: DecisionTreeJson = {
      nodes: [
        {
          node_id: 1,
          type: 'root',
          title: 'Untreated CLL/SLL',
          value: '',
        },
        {
          node_id: 2,
          type: 'decision',
          title: 'End',
          value: 'End Value',
        },
      ],
      edges: [],
    };
    const data = { key: 'value' };
    expect(() =>
      new DecisionTree(badJSON.nodes, badJSON.edges).evaluate(data),
    ).toThrow();
  });

  test('should throw an error if required data is not present', () => {
    expect(() => tree.evaluate(MissingData)).toThrow();
  });

  test('should throw an error if no root node is found', () => {
    const badJSON: DecisionTreeJson = {
      nodes: [
        {
          node_id: 1,
          type: 'decision',
          title: 'Symptomatic',
          value: '',
        },
      ],
      edges: [],
    };
    expect(() => new DecisionTree(badJSON.nodes, badJSON.edges)).toThrow();
  });

  test('should throw an error if an edge has no comparison', () => {
    const badJSON: DecisionTreeJson = {
      nodes: [
        {
          node_id: 1,
          type: 'root',
          title: 'Untreated CLL/SLL',
          value: '',
        },
        {
          node_id: 2,
          type: 'decision',
          title: 'End',
          value: 'End Value',
        },
      ],
      edges: [
        {
          edge_id: 1,
          title: 'Edge',
          fromNode: 1,
          toNode: 2,
          comparison: {} as ComparisonItem,
        },
      ],
    };
    const data = { key: 'value' };
    expect(() =>
      new DecisionTree(badJSON.nodes, badJSON.edges).evaluate(data),
    ).toThrow();
  });

  test('should throw an error if a node has no passing edge', () => {
    const badJSON: DecisionTreeJson = {
      nodes: [
        {
          node_id: 1,
          type: 'root',
          title: 'Untreated CLL/SLL',
          value: '',
        },
        {
          node_id: 2,
          type: 'decision',
          title: 'End',
          value: 'End Value',
        },
      ],
      edges: [
        {
          edge_id: 1,
          title: 'Edge',
          fromNode: 1,
          toNode: 2,
          comparison: {
            type: 'comparison',
            key: 'key',
            operator: '==',
            value: 'value',
          },
        },
      ],
    };
    const data = { key: 'wrong value' };
    expect(() =>
      new DecisionTree(badJSON.nodes, badJSON.edges).evaluate(data),
    ).toThrow();
  });

  test('should throw an error if a passing edge has no nextNode', () => {
    const badJSON: DecisionTreeJson = {
      nodes: [
        {
          node_id: 1,
          type: 'root',
          title: 'Untreated CLL/SLL',
          value: '',
        },
        {
          node_id: 2,
          type: 'decision',
          title: 'End',
          value: 'End Value',
        },
      ],
      edges: [
        {
          edge_id: 1,
          title: 'Edge',
          fromNode: 1,
          toNode: 2,
          comparison: {
            type: 'comparison',
            key: 'key',
            operator: '==',
            value: 'value',
          },
        },
        {
          edge_id: 2,
          title: 'Edge',
          fromNode: 1,
          toNode: 3,
          comparison: {
            type: 'comparison',
            key: 'key',
            operator: '==',
            value: 'value',
          },
        },
      ],
    };
    const data = { key: 'value' };
    expect(() =>
      new DecisionTree(badJSON.nodes, badJSON.edges).evaluate(data),
    ).toThrow();
  });
});
