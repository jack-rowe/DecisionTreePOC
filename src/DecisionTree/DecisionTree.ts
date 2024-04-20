import { Comparison, ComparisonGroup } from './ComparisonGroup';
import { MalformedDecisionTreeError } from './DAGErrors';
import { ComparisonItem, EvaluationResult, TreeData } from './types';

export class DecisionTree {
  root: TreeNode;
  nodes: TreeNode[];
  edges: TreeEdge[];

  constructor(nodes?: TreeNode[], edges?: TreeEdge[]) {
    this.nodes = nodes || [];
    this.edges = edges || [];
    this.root = this.findRoot();
  }
  private findRoot(): TreeNode {
    const foundRoot = this.nodes.find((node) => node.type === 'root');
    if (!foundRoot) {
      throw new MalformedDecisionTreeError('No root node found');
    }
    return foundRoot;
  }

  public evaluate(data: TreeData): EvaluationResult {
    let currentNode: TreeNode = this.root;
    const evalPath: string[] = [];

    // Traverse the tree until we reach an end node
    while (currentNode.type !== 'end') {
      const edgesFromCurrentNode = this.edges.filter(
        (edge) => edge.fromNode === currentNode.node_id,
      );

      if (edgesFromCurrentNode.length === 0) {
        throw new MalformedDecisionTreeError(
          `No edges found for node ${currentNode.node_id}`,
        );
      }

      let nextNode: TreeNode | undefined;
      let passingEdge: TreeEdge | undefined;

      for (const edge of edgesFromCurrentNode) {
        const comparison = edge.comparison;
        if (!comparison) {
          throw new MalformedDecisionTreeError(
            `No comparison found for edge ${edge.edge_id}`,
          );
        }
        let result = false;
        if (comparison.type === 'comparison') {
          result = new Comparison(
            comparison.key,
            comparison.operator,
            comparison.value,
          ).evaluate(data);
        } else if (comparison.type === 'comparisonGroup') {
          result = new ComparisonGroup(
            comparison.comparisons,
            comparison.logicalOperator,
          ).evaluate(data);
        }

        if (result) {
          passingEdge = edge;
          nextNode = this.nodes.find((node) => node.node_id === edge.toNode);
          evalPath.push(
            `${currentNode.title} -> ${passingEdge.title} = ${
              result ? 'true' : 'false'
            }`,
          );
          // Exit loop if a passing edge is found
          break;
        }
      }

      if (!passingEdge) {
        throw new MalformedDecisionTreeError(
          `No passing edge found for node ${currentNode.node_id}`,
        );
      }

      if (!nextNode) {
        throw new MalformedDecisionTreeError(
          `No node found for edge ${passingEdge.edge_id}`,
        );
      }

      currentNode = nextNode;
    }

    return {
      value: currentNode.value,
      node_id: currentNode.node_id,
      evalPath,
      data,
    };
  }

  public printTree(): void {
    // Helper function to find node by ID
    const findNodeById = (id: number) =>
      this.nodes.find((node) => node.node_id === id);

    // Recursive function to print node and its edges
    const printNode = (node: TreeNode, indentLevel = 0) => {
      const indent = '    '.repeat(indentLevel); // Indent by four spaces per level
      console.log(
        `${indent}Node - ID: ${node.node_id}, Title: ${node.title}, Value: ${
          node.value || 'N/A'
        }`,
      );

      // Find edges originating from this node
      const edgesFromNode = this.edges.filter(
        (edge) => edge.fromNode === node.node_id,
      );
      edgesFromNode.forEach((edge) => {
        console.log(
          `${indent}    Edge to Node ${edge.toNode} - Title: ${edge.title}`,
        ); // Edge indented one level from the node

        // Recursively print the destination node, indented one level from the edge
        const toNode = findNodeById(edge.toNode);
        if (toNode) {
          printNode(toNode, indentLevel + 2);
        }
      });
    };

    // Start printing from the root
    console.log('Decision Tree Structure:');
    if (this.root) {
      printNode(this.root);
    }
  }

  public printResult(result: EvaluationResult): void {
    console.log('Evaluation Result:');
    console.log(`Value: ${result.value}`);
    console.log(`Node ID: ${result.node_id}`);
    console.log('Evaluation Path:');
    result.evalPath.forEach((step) => console.log(`    ${step}`));
    console.log('Data:');
    console.log(result.data);
  }
}
export class TreeNode {
  node_id: number;
  type: string;
  title: string;
  value: string;

  constructor(node_id: number, type: string, title: string, value: string) {
    this.node_id = node_id;
    this.type = type;
    this.title = title;
    this.value = value;
  }
}

export class TreeEdge {
  edge_id: number;
  fromNode: number;
  toNode: number;
  title: string;
  comparison?: ComparisonItem;

  constructor(
    edge_id: number,
    fromNode: number,
    toNode: number,
    title: string,
    comparison?: ComparisonItem,
  ) {
    this.edge_id = edge_id;
    this.fromNode = fromNode;
    this.toNode = toNode;
    this.title = title;
    this.comparison = comparison;
  }
}
