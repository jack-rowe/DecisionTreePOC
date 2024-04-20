import { Comparison, ComparisonGroup } from '../DecisionTree/ComparisonGroup';
import {
  ComparisonOperator,
  LogicalOperator,
  TreeData,
} from '../DecisionTree/types';

describe('Comparison', () => {
  test('evaluates == operator correctly', () => {
    const comp = new Comparison('age', '==', 30);
    expect(comp.evaluate({ age: 30 })).toBe(true);
    expect(comp.evaluate({ age: 25 })).toBe(false);
    expect(comp.evaluate({ age: 35 })).toBe(false);
  });

  test('evaluates != operator correctly', () => {
    const comp = new Comparison('age', '!=', 30);
    expect(comp.evaluate({ age: 25 })).toBe(true);
    expect(comp.evaluate({ age: 30 })).toBe(false);
    expect(comp.evaluate({ age: 35 })).toBe(true);
  });

  test('evaluates > operator correctly', () => {
    const comp = new Comparison('age', '>', 18);
    expect(comp.evaluate({ age: 20 })).toBe(true);
    expect(comp.evaluate({ age: 15 })).toBe(false);
    expect(comp.evaluate({ age: 18 })).toBe(false);
  });

  test('evaluates < operator correctly', () => {
    const comp = new Comparison('age', '<', 65);
    expect(comp.evaluate({ age: 60 })).toBe(true);
    expect(comp.evaluate({ age: 70 })).toBe(false);
    expect(comp.evaluate({ age: 65 })).toBe(false);
  });

  test('evaluates >= operator correctly', () => {
    const comp = new Comparison('age', '>=', 18);
    expect(comp.evaluate({ age: 18 })).toBe(true);
    expect(comp.evaluate({ age: 20 })).toBe(true);
    expect(comp.evaluate({ age: 15 })).toBe(false);
  });

  test('evaluates <= operator correctly', () => {
    const comp = new Comparison('age', '<=', 65);
    expect(comp.evaluate({ age: 65 })).toBe(true);
    expect(comp.evaluate({ age: 70 })).toBe(false);
    expect(comp.evaluate({ age: 60 })).toBe(true);
  });
  test('throws error if required data is undefined', () => {
    const comp = new Comparison('age', '==', 30);
    expect(() => comp.evaluate({})).toThrow();
    expect(() => comp.evaluate({ age: 30 })).not.toThrow();
    expect(() => comp.evaluate({ country: 'Canada' })).toThrow();
  });

  test('throws error if value is undefined', () => {
    const comp = new Comparison('age', '==');
    expect(() => comp.evaluate({ age: 4 })).toThrow();
    const comp2 = new Comparison('', '==', 4);
    expect(() => comp2.evaluate({ age: 4 })).toThrow();
  });

  test('throws error if operator is invalid', () => {
    const comp = new Comparison('age', 'invalid' as ComparisonOperator, 30);
    expect(() => comp.evaluate({ age: 30 })).toThrow();
  });
});

describe('ComparisonGroup', () => {
  test('evaluates && operator correctly with all true', () => {
    const group = new ComparisonGroup(
      [
        { type: 'comparison', key: 'age', operator: '>=', value: 18 },
        { type: 'comparison', key: 'name', operator: '==', value: 'John' },
      ],
      '&&',
    );
    expect(group.evaluate({ age: 20, name: 'John' })).toBe(true);
  });

  test('evaluates && operator correctly with one false', () => {
    const group = new ComparisonGroup(
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
    const group = new ComparisonGroup(
      [
        { type: 'comparison', key: 'age', operator: '>', value: 65 },
        { type: 'comparison', key: 'name', operator: '==', value: 'John' },
      ],
      '||',
    );
    expect(group.evaluate({ age: 20, name: 'John' })).toBe(true);
    expect(group.evaluate({ age: 70, name: 'Jane' })).toBe(true);
  });

  test('throw error for empty comparison group', () => {
    const group = new ComparisonGroup([], '&&');
    expect(() => group.evaluate({})).toThrow();

    const group2 = new ComparisonGroup([], '||');
    expect(() => group2.evaluate({})).toThrow();
  });

  test('returns false if no conditions match in || operator', () => {
    const group = new ComparisonGroup(
      [
        { type: 'comparison', key: 'age', operator: '>', value: 65 },
        { type: 'comparison', key: 'name', operator: '==', value: 'Jane' },
      ],
      '||',
    );
    expect(group.evaluate({ age: 20, name: 'John' })).toBe(false);
  });

  test('handles nested ComparisonGroup correctly', () => {
    const nestedGroup = new ComparisonGroup(
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
});
