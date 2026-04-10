import { useNavigate } from 'react-router-dom';
import {
  ClipboardList,
  CheckCircle2,
  Clock,
  TrendingUp,
  ArrowRight,
  Users,
} from 'lucide-react';
import { useReviewStore } from '@/shared/stores/reviewStore';
import { useEmployeeStore } from '@/shared/stores/employeeStore';
import { useTemplateStore } from '@/shared/stores/templateStore';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { cn, formatDate } from '@/lib/utils';

const CURRENT_USER_ID = 'e2';

const TYPE_VARIANT = {
  peer: 'info',
  self: 'purple',
  manager: 'orange',
} as const;

function StatCard({
  label,
  value,
  sub,
  icon: Icon,
  iconClass,
}: {
  label: string;
  value: string | number;
  sub: string;
  icon: React.ElementType;
  iconClass: string;
}) {
  return (
    <div className="bg-card rounded-xl border border-border p-5 shadow-sm">
      <div className="flex items-center justify-between mb-3">
        <p className="text-[13px] font-medium text-muted-foreground">{label}</p>
        <div className={cn('h-8 w-8 rounded-lg flex items-center justify-center', iconClass)}>
          <Icon className="h-4 w-4" />
        </div>
      </div>
      <p className="text-2xl font-semibold text-foreground tracking-tight">{value}</p>
      <p className="text-[12px] text-muted-foreground mt-1">{sub}</p>
    </div>
  );
}

