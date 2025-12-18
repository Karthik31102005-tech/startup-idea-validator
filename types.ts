
export interface StartupInput {
  idea: string;
  targetUsers: string;
  alternatives: string;
  reasoning: string;
  background: string;
}

export interface ScoreItem {
  dimension: string;
  score: number;
}

export interface EvaluationResult {
  scores: ScoreItem[];
  overallVerdict: 'PROCEED' | 'PIVOT' | 'DROP';
  brutalTruth: string;
  singleBiggestFlaw: string;
  smartPivots: string[];
  validationPlan: {
    week: number;
    actions: string;
    focus: string;
  }[];
}
