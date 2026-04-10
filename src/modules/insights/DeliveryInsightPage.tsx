import { useMemo } from 'react';
import {
  ComposedChart,
  Bar,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  ReferenceLine,
} from 'recharts';
import { TrendingUp, AlertTriangle, Package, CheckCircle2 } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { useSprintStore, sprintPredictability, sprintCarryoverRate, type Sprint } from '@/shared/stores/sprintStore';

// ── helpers ───────────────────────────────────────────────────────────────────

function numAvg(vals: number[]) {
  return vals.length ? vals.reduce((a, b) => a + b, 0) / vals.length : 0;
}

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
    <div className="bg-white rounded-xl border border-border p-4 flex items-start gap-3">
      <div className="h-9 w-9 rounded-lg bg-muted flex items-center justify-center shrink-0">
        {icon}
      </div>
      <div className="min-w-0">
        <p className="text-[11.5px] text-muted-foreground mb-0.5">{label}</p>
        <p className={`text-[22px] font-bold leading-none ${accentClass}`}>{value}</p>
        {sub && <p className="text-[11px] text-muted-foreground mt-1">{sub}</p>}
      </div>
    </div>
  );
}

// ── custom tooltip ────────────────────────────────────────────────────────────

function ChartTooltip({ active, payload, label }: { active?: boolean; payload?: { name: string; value: number; color: string }[]; label?: string }) {
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
            {p.name === 'Predictability %' ? '%' : ' SP'}
          </span>
        </div>
      ))}
    </div>
  );
}

// ── sprint detail table ───────────────────────────────────────────────────────