export function DashboardPage() {
  const { assignments, reviewCycles } = useReviewStore();
  const { employees } = useEmployeeStore();
  const { templates } = useTemplateStore();
  const navigate = useNavigate();

  const total = assignments.length;
  const submitted = assignments.filter((a) => a.status === 'submitted').length;
  const pending = total - submitted;
  const rate = total > 0 ? Math.round((submitted / total) * 100) : 0;

  const myAssignments = assignments.filter((a) => a.reviewerId === CURRENT_USER_ID);
  const recentAssignments = [...assignments]
    .sort((a, b) => new Date(b.dueDate).getTime() - new Date(a.dueDate).getTime())
    .slice(0, 5);

  const me = employees.find((e) => e.id === CURRENT_USER_ID);

  return (
    <div className="p-6 space-y-6">
      {/* Welcome */}
      <div>
        <h2 className="text-[15px] font-semibold text-foreground">
          Welcome back, {me?.name?.split(' ')[0]} 👋
        </h2>
        <p className="text-[13px] text-muted-foreground mt-0.5">
          Here's an overview of your team's review progress.
        </p>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
        <StatCard
          label="Total Assigned"
          value={total}
          sub={`${myAssignments.length} assigned to me`}
          icon={ClipboardList}
          iconClass="bg-indigo-50 text-indigo-600"
        />
        <StatCard
          label="Submitted"
          value={submitted}
          sub="Reviews completed"
          icon={CheckCircle2}
          iconClass="bg-emerald-50 text-emerald-600"
        />
        <StatCard
          label="Pending"
          value={pending}
          sub="Awaiting submission"
          icon={Clock}
          iconClass="bg-amber-50 text-amber-600"
        />
        <StatCard
          label="Completion Rate"
          value={`${rate}%`}
          sub={`${submitted} of ${total} done`}
          icon={TrendingUp}
          iconClass="bg-violet-50 text-violet-600"
        />
      </div>

      {/* Two-column lower area */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
        {/* Recent assignments table */}
        <div className="xl:col-span-2 bg-card rounded-xl border border-border shadow-sm overflow-hidden">
          <div className="flex items-center justify-between px-5 py-3.5 border-b border-border">
            <p className="text-[13px] font-semibold text-foreground">Recent Assignments</p>
            <Button
              variant="ghost"
              size="sm"
              className="h-7 text-[12px] text-muted-foreground gap-1 hover:text-foreground"
              onClick={() => navigate('/assignments')}
            >
              View all <ArrowRight className="h-3 w-3" />
            </Button>
          </div>
          <table className="w-full text-[13px]">
            <thead>
              <tr className="bg-muted/30 border-b border-border">
                <th className="text-left px-5 py-2.5 text-[11px] font-medium text-muted-foreground uppercase tracking-wide">Reviewee</th>
                <th className="text-left px-5 py-2.5 text-[11px] font-medium text-muted-foreground uppercase tracking-wide">Type</th>
                <th className="text-left px-5 py-2.5 text-[11px] font-medium text-muted-foreground uppercase tracking-wide">Status</th>
                <th className="text-left px-5 py-2.5 text-[11px] font-medium text-muted-foreground uppercase tracking-wide">Due Date</th>
              </tr>
            </thead>
            <tbody>
              {recentAssignments.map((a) => {
                const reviewee = employees.find((e) => e.id === a.revieweeId);
                const reviewer = employees.find((e) => e.id === a.reviewerId);
                return (
                  <tr key={a.id} className="border-b border-border last:border-0 hover:bg-muted/30 transition-colors">
                    <td className="px-5 py-3">
                      <div className="flex items-center gap-2.5">
                        <div className="h-7 w-7 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center text-[11px] font-semibold shrink-0">
                          {reviewee?.name?.slice(0, 2).toUpperCase()}
                        </div>
                        <div>
                          <p className="text-[13px] font-medium text-foreground leading-none">{reviewee?.name}</p>
                          <p className="text-[11px] text-muted-foreground mt-0.5">by {reviewer?.name}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-3">
                      <Badge variant={TYPE_VARIANT[a.reviewType] ?? 'secondary'}>
                        {a.reviewType}
                      </Badge>
                    </td>
                    <td className="px-5 py-3">
                      <Badge variant={a.status === 'submitted' ? 'success' : 'warning'}>
                        {a.status}
                      </Badge>
                    </td>
                    <td className="px-5 py-3 text-[12px] text-muted-foreground tabular-nums">
                      {formatDate(a.dueDate)}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Right column */}
        <div className="space-y-4">
          {/* Active cycles */}
          <div className="bg-card rounded-xl border border-border p-5 shadow-sm">
            <p className="text-[13px] font-semibold text-foreground mb-3">Review Cycles</p>
            <div className="space-y-2.5">
              {reviewCycles.slice(0, 3).map((cycle) => {
                const now = new Date();
                const isActive =
                  new Date(cycle.startDate) <= now && new Date(cycle.endDate) >= now;
                const cycleAssignments = assignments.filter((a) => a.cycleId === cycle.id);
                const cycleSubmitted = cycleAssignments.filter((a) => a.status === 'submitted').length;
                const cyclePct = cycleAssignments.length > 0
                  ? Math.round((cycleSubmitted / cycleAssignments.length) * 100)
                  : 0;
                return (
                  <div key={cycle.id} className="p-3 rounded-lg bg-muted/40 border border-border">
                    <div className="flex items-center justify-between mb-1.5">
                      <p className="text-[12px] font-medium text-foreground">{cycle.name}</p>
                      <Badge variant={isActive ? 'success' : 'secondary'} className="text-[10px]">
                        {isActive ? 'Active' : 'Ended'}
                      </Badge>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="flex-1 h-1.5 bg-background rounded-full overflow-hidden border border-border">
                        <div
                          className="h-full bg-indigo-500 rounded-full"
                          style={{ width: `${cyclePct}%` }}
                        />
                      </div>
                      <span className="text-[11px] text-muted-foreground tabular-nums shrink-0">{cyclePct}%</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* My pending */}
          <div className="bg-card rounded-xl border border-border p-5 shadow-sm">
            <div className="flex items-center justify-between mb-3">
              <p className="text-[13px] font-semibold text-foreground">My Pending</p>
              <Button
                variant="ghost"
                size="sm"
                className="h-6 text-[12px] text-muted-foreground gap-1"
                onClick={() => navigate('/reviews')}
              >
                Go <ArrowRight className="h-3 w-3" />
              </Button>
            </div>
            {myAssignments.filter((a) => a.status !== 'submitted').length === 0 ? (
              <div className="text-center py-4">
                <CheckCircle2 className="h-7 w-7 text-emerald-500 mx-auto mb-1.5" />
                <p className="text-[12px] font-medium text-foreground">All caught up!</p>
                <p className="text-[11px] text-muted-foreground mt-0.5">No pending reviews.</p>
              </div>
            ) : (
              <div className="space-y-2">
                {myAssignments
                  .filter((a) => a.status !== 'submitted')
                  .map((a) => {
                    const reviewee = employees.find((e) => e.id === a.revieweeId);
                    const tmpl = templates.find((t) => t.id === a.templateId);
                    return (
                      <div
                        key={a.id}
                        className="flex items-center justify-between gap-2 py-2 border-b border-border last:border-0"
                      >
                        <div className="min-w-0">
                          <p className="text-[12px] font-medium text-foreground truncate">
                            {a.reviewType === 'self' ? 'Self Assessment' : reviewee?.name}
                          </p>
                          <p className="text-[11px] text-muted-foreground truncate">{tmpl?.name}</p>
                        </div>
                        <Button
                          size="sm"
                          variant="outline"
                          className="h-6 text-[11px] shrink-0 px-2"
                          onClick={() => navigate(`/reviews/${a.id}`)}
                        >
                          Start
                        </Button>
                      </div>
                    );
                  })}
              </div>
            )}
          </div>

          {/* Quick stats */}
          <div className="bg-card rounded-xl border border-border p-5 shadow-sm">
            <p className="text-[13px] font-semibold text-foreground mb-3">Team Overview</p>
            <div className="space-y-2">
              <div className="flex justify-between text-[12px]">
                <span className="text-muted-foreground flex items-center gap-1.5">
                  <Users className="h-3.5 w-3.5" /> Employees
                </span>
                <span className="font-medium text-foreground">{employees.length}</span>
              </div>
              <div className="flex justify-between text-[12px]">
                <span className="text-muted-foreground">Active cycles</span>
                <span className="font-medium text-foreground">
                  {reviewCycles.filter((c) => {
                    const now = new Date();
                    return new Date(c.startDate) <= now && new Date(c.endDate) >= now;
                  }).length}
                </span>
              </div>
              <div className="flex justify-between text-[12px]">
                <span className="text-muted-foreground">Templates</span>
                <span className="font-medium text-foreground">{templates.length}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
