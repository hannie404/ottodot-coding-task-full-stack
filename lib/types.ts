export interface GeminiImagePart {
  base64: string;
  mimeType: string;
}

export interface GeminiTextPart {
  text: string;
}

export interface GeminiInlineDataPart {
  inlineData: {
    mimeType: string;
    data: string;
  };
}

export type GeminiContentPart = GeminiTextPart | GeminiInlineDataPart;

// Enhanced types for optional features
export type Difficulty = 'easy' | 'medium' | 'hard';
export type ProblemType = 'addition' | 'subtraction' | 'multiplication' | 'division' | 'mixed' | 'general';

export interface MathProblem {
  problem_text: string;
  final_answer: number;
  difficulty?: Difficulty;
  problem_type?: ProblemType;
  hint_text?: string;
  solution_steps?: string[];
}

export interface ProblemSession {
  id: string;
  created_at: string;
  problem_text: string;
  correct_answer: number;
  difficulty: Difficulty;
  problem_type: ProblemType;
  hint_text?: string;
  solution_steps?: string[];
}

export interface Submission {
  id: string;
  session_id: string;
  user_answer: number;
  is_correct: boolean;
  feedback_text: string;
  created_at: string;
  time_spent_seconds?: number;
  hints_used: number;
}

export interface UserStats {
  id: string;
  user_id: string;
  total_problems: number;
  correct_answers: number;
  total_score: number;
  streak: number;
  best_streak: number;
  last_activity: string;
  difficulty_stats: {
    [key in Difficulty]: {
      total: number;
      correct: number;
    };
  };
  type_stats: {
    [key in ProblemType]: number;
  };
}
