/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
//disable linting and ts-check for this file
// eslint-disable-next-line
// @ts-nocheck

import { useState } from 'react';
import { DecisionTree } from './DecisionTree/DecisionTree/DecisionTree';
import { EvaluationResult } from './DecisionTree/types';
import { UntreatedCLLJson } from './UntreatedCLLJson';

function DecisionTreeForm() {
  const [formState, setFormState] = useState({
    symptomatic: false,
    asymptomatic: false,
    mutatedIgHv: false,
    adverseGeneticMarkers: false,
    age: '',
    CIRS: '',
    _17pDeletion: false,
    TP53Mutation: false,
  });

  const [decisionTreeResult, setDecisionTreeResult] =
    useState<EvaluationResult | null>(null);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormState((prevState) => ({
      ...prevState,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const decisionTree = new DecisionTree(
      UntreatedCLLJson.nodes,
      UntreatedCLLJson.edges,
    );
    const result = decisionTree.evaluate(formState);
    setDecisionTreeResult(result);
    decisionTree.printTree();
    decisionTree.printResult(result);
  };

  return (
    <div>
      <h1>Decision Tree Form</h1>
      <form onSubmit={handleSubmit} className="decision-tree-form">
        <div>
          <label htmlFor="symptomatic">Symptomatic:</label>
          <input
            type="checkbox"
            id="symptomatic"
            name="symptomatic"
            checked={formState.symptomatic}
            onChange={handleChange}
          />
        </div>
        <div>
          <label htmlFor="symptomatic">asymptomatic:</label>
          <input
            type="checkbox"
            id="asymptomatic"
            name="asymptomatic"
            checked={formState.asymptomatic}
            onChange={handleChange}
          />
        </div>
        <div>
          <label htmlFor="mutatedIgHv">Mutated IgHv:</label>
          <input
            type="checkbox"
            id="mutatedIgHv"
            name="mutatedIgHv"
            checked={formState.mutatedIgHv}
            onChange={handleChange}
          />
        </div>
        <div>
          <label htmlFor="adverseGeneticMarkers">
            Adverse Genetic Markers:
          </label>
          <input
            type="checkbox"
            id="adverseGeneticMarkers"
            name="adverseGeneticMarkers"
            checked={formState.adverseGeneticMarkers}
            onChange={handleChange}
          />
        </div>
        <div>
          <label htmlFor="age">Age:</label>
          <input
            type="number"
            id="age"
            name="age"
            value={formState.age}
            onChange={handleChange}
          />
        </div>
        <div>
          <label htmlFor="CIRS">CIRS:</label>
          <input
            type="number"
            id="CIRS"
            name="CIRS"
            value={formState.CIRS}
            onChange={handleChange}
          />
        </div>
        <div>
          <label htmlFor="_17pDeletion">17p Deletion:</label>
          <input
            type="checkbox"
            id="_17pDeletion"
            name="_17pDeletion"
            checked={formState._17pDeletion}
            onChange={handleChange}
          />
        </div>
        <div>
          <label htmlFor="TP53Mutation">TP53 Mutation:</label>
          <input
            type="checkbox"
            id="TP53Mutation"
            name="TP53Mutation"
            checked={formState.TP53Mutation}
            onChange={handleChange}
          />
        </div>
        <button type="submit">Evaluate</button>
      </form>

      {decisionTreeResult && (
        <div>
          <h2>Decision Tree Result</h2>
          <p>Value: {decisionTreeResult.value}</p>
          <p>Eval Path: {decisionTreeResult.evalPath}</p>
        </div>
      )}
    </div>
  );
}

export default DecisionTreeForm;