function SprintTable({ sprints }: { sprints: Sprint[] }) {
  return (
    <div className="bg-white rounded-xl border border-border overflow-hidden">
      <div className="px-5 py-3 border-b border-border">
        <h3 className="text-[13px] font-semibold text-foreground">Sprint Detail</h3>
      </div>
      <table className="w-full text-[13px]">
        <thead>
          <tr className="bg-muted/40 border-b border-border">
            <th className="text-left px-4 py-2.5 font-medium text-muted-foreground">Sprint</th>
            <th className="text-left px-4 py-2.5 font-medium text-muted-foreground">Period</th>
            <th className="text-right px-4 py-2.5 font-medium text-muted-foreground">Committed</th>
            <th className="text-right px-4 py-2.5 font-medium text-muted-foreground">Completed</th>
            <th className="text-right px-4 py-2.5 font-medium text-muted-foreground">Carry-over</th>
            <th className="text-right px-4 py-2.5 font-medium text-muted-foreground">Predictability</th>
            <th className="text-right px-4 py-2.5 font-medium text-muted-foreground">CO Rate</th>
          </tr>
        </thead>
        <tbody>
          {sprints.map((s) => {
            const pred = sprintPredictability(s);
            const co = sprintCarryoverRate(s);
            return (
              <tr key={s.id} className="border-b border-border last:border-0 hover:bg-muted/20 transition-colors">
                <td className="px-4 py-2.5 font-medium">{s.name}</td>
                <td className="px-4 py-2.5 text-muted-foreground">{s.period}</td>
                <td className="px-4 py-2.5 text-right">{s.committedSP} SP</td>
                <td className="px-4 py-2.5 text-right">{s.completedSP} SP</td>
                <td className="px-4 py-2.5 text-right">{s.carryoverSP} SP</td>
                <td
                  className={`px-4 py-2.5 text-right font-semibold ${
                    pred >= 90 ? 'text-emerald-600' : pred >= 80 ? 'text-amber-600' : 'text-red-600'
                  }`}
                >
                  {pred}%
                </td>
                <td
                  className={`px-4 py-2.5 text-right font-semibold ${
                    co <= 5 ? 'text-emerald-600' : co <= 15 ? 'text-amber-600' : 'text-red-600'
                  }`}
                >
                  {co}%
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

// ── page ──────────────────────────────────────────────────────────────────────

export function DeliveryInsightPage() {
  const { sprints } = useSprintStore();

  const chartData = useMemo(
    () =>
      sprints.map((s) => ({
        name: s.name,
        completed: s.completedSP,
        carryover: s.carryoverSP,
        predictability: sprintPredictability(s),
      })),
    [sprints],
  );

  const avgPred = Math.round(numAvg(sprints.map(sprintPredictability)));
  const avgCo = Math.round(numAvg(sprints.map(sprintCarryoverRate)));
  const totalCommitted = sprints.reduce((s, sp) => s + sp.committedSP, 0);
  const totalCompleted = sprints.reduce((s, sp) => s + sp.completedSP, 0);

  return (
    <div className="p-6 space-y-6 max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <h2 className="text-[20px] font-bold text-foreground">Delivery Insights</h2>
          <p className="text-[13px] text-muted-foreground mt-0.5">
            Sprint performance · Platform Engineering · Q1 2025
          </p>
        </div>
        <Badge variant="secondary" className="text-[11px] shrink-0 mt-1">
          Mock Jira Data
        </Badge>
      </div>

      {/* KPI cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          label="Avg Predictability"
          value={`${avgPred}%`}
          sub="Committed vs completed"
          accentClass={avgPred >= 85 ? 'text-emerald-600' : 'text-amber-600'}
          icon={<TrendingUp className="h-5 w-5 text-emerald-600" />}
        />
        <StatCard
          label="Avg Carry-over Rate"
          value={`${avgCo}%`}
          sub="Story points carried over"
          accentClass={avgCo <= 10 ? 'text-emerald-600' : 'text-red-600'}
          icon={<AlertTriangle className="h-5 w-5 text-amber-500" />}
        />
        <StatCard
          label="Total Committed SP"
          value={totalCommitted}
          sub="Across 6 sprints"
          icon={<Package className="h-5 w-5 text-indigo-500" />}
        />
        <StatCard
          label="Total Completed SP"
          value={totalCompleted}
          sub={`${Math.round((totalCompleted / totalCommitted) * 100)}% overall`}
          accentClass="text-indigo-700"
          icon={<CheckCircle2 className="h-5 w-5 text-indigo-500" />}
        />
      </div>

      {/* Combo chart */}
      <div className="bg-white rounded-xl border border-border p-5">
        <div className="mb-4">
          <h3 className="text-[14px] font-semibold text-foreground">Sprint Velocity & Predictability</h3>
          <p className="text-[12px] text-muted-foreground mt-0.5">
            Stacked bars = Story Points delivered · Line = Predictability %
          </p>
        </div>
        <ResponsiveContainer width="100%" height={320}>
          <ComposedChart data={chartData} margin={{ top: 4, right: 56, bottom: 0, left: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" vertical={false} />
            <XAxis dataKey="name" tick={{ fontSize: 12 }} tickLine={false} axisLine={false} />
            <YAxis
              yAxisId="sp"
              tick={{ fontSize: 12 }}
              tickLine={false}
              axisLine={false}
              width={36}
              label={{ value: 'SP', angle: -90, position: 'insideLeft', offset: 12, style: { fontSize: 11, fill: '#94a3b8' } }}
            />
            <YAxis
              yAxisId="pct"
              orientation="right"
              domain={[0, 120]}
              tick={{ fontSize: 12 }}
              tickLine={false}
              axisLine={false}
              tickFormatter={(v) => `${v}%`}
              width={42}
            />
            <Tooltip content={<ChartTooltip />} />
            <Legend wrapperStyle={{ fontSize: 12, paddingTop: 12 }} />
            <Bar yAxisId="sp" dataKey="completed" stackId="a" fill="#22c55e" name="Completed SP" />
            <Bar
              yAxisId="sp"
              dataKey="carryover"
              stackId="a"
              fill="#f59e0b"
              name="Carry-over SP"
              radius={[4, 4, 0, 0]}
            />
            <Line
              yAxisId="pct"
              type="monotone"
              dataKey="predictability"
              stroke="#6366f1"
              strokeWidth={2.5}
              dot={{ fill: '#6366f1', r: 4 }}
              activeDot={{ r: 6 }}
              name="Predictability %"
            />
            <ReferenceLine
              yAxisId="pct"
              y={80}
              stroke="#ef4444"
              strokeDasharray="4 4"
              label={{ value: 'Min 80%', fontSize: 10, fill: '#ef4444', position: 'insideTopRight' }}
            />
          </ComposedChart>
        </ResponsiveContainer>
      </div>

      {/* Sprint detail table */}
      <SprintTable sprints={sprints} />
    </div>
  );
}
