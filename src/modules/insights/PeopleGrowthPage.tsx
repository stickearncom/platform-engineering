import { useState, useMemo } from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  ReferenceLine,
  Cell,
} from 'recharts';
import { useReviewStore } from '@/shared/stores/reviewStore';
import { useTemplateStore } from '@/shared/stores/templateStore';
import { useEmployeeStore } from '@/shared/stores/employeeStore';
import { calculateCycleResults } from '@/lib/scoreCalculator';
import { Badge } from '@/components/ui/badge';

// ── helpers ───────────────────────────────────────────────────────────────────

const CAT_SHORT: Record<string, string> = {
  gc1: 'Delivery',
  gc2: 'Tech Quality',
  gc3: 'Collab',
  gc4: 'Ownership',
  gc5: 'Growth',
};

function scoreColorClass(val: number | null): string {
  if (val == null) return 'bg-muted/40 text-muted-foreground';
  if (val < 2.0) return 'bg-red-50 text-red-700';
  if (val < 3.0) return 'bg-amber-50 text-amber-700';
  if (val < 3.8) return 'bg-emerald-50 text-emerald-700';
  return 'bg-indigo-50 text-indigo-700';
}

function fmt(v: number | null) {
  return v != null ? v.toFixed(2) : '–';
}

// ── cycle selector ────────────────────────────────────────────────────────────

function CycleSelect({
  cycles,
  value,
  onChange,
}: {
  cycles: { id: string; name: string }[];
  value: string;
  onChange: (id: string) => void;
}) {
  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="h-8 text-[13px] rounded-lg border border-border bg-white px-3 text-foreground focus:outline-none focus:ring-1 focus:ring-indigo-500"
    >
      {cycles.map((c) => (
        <option key={c.id} value={c.id}>
          {c.name}
        </option>
      ))}
    </select>
  );
}

// ── score heatmap ─────────────────────────────────────────────────────────────

