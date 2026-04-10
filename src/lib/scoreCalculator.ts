import type { ReviewType, ReviewAnswer, ReviewAssignment, Question, GoalCategory } from '@/shared/types';

const BASE_WEIGHTS: Record<ReviewType, number> = { self: 0.2, peer: 0.3, manager: 0.5 };

export interface CategoryScoreRow {
  categoryId: string;
  categoryName: string;
  byType: Partial<Record<ReviewType, number | null>>;
  weighted: number | null;
}

export interface EssayAnswer {
  questionText: string;
  textValue: string;
  reviewType: ReviewType;
  reviewerName: string;
}

export interface RevieweeResult {
  employeeId: string;
  categoryRows: CategoryScoreRow[];
  finalScore: number | null;
  submittedCount: number;
  totalCount: number;
  essayAnswers: EssayAnswer[];
}

/**
 * For each reviewee in a cycle, compute weighted review scores per goal category.
 * Follows PRD §4.1.7 formula: renormalize weights for active review types.
 */
export function calculateCycleResults(
  cycleId: string,
  activeReviewTypes: ReviewType[],
  assignments: ReviewAssignment[],
  answers: ReviewAnswer[],
  questions: Question[],
  goalCategories: GoalCategory[],
  employeeNames: Record<string, string>,
): RevieweeResult[] {
  const cycleAssignments = assignments.filter((a) => a.cycleId === cycleId);
  const revieweeIds = [...new Set(cycleAssignments.map((a) => a.revieweeId))];

  // Effective weights — renormalize from active types only
  const totalBase = activeReviewTypes.reduce((s, t) => s + BASE_WEIGHTS[t], 0);
  const effWeights: Partial<Record<ReviewType, number>> = {};
  for (const t of activeReviewTypes) effWeights[t] = BASE_WEIGHTS[t] / totalBase;

  return revieweeIds.map((revieweeId) => {
    const reveeAssignments = cycleAssignments.filter((a) => a.revieweeId === revieweeId);
    const submittedAssignments = reveeAssignments.filter((a) => a.status === 'submitted');
    const submittedCount = submittedAssignments.length;
    const totalCount = reveeAssignments.length;

    // Score rows per category
    const categoryRows: CategoryScoreRow[] = goalCategories.map((cat) => {
      const byType: Partial<Record<ReviewType, number | null>> = {};

      for (const rt of activeReviewTypes) {
        const typeSubmitted = submittedAssignments.filter((a) => a.reviewType === rt);
        const scores: number[] = typeSubmitted.flatMap((a) =>
          answers
            .filter((ans) => ans.assignmentId === a.id && ans.scoreValue != null)
            .filter((ans) => {
              const q = questions.find((q) => q.id === ans.questionId);
              return q?.categoryId === cat.id && q?.type === 'score';
            })
            .map((ans) => ans.scoreValue as number),
        );
        byType[rt] = scores.length > 0 ? scores.reduce((s, n) => s + n, 0) / scores.length : null;
      }

      // Weighted from types that have data, renormalize partial
      const validTypes = activeReviewTypes.filter((t) => byType[t] != null);
      let weighted: number | null = null;
      if (validTypes.length > 0) {
        const validWeightSum = validTypes.reduce((s, t) => s + (effWeights[t] ?? 0), 0);
        weighted =
          validTypes.reduce((s, t) => s + (byType[t] as number) * (effWeights[t] ?? 0), 0) /
          validWeightSum;
      }

      return { categoryId: cat.id, categoryName: cat.name, byType, weighted };
    });

    // Final score = avg of all categories that have weighted data
    const validCats = categoryRows.filter((r) => r.weighted != null);
    const finalScore =
      validCats.length > 0
        ? validCats.reduce((s, r) => s + r.weighted!, 0) / validCats.length
        : null;

    // Collect essay answers
    const essayAnswers: EssayAnswer[] = submittedAssignments.flatMap((a) =>
      answers
        .filter((ans) => ans.assignmentId === a.id && ans.textValue)
        .map((ans) => {
          const q = questions.find((q) => q.id === ans.questionId);
          return {
            questionText: q?.text ?? ans.questionId,
            textValue: ans.textValue as string,
            reviewType: a.reviewType,
            reviewerName: employeeNames[a.reviewerId] ?? 'Unknown',
          };
        }),
    );

    return { employeeId: revieweeId, categoryRows, finalScore, submittedCount, totalCount, essayAnswers };
  });
}
