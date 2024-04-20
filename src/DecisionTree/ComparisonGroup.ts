import {
  ComparisonItem,
  ComparisonOperator,
  LogicalOperator,
  TreeData,
} from './types';

export class Comparison {
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

  public evaluate(context: TreeData): boolean {
    const contextValue = context[this.key];

    if (contextValue === undefined || this.value === undefined) {
      return false;
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
        return false;
    }
  }
}

export class ComparisonGroup {
  comparisons: ComparisonItem[];
  logicalOperator: LogicalOperator;

  constructor(
    comparisons: ComparisonItem[] = [],
    logicalOperator: LogicalOperator = '&&',
  ) {
    this.comparisons = comparisons;
    this.logicalOperator = logicalOperator;
  }

  evaluate(context: TreeData): boolean {
    if (this.comparisons.length === 0) {
      return false;
    }
    if (this.logicalOperator === '&&') {
      return this.comparisons.every((item: ComparisonItem) => {
        if (item.type === 'comparison') {
          return new Comparison(item.key, item.operator, item.value).evaluate(
            context,
          );
        } else if (item.type === 'comparisonGroup') {
          return new ComparisonGroup(
            item.comparisons,
            item.logicalOperator,
          ).evaluate(context);
        }
      });
    } else if (this.logicalOperator === '||') {
      return this.comparisons.some((item: ComparisonItem) => {
        if (item.type === 'comparison') {
          return new Comparison(item.key, item.operator, item.value).evaluate(
            context,
          );
        } else if (item.type === 'comparisonGroup') {
          return new ComparisonGroup(
            item.comparisons,
            item.logicalOperator,
          ).evaluate(context);
        }
      });
    } else {
      return false;
    }
  }
}
