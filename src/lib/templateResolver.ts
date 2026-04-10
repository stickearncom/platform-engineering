import type { QuestionTemplate, ReviewType } from '@/shared/types';

/**
 * Resolve the best matching template for a given review context.
 * Rules:
 * 1. Exact match (reviewType + reviewerRoleId + revieweeRoleId)
 * 2. Wildcard fallback (null roles)
 * 3. Pick highest priority among matches
 */
export function resolveTemplate(
  reviewType: ReviewType,
  reviewerRoleId: string | null,
  revieweeRoleId: string | null,
  templates: QuestionTemplate[],
): QuestionTemplate | null {
  const typeMatches = templates.filter((t) => t.reviewType === reviewType);

  // 1. Exact match
  const exact = typeMatches.find(
    (t) => t.reviewerRoleId === reviewerRoleId && t.revieweeRoleId === revieweeRoleId,
  );
  if (exact) return exact;

  // 2. Wildcard: templates where both roles are null
  const wildcards = typeMatches.filter(
    (t) => t.reviewerRoleId === null && t.revieweeRoleId === null,
  );

  // 3. Partial wildcard - one role matches, other is null
  const partial = typeMatches.filter(
    (t) =>
      (t.reviewerRoleId === reviewerRoleId && t.revieweeRoleId === null) ||
      (t.reviewerRoleId === null && t.revieweeRoleId === revieweeRoleId),
  );

  const candidates = [...partial, ...wildcards];
  if (candidates.length === 0) return null;

  // Sort by priority descending, pick highest
  return candidates.sort((a, b) => b.priority - a.priority)[0];
}
