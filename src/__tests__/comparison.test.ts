import {
  GroupComparison,
  SingleComparison,
} from '../DecisionTree/ComparisonGroup';
import { ComparisonOperator, LogicalOperator } from '../DecisionTree/types';

describe('SingleComparison basic comparisons', () => {
  test('evaluates == operator correctly', () => {
    const comp = new SingleComparison('age', '==', 30);
    expect(comp.evaluate({ age: 30 })).toBe(true);
    expect(comp.evaluate({ age: 25 })).toBe(false);
    expect(comp.evaluate({ age: 35 })).toBe(false);
  });

  test('evaluates != operator correctly', () => {
    const comp = new SingleComparison('age', '!=', 30);
    expect(comp.evaluate({ age: 25 })).toBe(true);
    expect(comp.evaluate({ age: 30 })).toBe(false);
    expect(comp.evaluate({ age: 35 })).toBe(true);
  });

  test('evaluates > operator correctly', () => {
    const comp = new SingleComparison('age', '>', 18);
    expect(comp.evaluate({ age: 20 })).toBe(true);
    expect(comp.evaluate({ age: 15 })).toBe(false);
    expect(comp.evaluate({ age: 18 })).toBe(false);
  });

  test('evaluates < operator correctly', () => {
    const comp = new SingleComparison('age', '<', 65);
    expect(comp.evaluate({ age: 60 })).toBe(true);
    expect(comp.evaluate({ age: 70 })).toBe(false);
    expect(comp.evaluate({ age: 65 })).toBe(false);
  });

  test('evaluates >= operator correctly', () => {
    const comp = new SingleComparison('age', '>=', 18);
    expect(comp.evaluate({ age: 18 })).toBe(true);
    expect(comp.evaluate({ age: 20 })).toBe(true);
    expect(comp.evaluate({ age: 15 })).toBe(false);
  });

  test('evaluates <= operator correctly', () => {
    const comp = new SingleComparison('age', '<=', 65);
    expect(comp.evaluate({ age: 65 })).toBe(true);
    expect(comp.evaluate({ age: 70 })).toBe(false);
    expect(comp.evaluate({ age: 60 })).toBe(true);
  });
});

describe('SingleComparison error handling', () => {
  test('throws error if required data is undefined', () => {
    const comp = new SingleComparison('age', '==', 30);
    expect(() => comp.evaluate({})).toThrow();
    expect(() => comp.evaluate({ age: 30 })).not.toThrow();
    expect(() => comp.evaluate({ country: 'Canada' })).toThrow();
  });

  test('throws error if value is undefined', () => {
    const comp = new SingleComparison('age', '==');
    expect(() => comp.evaluate({ age: 4 })).toThrow();
    const comp2 = new SingleComparison('', '==', 4);
    expect(() => comp2.evaluate({ age: 4 })).toThrow();
  });

  test('throws error if operator is invalid', () => {
    const comp = new SingleComparison(
      'age',
      'invalid' as ComparisonOperator,
      30,
    );
    expect(() => comp.evaluate({ age: 30 })).toThrow();
  });
});

describe('GroupComparison basic comparisons', () => {
  test('evaluates && operator correctly with all true', () => {
    const group = new GroupComparison(
      [
        { type: 'comparison', key: 'age', operator: '>=', value: 18 },
        { type: 'comparison', key: 'name', operator: '==', value: 'John' },
      ],
      '&&',
    );
    expect(group.evaluate({ age: 20, name: 'John' })).toBe(true);
  });

  test('evaluates && operator correctly with one false', () => {
    const group = new GroupComparison(
      [
        { type: 'comparison', key: 'age', operator: '>=', value: 18 },
        { type: 'comparison', key: 'name', operator: '==', value: 'Jane' },
      ],
      '&&',
    );
    expect(group.evaluate({ age: 20, name: 'John' })).toBe(false);
    expect(group.evaluate({ age: 15, name: 'Jane' })).toBe(false);
  });

  test('evaluates || operator correctly with one true', () => {
    const group = new GroupComparison(
      [
        { type: 'comparison', key: 'age', operator: '>', value: 65 },
        { type: 'comparison', key: 'name', operator: '==', value: 'John' },
      ],
      '||',
    );
    expect(group.evaluate({ age: 20, name: 'John' })).toBe(true);
    expect(group.evaluate({ age: 70, name: 'Jane' })).toBe(true);
  });

  test('returns false if no conditions match in || operator', () => {
    const group = new GroupComparison(
      [
        { type: 'comparison', key: 'age', operator: '>', value: 65 },
        { type: 'comparison', key: 'name', operator: '==', value: 'Jane' },
      ],
      '||',
    );
    expect(group.evaluate({ age: 20, name: 'John' })).toBe(false);
  });

  test('handles nested ComparisonGroup correctly', () => {
    const nestedGroup = new GroupComparison(
      [
        {
          type: 'comparisonGroup',
          comparisons: [
            { type: 'comparison', key: 'age', operator: '>=', value: 18 },
            { type: 'comparison', key: 'name', operator: '==', value: 'John' },
          ],
          logicalOperator: '&&',
        },
        { type: 'comparison', key: 'name', operator: '==', value: 'Jane' },
      ],
      '||',
    );
    expect(nestedGroup.evaluate({ age: 18, name: 'John' })).toBe(true);
    expect(nestedGroup.evaluate({ age: 15, name: 'Jane' })).toBe(true);
    expect(nestedGroup.evaluate({ age: 20, name: 'Jane' })).toBe(true);
    expect(nestedGroup.evaluate({ age: 15, name: 'John' })).toBe(false);
  });

  test('handles double nested ComparisonGroup correctly', () => {
    const nestedGroup = new GroupComparison(
      [
        {
          type: 'comparisonGroup',
          comparisons: [
            { type: 'comparison', key: 'age', operator: '>=', value: 18 },
            {
              type: 'comparisonGroup',
              comparisons: [
                {
                  type: 'comparisonGroup',
                  comparisons: [
                    {
                      type: 'comparison',
                      key: 'name',
                      operator: '==',
                      value: 'John',
                    },
                    {
                      type: 'comparison',
                      key: 'age',
                      operator: '>',
                      value: '18',
                    },
                  ],
                  logicalOperator: '&&',
                },
                {
                  type: 'comparison',
                  key: 'name',
                  operator: '==',
                  value: 'Jane',
                },
              ],
              logicalOperator: '||',
            },
          ],
          logicalOperator: '&&',
        },
      ],
      '||',
    );
    expect(nestedGroup.evaluate({ age: 19, name: 'John' })).toBe(true);
    expect(nestedGroup.evaluate({ age: 20, name: 'Jane' })).toBe(true);
    expect(nestedGroup.evaluate({ age: 15, name: 'Jane' })).toBe(false);
    expect(nestedGroup.evaluate({ age: 20, name: 'Peter' })).toBe(false);
  });
});

describe('GroupComparison error handling', () => {
  test('throw error for empty comparison group', () => {
    const group = new GroupComparison([], '&&');
    expect(() => group.evaluate({})).toThrow();

    const group2 = new GroupComparison([], '||');
    expect(() => group2.evaluate({})).toThrow();
  });

  test('throws error for invalid logical operator', () => {
    const invalidOpGroup = new GroupComparison(
      [{ type: 'comparison', key: 'age', operator: '>=', value: 18 }],
      'invalid' as LogicalOperator, // Force an invalid operator to simulate the error condition
    );
    expect(() => invalidOpGroup.evaluate({ age: 20 })).toThrow(
      'Invalid logical operator',
    );
  });
});
