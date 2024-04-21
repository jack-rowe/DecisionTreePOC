import {
  ComparisonItem,
  ComparisonOperator,
  LogicalOperator,
  TreeData,
} from './types';

export class SingleComparison {
  key = '';
  operator: ComparisonOperator = '==';
  value: number | string | boolean | undefined;

  constructor(
    key?: string,
    operator?: ComparisonOperator,
    value?: number | string | boolean,
  ) {
    this.key = key ?? '';
    this.operator = operator ?? '==';
    this.value = value ?? undefined;
  }

  // Evaluate the comparison
  // This will compare the value in the context with the value in the comparison
  public evaluate(context: TreeData): boolean {
    if (this.key === '') {
      throw new Error('Key not found in comparison');
    }

    const contextValue = context?.[this.key];

    if (contextValue === undefined || this.value === undefined) {
      throw new Error('Key or value not found in context');
    }

    switch (this.operator) {
      case '==':
        return contextValue === this.value;
      case '!=':
        return contextValue !== this.value;
      case '>':
        return contextValue > this.value;
      case '<':
        return contextValue < this.value;
      case '>=':
        return contextValue >= this.value;
      case '<=':
        return contextValue <= this.value;
      default:
        throw new Error('Invalid operator');
    }
  }
}

export class GroupComparison {
  comparisons: ComparisonItem[];
  logicalOperator: LogicalOperator;

  constructor(
    comparisons: ComparisonItem[] = [],
    logicalOperator: LogicalOperator = '&&',
  ) {
    this.comparisons = comparisons;
    this.logicalOperator = logicalOperator;
  }
  // Evaluate the comparison group
  // This will recursively evaluate all comparisons and comparison groups in the group
  evaluate(context: TreeData): boolean {
    if (this.comparisons.length === 0) {
      throw new Error('No comparisons found in group');
    }
    if (this.logicalOperator === '&&') {
      return this.comparisons.every((item: ComparisonItem) => {
        if (item.type === 'comparison') {
          return new SingleComparison(
            item.key,
            item.operator,
            item.value,
          ).evaluate(context);
        } else if (item.type === 'comparisonGroup') {
          return new GroupComparison(
            item.comparisons,
            item.logicalOperator,
          ).evaluate(context);
        }
      });
    } else if (this.logicalOperator === '||') {
      return this.comparisons.some((item: ComparisonItem) => {
        if (item.type === 'comparison') {
          return new SingleComparison(
            item.key,
            item.operator,
            item.value,
          ).evaluate(context);
        } else if (item.type === 'comparisonGroup') {
          return new GroupComparison(
            item.comparisons,
            item.logicalOperator,
          ).evaluate(context);
        }
      });
    } else {
      throw new Error('Invalid logical operator');
    }
  }
}
