import { useMemo } from 'react';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
} from 'recharts';
import { TrendingUp, AlertTriangle, Star, Users } from 'lucide-react';
import { useReviewStore } from '@/shared/stores/reviewStore';
import { useTemplateStore } from '@/shared/stores/templateStore';
import { useEmployeeStore } from '@/shared/stores/employeeStore';
import { calculateCycleResults } from '@/lib/scoreCalculator';
import { useSprintStore, sprintPredictability, sprintCarryoverRate } from '@/shared/stores/sprintStore';

// ── helpers ───────────────────────────────────────────────────────────────────

function numAvg(vals: number[]) {
  return vals.length ? vals.reduce((a, b) => a + b, 0) / vals.length : 0;
}

const CAT_SHORT: Record<string, string> = {
  gc1: 'Delivery',
  gc2: 'Tech Quality',
  gc3: 'Collab',
  gc4: 'Ownership',
  gc5: 'Growth',
};

const AT_RISK_THRESHOLD = 2.8;

// ── stat card ─────────────────────────────────────────────────────────────────

function StatCard({
  label,
  value,
  sub,
  accentClass = 'text-foreground',
  icon,
}: {
  label: string;
  value: string | number;
  sub?: string;
  accentClass?: string;
  icon: React.ReactNode;
}) {
  return (
    <div className="bg-white rounded-xl border border-border p-5 flex items-start gap-3">
      <div className="h-10 w-10 rounded-lg bg-muted flex items-center justify-center shrink-0">
        {icon}
      </div>
      <div className="min-w-0">
        <p className="text-[11.5px] text-muted-foreground mb-0.5">{label}</p>
        <p className={`text-[26px] font-bold leading-none ${accentClass}`}>{value}</p>
        {sub && <p className="text-[11px] text-muted-foreground mt-1.5">{sub}</p>}
      </div>
    </div>
  );
}

// ── custom tooltip ────────────────────────────────────────────────────────────

function ChartTooltip({
  active,
  payload,
  label,
  suffix = '',
}: {
  active?: boolean;
  payload?: { name: string; value: number; color: string }[];
  label?: string;
  suffix?: string;
}) {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-white rounded-lg border border-border shadow-md p-3 text-[12px] space-y-1">
      <p className="font-semibold text-foreground mb-1">{label}</p>
      {payload.map((p) => (
        <div key={p.name} className="flex items-center gap-2">
          <span className="inline-block h-2 w-2 rounded-full" style={{ background: p.color }} />
          <span className="text-muted-foreground">{p.name}:</span>
          <span className="font-medium">
            {p.value}
            {suffix}
          </span>
        </div>
      ))}
    </div>
  );
}

// ── page ──────────────────────────────────────────────────────────────────────

