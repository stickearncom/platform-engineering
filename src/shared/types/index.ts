export interface Role {
  id: string;
  name: string;
}

export interface Team {
  id: string;
  name: string;
}

export interface Employee {
  id: string;
  name: string;
  email: string;
  roleId: string;
  teamId: string;
  managerId: string | null;
}

export type ReviewType = 'peer' | 'self' | 'manager';
export type AssignmentStatus = 'pending' | 'submitted';
export type QuestionType = 'score' | 'essay';

export interface GoalCategory {
  id: string;
  name: string;
  slug: string;
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
  templateId: string;
  cycleId: string;
  status: AssignmentStatus;
  dueDate: string;
}

export interface QuestionTemplate {
  id: string;
  name: string;
  reviewType: ReviewType;
  reviewerRoleId: string | null;
  revieweeRoleId: string | null;
  priority: number;
}

export interface Question {
  id: string;
  templateId: string;
  categoryId: string | null;
  type: QuestionType;
  text: string;
  order: number;
}

export interface ReviewAnswer {
  id: string;
  assignmentId: string;
  questionId: string;
  scoreValue: number | null;
  textValue: string | null;
}
