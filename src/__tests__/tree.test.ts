// tree.test.ts
import { DecisionTree, TreeNode } from '../DecisionTree/DecisionTree';

describe('TreeNode and DecisionTree', () => {
  let tree: DecisionTree;
  let root: TreeNode;
  let nodeA: TreeNode;
  let nodeB: TreeNode;

  // beforeEach(() => {});

  it('should have a root node', () => {
    expect(tree.root).toBeDefined();
  });
});
