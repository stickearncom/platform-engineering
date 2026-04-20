export interface Role {
  id: string;
  name: string;
}

export interface Division {
  id: string;
  name: string;
}

export interface Team {
  id: string;
  name: string;
  divisionId: string | null;
}

export interface Employee {
  id: string;
  name: string;
  email: string;
  roleId: string;
  teamId: string;
  managerId: string | null;
}

export type ReviewType = 'peer' | 'self' | 'manager' | 'subordinate';
export type AssignmentStatus = 'pending' | 'submitted';
export type QuestionType = 'score' | 'essay';
export type ScoreValue = 1 | 2 | 3 | 4 | 5 | 6;

export interface GoalCategory {
  id: string;
  name: string;
  slug: string;
  /** null = universal / cross-cutting (applies to all review types) */
  reviewType: ReviewType | null;
  description: string | null;
}

export interface ReviewCycle {
  id: string;
  name: string;
  startDate: string;
  endDate: string;
  activeReviewTypes: ReviewType[];
}

export interface ReviewAssignment {
  id: string;
  reviewerId: string;
  revieweeId: string;
  reviewType: ReviewType;
  /** null in Opsi A (Manager Assigns) — used in Fase 2 only */
  ruleId: string | null;
  cycleId: string;
  status: AssignmentStatus;
  dueDate: string;
}

export interface Question {
  id: string;
  /** Routes to the correct question set — maps to goal_categories.review_type in ERD v6 */
  reviewType: ReviewType;
  categoryId: string | null;
  type: QuestionType;
  text: string;
  order: number;
}

/** Normalized score hint anchors — ERD v6: score_hints table */
export interface ScoreHint {
  id: string;
  questionId: string;
  scoreValue: ScoreValue;
  anchorText: string;
}

/** Role/specialization-specific score hint examples — ERD v6: score_hint_examples table */
export interface ScoreHintExample {
  id: string;
  scoreHintId: string;
  roleId: string;
  exampleText: string;
}

export interface ReviewAnswer {
  id: string;
  assignmentId: string;
  questionId: string;
  /** 1–6 rating scale (matches company PA standard) */
  scoreValue: ScoreValue | null;
  textValue: string | null;
}
