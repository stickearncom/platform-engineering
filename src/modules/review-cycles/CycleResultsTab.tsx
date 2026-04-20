import { useState, useMemo } from 'react';
import { ChevronDown, ChevronRight, MessageSquare } from 'lucide-react';
import { useReviewStore } from '@/shared/stores/reviewStore';
import { useTemplateStore } from '@/shared/stores/templateStore';
import { useEmployeeStore } from '@/shared/stores/employeeStore';
import { calculateCycleResults } from '@/lib/scoreCalculator';
import { Badge } from '@/components/ui/badge';
import type { ReviewCycle, ReviewType } from '@/shared/types';

const REVIEW_TYPE_LABELS: Record<ReviewType, string> = { self: 'Self', peer: 'Peer', manager: 'Manager', subordinate: 'Subordinate' };

const CAT_SHORT: Record<string, string> = {
  gc1: 'Delivery',
  gc2: 'Tech Quality',
  gc3: 'Collab',
  gc4: 'Ownership',
  gc5: 'Growth',
};

function scoreColorClass(val: number | null): string {
  if (val == null) return 'text-muted-foreground';
  if (val < 2.0) return 'bg-red-50 text-red-600 font-medium';
  if (val < 3.0) return 'bg-amber-50 text-amber-700 font-medium';
  if (val < 3.8) return 'bg-emerald-50 text-emerald-700 font-medium';
  return 'bg-indigo-50 text-indigo-700 font-semibold';
}

function finalScoreColorClass(val: number | null): string {
  if (val == null) return 'text-muted-foreground';
  if (val < 2.0) return 'bg-red-100 text-red-700 font-bold';
  if (val < 3.0) return 'bg-amber-100 text-amber-800 font-bold';
  if (val < 3.8) return 'bg-emerald-100 text-emerald-800 font-bold';
  return 'bg-indigo-100 text-indigo-800 font-bold';
}

function fmt(val: number | null | undefined): string {
  if (val == null) return '—';
  return val.toFixed(2);
}

interface Props {
  cycle: ReviewCycle;
}

