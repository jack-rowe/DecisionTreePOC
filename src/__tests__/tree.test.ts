// tree.test.ts
import { DecisionTree, TreeEdge, TreeNode } from '../DecisionTree/DecisionTree';
import { DecisionTreeJson } from '../DecisionTree/types';

describe('DecisionTree Basic Evaluation', () => {
  let tree: DecisionTree;

  beforeEach(() => {
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
        {
          node_id: 8,
          type: 'end',
          title: 'Plan F',
          value: 'F',
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
          title: 'B is true AND C is true',
          comparison: {
            type: 'comparisonGroup',
            logicalOperator: '&&',
            comparisons: [
              {
                type: 'comparison',
                key: 'b',
                operator: '==',
                value: true,
              },
              {
                type: 'comparison',
                key: 'c',
                operator: '==',
                value: true,
              },
            ],
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
        {
          edge_id: 5,
          fromNode: 5,
          toNode: 8,
          title: 'B is true OR C is false',
          comparison: {
            type: 'comparisonGroup',
            logicalOperator: '||',
            comparisons: [
              {
                type: 'comparison',
                key: 'b',
                operator: '==',
                value: true,
              },
              {
                type: 'comparison',
                key: 'c',
                operator: '==',
                value: false,
              },
            ],
          },
        },
      ],
    };
    const nodes: TreeNode[] = testJSON.nodes;
    const edges: TreeEdge[] = testJSON.edges;
    tree = new DecisionTree(nodes, edges);
  });

  test('should create a tree', () => {
    expect(tree).toBeInstanceOf(DecisionTree);
  });

  test('should return the correct node', () => {
    const data = { a: 5, b: true, c: true };
    const result = tree.evaluate(data);
    expect(result).toHaveProperty('value', 'D');
    expect(result).toHaveProperty('node_id', 6);

    const data2 = { a: 5, b: false, c: true };
    const result2 = tree.evaluate(data2);
    expect(result2).toHaveProperty('value', 'E');
    expect(result2).toHaveProperty('node_id', 7);

    const data3 = { a: 6, b: true, c: false };
    const result3 = tree.evaluate(data3);
    expect(result3).toHaveProperty('value', 'A');
    expect(result3).toHaveProperty('node_id', 4);

    const data4 = { a: 4, b: true, c: false };
    const result4 = tree.evaluate(data4);
    expect(result4).toHaveProperty('value', 'F');
    expect(result4).toHaveProperty('node_id', 8);
  });

  test('should throw an error if required data is not present', () => {
    const data = { a: 5, b: true };
    expect(() => tree.evaluate(data)).toThrow();
  });
});