export function EngineerSummaryPage() {
  const { sprints } = useSprintStore();
  const { reviewCycles, assignments, answers } = useReviewStore();
  const { questions, goalCategories } = useTemplateStore();
  const { employees } = useEmployeeStore();

  // Use the first cycle (most data in mock)
  const latestCycle = reviewCycles[0];

  const employeeNames = useMemo(
    () => Object.fromEntries(employees.map((e) => [e.id, e.name])),
    [employees],
  );

  // Score results for latest cycle
  const cycleResults = useMemo(() => {
    if (!latestCycle) return [];
    return calculateCycleResults(
      latestCycle.id,
      latestCycle.activeReviewTypes,
      assignments,
      answers,
      questions,
      goalCategories,
      employeeNames,
    );
  }, [latestCycle, assignments, answers, questions, goalCategories, employeeNames]);

  // KPI derivations
  const avgPred = Math.round(numAvg(sprints.map(sprintPredictability)));
  const avgCo = Math.round(numAvg(sprints.map(sprintCarryoverRate)));

  const scoresWithData = cycleResults.filter((r) => r.finalScore != null);
  const avgReviewScore =
    scoresWithData.length > 0
      ? (numAvg(scoresWithData.map((r) => r.finalScore as number))).toFixed(2)
      : '–';
  const atRiskCount = scoresWithData.filter(
    (r) => (r.finalScore as number) < AT_RISK_THRESHOLD,
  ).length;

  // Predictability trend data (line chart)
  const predTrendData = sprints.map((s) => ({
    name: s.name,
    predictability: sprintPredictability(s),
  }));

  // Team avg per category (bar chart)
  const categoryBarData = goalCategories.map((cat) => {
    const catScores = cycleResults
      .map((r) => r.categoryRows.find((row) => row.categoryId === cat.id)?.weighted)
      .filter((v): v is number => v != null);
    return {
      name: CAT_SHORT[cat.id] ?? cat.name,
      score: catScores.length > 0 ? parseFloat(numAvg(catScores).toFixed(2)) : null,
    };
  });

  return (
    <div className="p-6 space-y-6 max-w-6xl mx-auto">
      {/* Header */}
      <div>
        <h2 className="text-[20px] font-bold text-foreground">Engineering Summary</h2>
        <p className="text-[13px] text-muted-foreground mt-0.5">
          C-Level overview · Platform Engineering · Q1 2025
        </p>
      </div>

      {/* KPI cards — 4 columns */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          label="Sprint Predictability"
          value={`${avgPred}%`}
          sub="Avg across 6 sprints"
          accentClass={avgPred >= 85 ? 'text-emerald-600' : 'text-amber-600'}
          icon={<TrendingUp className="h-5 w-5 text-emerald-600" />}
        />
        <StatCard
          label="Carry-over Rate"
          value={`${avgCo}%`}
          sub="Avg SP not completed"
          accentClass={avgCo <= 10 ? 'text-emerald-600' : 'text-red-600'}
          icon={<AlertTriangle className="h-5 w-5 text-amber-500" />}
        />
        <StatCard
          label="Avg Review Score"
          value={avgReviewScore}
          sub={`${latestCycle?.name ?? 'Latest cycle'}`}
          accentClass="text-indigo-700"
          icon={<Star className="h-5 w-5 text-indigo-500" />}
        />
        <StatCard
          label="At-Risk Engineers"
          value={atRiskCount}
          sub={`Score below ${AT_RISK_THRESHOLD}`}
          accentClass={atRiskCount === 0 ? 'text-emerald-600' : 'text-red-600'}
          icon={<Users className="h-5 w-5 text-red-500" />}
        />
      </div>

      {/* Charts — side by side on wide screens */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* Predictability trend */}
        <div className="bg-white rounded-xl border border-border p-5">
          <div className="mb-4">
            <h3 className="text-[14px] font-semibold text-foreground">
              Sprint Predictability Trend
            </h3>
            <p className="text-[12px] text-muted-foreground mt-0.5">% of committed SP delivered</p>
          </div>
          <ResponsiveContainer width="100%" height={240}>
            <LineChart data={predTrendData} margin={{ top: 4, right: 16, bottom: 0, left: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" vertical={false} />
              <XAxis dataKey="name" tick={{ fontSize: 12 }} tickLine={false} axisLine={false} />
              <YAxis
                domain={[60, 110]}
                tick={{ fontSize: 12 }}
                tickLine={false}
                axisLine={false}
                tickFormatter={(v) => `${v}%`}
                width={38}
              />
              <Tooltip content={<ChartTooltip suffix="%" />} />
              <ReferenceLine
                y={80}
                stroke="#ef4444"
                strokeDasharray="4 4"
                label={{ value: '80% min', fontSize: 10, fill: '#ef4444', position: 'insideTopRight' }}
              />
              <Line
                type="monotone"
                dataKey="predictability"
                stroke="#6366f1"
                strokeWidth={2.5}
                dot={{ fill: '#6366f1', r: 4 }}
                activeDot={{ r: 6 }}
                name="Predictability %"
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Team score per category */}
        <div className="bg-white rounded-xl border border-border p-5">
          <div className="mb-4">
            <h3 className="text-[14px] font-semibold text-foreground">
              Team Score per Category
            </h3>
            <p className="text-[12px] text-muted-foreground mt-0.5">
              Avg weighted score · {latestCycle?.name ?? 'Latest cycle'}
            </p>
          </div>
          <ResponsiveContainer width="100%" height={240}>
            <BarChart
              data={categoryBarData}
              margin={{ top: 4, right: 16, bottom: 0, left: 0 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" vertical={false} />
              <XAxis dataKey="name" tick={{ fontSize: 11 }} tickLine={false} axisLine={false} />
              <YAxis
                domain={[0, 4]}
                ticks={[0, 1, 2, 3, 4]}
                tick={{ fontSize: 12 }}
                tickLine={false}
                axisLine={false}
                width={28}
              />
              <Tooltip content={<ChartTooltip />} />
              <ReferenceLine
                y={2.8}
                stroke="#ef4444"
                strokeDasharray="4 4"
                label={{ value: 'At-Risk', fontSize: 10, fill: '#ef4444', position: 'insideTopRight' }}
              />
              <Bar dataKey="score" name="Avg Score" fill="#6366f1" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Summary footnote */}
      <p className="text-[11.5px] text-muted-foreground pb-2">
        * Delivery metrics sourced from mock Jira data (Q1 2025 · 6 sprints). People scores from
        submitted peer &amp; self reviews.
      </p>
    </div>
  );
}
