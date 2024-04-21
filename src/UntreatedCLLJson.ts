import { DecisionTreeJson, TreeData } from './DecisionTree/types';

export const UntreatedCLLJson: DecisionTreeJson = {
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
      title: 'Symptomatic',
      value: '',
    },
    {
      node_id: 3,
      type: 'decision',
      title: 'Mutated IgHv',
      value: '',
    },
    {
      node_id: 4,
      type: 'end',
      title: 'Treatment Plan A',
      value: 'A',
    },
    {
      node_id: 5,
      type: 'end',
      title: 'Treatment Plan B',
      value: 'B',
    },
    {
      node_id: 6,
      type: 'decision',
      title: 'Adverse Genetic Markers',
      value: '',
    },
    {
      node_id: 7,
      type: 'end',
      title: 'Treatment Plan C',
      value: 'C',
    },
    {
      node_id: 8,
      type: 'end',
      title: 'Treatment Plan D',
      value: 'D',
    },
    {
      node_id: 9,
      type: 'end',
      title: 'Active Surveillance',
      value: 'Active Surveillance',
    },
  ],
  edges: [
    {
      edge_id: 1,
      fromNode: 1,
      toNode: 2,
      title: 'symptomatic == true',
      comparison: {
        type: 'comparison',
        key: 'symptomatic',
        operator: '==',
        value: true,
      },
    },
    {
      edge_id: 2,
      fromNode: 2,
      toNode: 3,
      title: 'mutatedIgHv == true',
      comparison: {
        type: 'comparison',
        key: 'mutatedIgHv',
        operator: '==',
        value: true,
      },
    },
    {
      edge_id: 3,
      fromNode: 3,
      toNode: 4,
      title: 'age >= 18 && age <= 70 && CIRS < 6',
      comparison: {
        type: 'comparisonGroup',
        logicalOperator: '&&',
        comparisons: [
          {
            type: 'comparison',
            key: 'age',
            operator: '>=',
            value: 18,
          },
          {
            type: 'comparison',
            key: 'age',
            operator: '<=',
            value: 70,
          },
          {
            type: 'comparison',
            key: 'CIRS',
            operator: '<',
            value: 6,
          },
        ],
      },
    },
    {
      edge_id: 4,
      fromNode: 3,
      toNode: 5,
      title: 'age > 70 || CIRS >= 6',
      comparison: {
        type: 'comparisonGroup',
        logicalOperator: '||',
        comparisons: [
          {
            type: 'comparison',
            key: 'age',
            operator: '>',
            value: 70,
          },
          {
            type: 'comparison',
            key: 'CIRS',
            operator: '>=',
            value: 6,
          },
        ],
      },
    },
    {
      edge_id: 5,
      fromNode: 2,
      toNode: 6,
      title: 'adverseGeneticMarkers == true',
      comparison: {
        type: 'comparison',
        key: 'adverseGeneticMarkers',
        operator: '==',
        value: true,
      },
    },
    {
      edge_id: 6,
      fromNode: 6,
      toNode: 7,
      title: '_17pDeletion == true || TP53Mutation == true',
      comparison: {
        type: 'comparisonGroup',
        logicalOperator: '||',
        comparisons: [
          {
            type: 'comparison',
            key: '_17pDeletion',
            operator: '==',
            value: true,
          },
          {
            type: 'comparison',
            key: 'TP53Mutation',
            operator: '==',
            value: true,
          },
        ],
      },
    },
    {
      edge_id: 7,
      fromNode: 6,
      toNode: 8,
      title: 'mutatedIgHv == false',
      comparison: {
        type: 'comparison',
        key: 'mutatedIgHv',
        operator: '==',
        value: false,
      },
    },
    {
      edge_id: 8,
      fromNode: 1,
      toNode: 9,
      title: 'asymptomatic == true',
      comparison: {
        type: 'comparison',
        key: 'asymptomatic',
        operator: '==',
        value: true,
      },
    },
  ],
};

export const ActiveSurveillanceData: TreeData = {
  symptomatic: false,
  asymptomatic: true,
  mutatedIgHv: true,
  adverseGeneticMarkers: false,
  age: 85,
  CIRS: 7,
  _17pDeletion: false,
  TP53Mutation: false,
};

export const TreatmentPlanAData: TreeData = {
  symptomatic: true,
  asymptomatic: false,
  mutatedIgHv: true,
  adverseGeneticMarkers: false,
  age: 55,
  CIRS: 2,
  _17pDeletion: false,
  TP53Mutation: false,
};

export const TreatmentPlanBData: TreeData = {
  symptomatic: true,
  asymptomatic: false,
  mutatedIgHv: true,
  adverseGeneticMarkers: false,
  age: 75,
  CIRS: 8,
  _17pDeletion: false,
  TP53Mutation: false,
};

export const TreatmentPlanCData: TreeData = {
  symptomatic: true,
  asymptomatic: false,
  mutatedIgHv: false,
  adverseGeneticMarkers: true,
  age: 55,
  CIRS: 2,
  _17pDeletion: true,
  TP53Mutation: false,
};

export const TreatmentPlanDData: TreeData = {
  symptomatic: true,
  asymptomatic: false,
  mutatedIgHv: false,
  adverseGeneticMarkers: true,
  age: 55,
  CIRS: 2,
  _17pDeletion: false,
  TP53Mutation: false,
};

export const MissingData: TreeData = {
  mutatedIgHv: false,
  adverseGeneticMarkers: true,
  age: 55,
  CIRS: 2,
  _17pDeletion: false,
  TP53Mutation: false,
};