function ScoreHeatmap({
  results,
  categoryIds,
}: {
  results: ReturnType<typeof calculateCycleResults>;
  categoryIds: string[];
}) {
  if (results.length === 0) {
    return (
      <div className="text-[13px] text-muted-foreground py-8 text-center">
        No submitted reviews for this cycle yet.
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-[13px]">
        <thead>
          <tr className="bg-muted/40 border-b border-border">
            <th className="text-left px-4 py-2.5 font-medium text-muted-foreground min-w-[140px]">
              Employee
            </th>
            {categoryIds.map((cid) => (
              <th key={cid} className="text-center px-3 py-2.5 font-medium text-muted-foreground">
                {CAT_SHORT[cid] ?? cid}
              </th>
            ))}
            <th className="text-center px-3 py-2.5 font-medium text-muted-foreground">
              Final Score
            </th>
          </tr>
        </thead>
        <tbody>
          {results.map((r) => (
            <tr key={r.employeeId} className="border-b border-border last:border-0">
              <td className="px-4 py-2.5 font-medium text-foreground">{r.employeeId}</td>
              {r.categoryRows.map((cat) => (
                <td
                  key={cat.categoryId}
                  className={`px-3 py-2.5 text-center font-semibold rounded-sm ${scoreColorClass(cat.weighted)}`}
                >
                  {fmt(cat.weighted)}
                </td>
              ))}
              <td
                className={`px-3 py-2.5 text-center font-bold ${scoreColorClass(r.finalScore)}`}
              >
                {fmt(r.finalScore)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

// ── self vs peer chart tooltip ────────────────────────────────────────────────

function ComparisonTooltip({
  active,
  payload,
  label,
}: {
  active?: boolean;
  payload?: { name: string; value: number | null; color: string }[];
  label?: string;
}) {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-white rounded-lg border border-border shadow-md p-3 text-[12px] space-y-1">
      <p className="font-semibold text-foreground mb-1">{label}</p>
      {payload.map((p) => (
        <div key={p.name} className="flex items-center gap-2">
          <span className="inline-block h-2 w-2 rounded-full" style={{ background: p.color }} />
          <span className="text-muted-foreground">{p.name}:</span>
          <span className="font-medium">{p.value != null ? p.value.toFixed(2) : '–'}</span>
        </div>
      ))}
    </div>
  );
}

// ── page ──────────────────────────────────────────────────────────────────────

export function PeopleGrowthPage() {
  const { reviewCycles, assignments, answers } = useReviewStore();
  const { questions, goalCategories } = useTemplateStore();
  const { employees } = useEmployeeStore();

  const [selectedCycleId, setSelectedCycleId] = useState(reviewCycles[0]?.id ?? '');
  const selectedCycle = reviewCycles.find((c) => c.id === selectedCycleId);

  const employeeNames = useMemo(
    () => Object.fromEntries(employees.map((e) => [e.id, e.name])),
    [employees],
  );

  // Full cycle results (all active review types)
  const results = useMemo(() => {
    if (!selectedCycle) return [];
    return calculateCycleResults(
      selectedCycleId,
      selectedCycle.activeReviewTypes,
      assignments,
      answers,
      questions,
      goalCategories,
      employeeNames,
    );
  }, [selectedCycleId, selectedCycle, assignments, answers, questions, goalCategories, employeeNames]);

  // Replace internal employeeId with name
  const namedResults = useMemo(
    () => results.map((r) => ({ ...r, employeeId: employeeNames[r.employeeId] ?? r.employeeId })),
    [results, employeeNames],
  );

  // Category order from goalCategories
  const categoryIds = goalCategories.map((c) => c.id);

  // Self vs Peer comparison data
  const comparisonData = useMemo(() => {
    if (!selectedCycle) return [];
    const scoreQuestionIds = new Set(
      questions.filter((q) => q.type === 'score').map((q) => q.id),
    );

    return employees
      .filter((e) => {
        const revieweeAssignments = assignments.filter(
          (a) => a.cycleId === selectedCycleId && a.revieweeId === e.id,
        );
        return revieweeAssignments.length > 0;
      })
      .map((e) => {
        const cycleAssignments = assignments.filter(
          (a) => a.cycleId === selectedCycleId && a.revieweeId === e.id,
        );

        function scoreForType(type: 'self' | 'peer' | 'manager') {
          const submitted = cycleAssignments.filter(
            (a) => a.reviewType === type && a.status === 'submitted',
          );
          const scores = submitted.flatMap((a) =>
            answers
              .filter((ans) => ans.assignmentId === a.id && ans.scoreValue != null)
              .filter((ans) => scoreQuestionIds.has(ans.questionId))
              .map((ans) => ans.scoreValue as number),
          );
          return scores.length > 0 ? scores.reduce((s, n) => s + n, 0) / scores.length : null;
        }

        const selfScore = scoreForType('self');
        const peerScore = scoreForType('peer');

        if (selfScore == null && peerScore == null) return null;
        return { name: employeeNames[e.id] ?? e.id, self: selfScore, peer: peerScore };
      })
      .filter(Boolean) as { name: string; self: number | null; peer: number | null }[];
  }, [selectedCycleId, selectedCycle, assignments, answers, questions, employees, employeeNames]);

  return (
    <div className="p-6 space-y-6 max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <h2 className="text-[20px] font-bold text-foreground">People Growth</h2>
          <p className="text-[13px] text-muted-foreground mt-0.5">
            Review score breakdown per engineer · per goal category
          </p>
        </div>
        <CycleSelect cycles={reviewCycles} value={selectedCycleId} onChange={setSelectedCycleId} />
      </div>

      {/* Score Heatmap */}
      <div className="bg-white rounded-xl border border-border overflow-hidden">
        <div className="px-5 py-3 border-b border-border flex items-center justify-between">
          <div>
            <h3 className="text-[13px] font-semibold text-foreground">Score Heatmap</h3>
            <p className="text-[11.5px] text-muted-foreground mt-0.5">
              Weighted score per goal category · {selectedCycle?.name}
            </p>
          </div>
          <div className="flex items-center gap-2 text-[11px]">
            <span className="px-2 py-0.5 rounded bg-red-50 text-red-700 font-medium">&lt;2.0</span>
            <span className="px-2 py-0.5 rounded bg-amber-50 text-amber-700 font-medium">2.0–2.9</span>
            <span className="px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 font-medium">3.0–3.7</span>
            <span className="px-2 py-0.5 rounded bg-indigo-50 text-indigo-700 font-medium">≥3.8</span>
          </div>
        </div>
        <ScoreHeatmap results={namedResults} categoryIds={categoryIds} />
      </div>

      {/* Self vs Peer Comparison */}
      <div className="bg-white rounded-xl border border-border p-5">
        <div className="mb-4">
          <h3 className="text-[14px] font-semibold text-foreground">Self vs Peer Score</h3>
          <p className="text-[12px] text-muted-foreground mt-0.5">
            Overall average score comparison — Self assessment vs Peer review
          </p>
        </div>

        {comparisonData.length === 0 ? (
          <p className="text-[13px] text-muted-foreground py-6 text-center">
            No data available for the selected cycle.
          </p>
        ) : (
          <ResponsiveContainer width="100%" height={Math.max(220, comparisonData.length * 64)}>
            <BarChart
              layout="vertical"
              data={comparisonData}
              margin={{ top: 0, right: 24, bottom: 0, left: 80 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" horizontal={false} />
              <XAxis
                type="number"
                domain={[0, 4]}
                ticks={[0, 1, 2, 3, 4]}
                tick={{ fontSize: 12 }}
                tickLine={false}
                axisLine={false}
              />
              <YAxis
                type="category"
                dataKey="name"
                tick={{ fontSize: 13 }}
                tickLine={false}
                axisLine={false}
                width={76}
              />
              <Tooltip content={<ComparisonTooltip />} />
              <Legend wrapperStyle={{ fontSize: 12, paddingTop: 8 }} />
              <ReferenceLine
                x={2.8}
                stroke="#ef4444"
                strokeDasharray="4 4"
                label={{ value: 'At-Risk', fontSize: 10, fill: '#ef4444', position: 'insideTopRight' }}
              />
              <Bar dataKey="self" name="Self" fill="#a5b4fc" radius={[0, 3, 3, 0]} barSize={14}>
                {comparisonData.map((d, i) => (
                  <Cell key={i} fill={d.self == null ? '#e2e8f0' : '#a5b4fc'} />
                ))}
              </Bar>
              <Bar dataKey="peer" name="Peer" fill="#6366f1" radius={[0, 3, 3, 0]} barSize={14}>
                {comparisonData.map((d, i) => (
                  <Cell key={i} fill={d.peer == null ? '#e2e8f0' : '#6366f1'} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        )}
      </div>

      {/* Active review types note */}
      {selectedCycle && (
        <div className="flex items-center gap-2 text-[12px] text-muted-foreground">
          <span>Active review types in this cycle:</span>
          {selectedCycle.activeReviewTypes.map((rt: string) => (
            <Badge key={rt} variant="secondary" className="text-[11px]">
              {rt.charAt(0).toUpperCase() + rt.slice(1)}
            </Badge>
          ))}
        </div>
      )}
    </div>
  );
}
