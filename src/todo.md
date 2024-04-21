- [ ] convert all errors to custom errors with descriptive names foreasier error
      handling
- [ ] create and test converters for:
  - [ ] canvas/obsidian -> DecisionTreeJson
  - [ ] DecisionTreeJson -> obsidian/canvas
  - [ ] (?) DecisionTreeJson -> Form
  - [ ] (?) CustomVisualTreeCreator -> DecisionTreeJson
- [ ] complete testing coverage for all cases
- [ ] create a validator for SingleComparison, GroupComparison, and DecisionTree
      to allow us to move some error handling out of the evaluation code
  - code responsible for evaluating trees and comparisons should not have to
    worry about malformed data
- [ ] improve readability and maintainability
- [ ] optimize performance of critical sections
- [ ] implement logging and error handling mechanisms
- [ ] write documentation for the codebase