export function CycleResultsTab({ cycle }: Props) {
  const { assignments, answers } = useReviewStore();
  const { questions, goalCategories } = useTemplateStore();
  const { employees } = useEmployeeStore();
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const employeeNames = useMemo(
    () => Object.fromEntries(employees.map((e) => [e.id, e.name])),
    [employees],
  );

  const results = useMemo(
    () =>
      calculateCycleResults(
        cycle.id,
        cycle.activeReviewTypes,
        assignments,
        answers,
        questions,
        goalCategories,
        employeeNames,
      ),
    [cycle, assignments, answers, questions, goalCategories, employeeNames],
  );

  const cycleAssignments = assignments.filter((a) => a.cycleId === cycle.id);
  const submittedTotal = cycleAssignments.filter((a) => a.status === 'submitted').length;
  const completionPct =
    cycleAssignments.length > 0
      ? Math.round((submittedTotal / cycleAssignments.length) * 100)
      : 0;

  if (results.length === 0) {
    return (
      <div className="p-6 text-center text-muted-foreground py-16">
        <p className="text-sm">No assignments found for this cycle.</p>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-4">
      {/* Stats bar */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3 flex-wrap">
          <span className="text-sm text-muted-foreground">
            Completion:{' '}
            <span className="font-semibold text-foreground">
              {submittedTotal}/{cycleAssignments.length}
            </span>{' '}
            ({completionPct}%)
          </span>
          <div className="w-32 h-1.5 bg-zinc-100 rounded-full overflow-hidden">
            <div
              className="h-full rounded-full bg-indigo-500"
              style={{ width: `${completionPct}%` }}
            />
          </div>
        </div>
        <div className="flex gap-1.5">
          {cycle.activeReviewTypes.map((t) => (
            <Badge key={t} variant="outline" className="text-xs capitalize">
              {t}
            </Badge>
          ))}
        </div>
      </div>

      {/* Results table */}
      <div className="overflow-x-auto rounded-lg border border-border">
        <table className="w-full text-sm border-collapse">
          <thead>
            <tr className="bg-zinc-50 border-b border-border">
              <th className="text-left px-4 py-2.5 font-semibold text-foreground w-44 min-w-[11rem]">
                Employee
              </th>
              {goalCategories.map((cat) => (
                <th
                  key={cat.id}
                  className="text-center px-3 py-2.5 font-semibold text-foreground whitespace-nowrap"
                  title={cat.name}
                >
                  {CAT_SHORT[cat.id] ?? cat.name}
                </th>
              ))}
              <th className="text-center px-4 py-2.5 font-semibold text-foreground whitespace-nowrap">
                Final Score
              </th>
            </tr>
          </thead>
          <tbody>
            {results.map((r) => {
              const emp = employees.find((e) => e.id === r.employeeId);
              const role = emp ? employees.find((e) => e.id === r.employeeId) : null;
              void role;
              const isExpanded = expandedId === r.employeeId;
              const hasEssays = r.essayAnswers.length > 0;

              return (
                <>
                  <tr
                    key={r.employeeId}
                    className="border-b border-border hover:bg-zinc-50/60 cursor-pointer transition-colors"
                    onClick={() => setExpandedId(isExpanded ? null : r.employeeId)}
                  >
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        {isExpanded ? (
                          <ChevronDown className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
                        ) : (
                          <ChevronRight className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
                        )}
                        <div>
                          <p className="font-medium text-foreground leading-none">{emp?.name ?? r.employeeId}</p>
                          <p className="text-xs text-muted-foreground mt-0.5">
                            {r.submittedCount}/{r.totalCount} submitted
                          </p>
                        </div>
                        {hasEssays && (
                          <MessageSquare className="h-3 w-3 text-indigo-400 ml-auto shrink-0" aria-label="Has essay answers" />
                        )}
                      </div>
                    </td>
                    {r.categoryRows.map((cat) => (
                      <td
                        key={cat.categoryId}
                        className={`text-center px-3 py-3 ${scoreColorClass(cat.weighted)}`}
                      >
                        <span className="rounded px-1.5 py-0.5">{fmt(cat.weighted)}</span>
                      </td>
                    ))}
                    <td className={`text-center px-4 py-3`}>
                      <span className={`rounded-md px-2 py-1 text-sm ${finalScoreColorClass(r.finalScore)}`}>
                        {fmt(r.finalScore)}
                      </span>
                    </td>
                  </tr>

                  {isExpanded && (
                    <tr key={`${r.employeeId}-expanded`} className="border-b border-border bg-zinc-50/40">
                      <td colSpan={goalCategories.length + 2} className="px-6 py-5">
                        <div className="space-y-5">
                          {/* Score breakdown by review type */}
                          <div>
                            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-2">
                              Score Breakdown by Review Type
                            </p>
                            <div className="overflow-x-auto">
                              <table className="text-xs border-collapse border border-border rounded-lg overflow-hidden w-full max-w-2xl">
                                <thead>
                                  <tr className="bg-zinc-100">
                                    <th className="text-left px-3 py-2 border-b border-r border-border font-semibold">Category</th>
                                    {cycle.activeReviewTypes.map((rt) => (
                                      <th key={rt} className="text-center px-3 py-2 border-b border-r border-border font-semibold">
                                        {REVIEW_TYPE_LABELS[rt]}
                                      </th>
                                    ))}
                                    <th className="text-center px-3 py-2 border-b border-border font-semibold text-indigo-700">Weighted</th>
                                  </tr>
                                </thead>
                                <tbody>
                                  {r.categoryRows.map((cat) => (
                                    <tr key={cat.categoryId} className="border-b border-border last:border-0">
                                      <td className="px-3 py-2 border-r border-border font-medium text-foreground">
                                        {cat.categoryName}
                                      </td>
                                      {cycle.activeReviewTypes.map((rt) => (
                                        <td key={rt} className={`text-center px-3 py-2 border-r border-border ${scoreColorClass(cat.byType[rt] ?? null)}`}>
                                          {fmt(cat.byType[rt] ?? null)}
                                        </td>
                                      ))}
                                      <td className={`text-center px-3 py-2 font-semibold ${scoreColorClass(cat.weighted)}`}>
                                        {fmt(cat.weighted)}
                                      </td>
                                    </tr>
                                  ))}
                                  <tr className="bg-zinc-100 border-t-2 border-border">
                                    <td className="px-3 py-2 border-r border-border font-bold text-foreground">Final Score</td>
                                    {cycle.activeReviewTypes.map((rt) => (
                                      <td key={rt} className="border-r border-border" />
                                    ))}
                                    <td className={`text-center px-3 py-2 rounded ${finalScoreColorClass(r.finalScore)}`}>
                                      {fmt(r.finalScore)}
                                    </td>
                                  </tr>
                                </tbody>
                              </table>
                            </div>
                          </div>

                          {/* Essay answers */}
                          {r.essayAnswers.length > 0 && (
                            <div>
                              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-3">
                                Written Feedback
                              </p>
                              <div className="space-y-2.5">
                                {r.essayAnswers.map((essay, i) => (
                                  <div key={i} className="bg-white border border-border rounded-lg px-4 py-3">
                                    <div className="flex items-center gap-2 mb-1.5">
                                      <Badge
                                        variant="outline"
                                        className={`text-[10px] capitalize ${
                                          essay.reviewType === 'self'
                                            ? 'border-indigo-200 text-indigo-600'
                                            : essay.reviewType === 'manager'
                                            ? 'border-violet-200 text-violet-600'
                                            : 'border-zinc-200 text-zinc-500'
                                        }`}
                                      >
                                        {essay.reviewType === 'self'
                                          ? 'Self'
                                          : essay.reviewType === 'manager'
                                          ? `Manager: ${essay.reviewerName}`
                                          : 'Peer (anonymous)'}
                                      </Badge>
                                      <p className="text-xs text-muted-foreground italic flex-1">{essay.questionText}</p>
                                    </div>
                                    <p className="text-sm text-foreground leading-relaxed">{essay.textValue}</p>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                      </td>
                    </tr>
                  )}
                </>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Score legend */}
      <div className="flex items-center gap-4 text-xs text-muted-foreground pt-1">
        <span className="font-medium">Score:</span>
        <span className="flex items-center gap-1.5">
          <span className="inline-block w-2.5 h-2.5 rounded-sm bg-red-100" /> &lt; 2.0 Needs Improvement
        </span>
        <span className="flex items-center gap-1.5">
          <span className="inline-block w-2.5 h-2.5 rounded-sm bg-amber-100" /> 2.0–2.9 On Track
        </span>
        <span className="flex items-center gap-1.5">
          <span className="inline-block w-2.5 h-2.5 rounded-sm bg-emerald-100" /> 3.0–3.7 Exceeds
        </span>
        <span className="flex items-center gap-1.5">
          <span className="inline-block w-2.5 h-2.5 rounded-sm bg-indigo-100" /> ≥ 3.8 Outstanding
        </span>
        <span className="ml-auto italic">Click any row to expand breakdown & written feedback.</span>
      </div>
    </div>
  );
}
