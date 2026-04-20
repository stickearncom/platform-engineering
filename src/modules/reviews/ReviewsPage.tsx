import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, CheckCircle2, Search, ClipboardList } from 'lucide-react';
import { useReviewStore } from '@/shared/stores/reviewStore';
import { useEmployeeStore } from '@/shared/stores/employeeStore';
import { useTemplateStore } from '@/shared/stores/templateStore';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { cn, formatDate } from '@/lib/utils';

const CURRENT_USER_ID = 'e2';

const TYPE_BADGE: Record<string, 'info' | 'purple' | 'orange'> = {
  peer: 'info',
  self: 'purple',
  manager: 'orange',
};

export function ReviewsPage() {
  const { assignments, getAnswers } = useReviewStore();
  const { employees, roles } = useEmployeeStore();
  const { questions } = useTemplateStore();
  const navigate = useNavigate();
  const [search, setSearch] = useState('');

  const mine = assignments.filter((a) => a.reviewerId === CURRENT_USER_ID);
  const filtered = mine.filter((a) => {
    const reviewee = employees.find((e) => e.id === a.revieweeId)?.name ?? '';
    return (
      !search.trim() ||
      reviewee.toLowerCase().includes(search.toLowerCase())
    );
  });

  const pending = filtered.filter((a) => a.status !== 'submitted');
  const submitted = filtered.filter((a) => a.status === 'submitted');

  const getAnsweredCount = (assignmentId: string, reviewType: string) => {
    const answers = getAnswers(assignmentId);
    const qs = questions.filter((q) => q.reviewType === reviewType);
    return { answered: answers.length, total: qs.length };
  };

  function ReviewCard({ a }: { a: typeof assignments[number] }) {
    const reviewee = employees.find((e) => e.id === a.revieweeId);
    const { answered, total } = getAnsweredCount(a.id, a.reviewType);
    const reviewTypeLabel = a.reviewType.charAt(0).toUpperCase() + a.reviewType.slice(1);
    const pct = total > 0 ? Math.round((answered / total) * 100) : 0;
    const isSubmitted = a.status === 'submitted';

    return (
      <div className="bg-card rounded-xl border border-border p-4 shadow-sm hover:border-indigo-200 transition-colors group">
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-start gap-3">
            <div className={cn(
              'h-9 w-9 rounded-full flex items-center justify-center text-[12px] font-semibold shrink-0',
              isSubmitted ? 'bg-emerald-100 text-emerald-700' : 'bg-indigo-100 text-indigo-700',
            )}>
              {reviewee?.name?.slice(0, 2).toUpperCase()}
            </div>
            <div>
              <div className="flex items-center gap-2 mb-0.5">
                <p className="text-[13px] font-semibold text-foreground">
                  {a.reviewType === 'self' ? 'Self Assessment' : reviewee?.name}
                </p>
                <Badge variant={TYPE_BADGE[a.reviewType] ?? 'secondary'}>
                  {a.reviewType}
                </Badge>
              </div>
              <p className="text-[12px] text-muted-foreground">
                {roles.find((r) => r.id === reviewee?.roleId)?.name ?? '—'}
              </p>
              <p className="text-[11px] text-muted-foreground mt-0.5">
                {reviewTypeLabel} Review · Due {formatDate(a.dueDate)}
              </p>
            </div>
          </div>
          <Button
            size="sm"
            variant={isSubmitted ? 'outline' : 'default'}
            className="shrink-0 h-8 gap-1.5"
            onClick={() => navigate(`/reviews/${a.id}`)}
          >
            {isSubmitted ? 'View' : 'Start'}
            <ArrowRight className="h-3 w-3" />
          </Button>
        </div>

        {/* Progress bar */}
        <div className="mt-3 pt-3 border-t border-border">
          <div className="flex justify-between text-[11px] text-muted-foreground mb-1">
            <span>{answered} of {total} answered</span>
            {isSubmitted && (
              <span className="text-emerald-600 font-medium flex items-center gap-1">
                <CheckCircle2 className="h-3 w-3" /> Submitted
              </span>
            )}
          </div>
          <div className="h-1 bg-muted rounded-full overflow-hidden">
            <div
              className={cn('h-full rounded-full', isSubmitted ? 'bg-emerald-500' : 'bg-indigo-500')}
              style={{ width: `${pct}%` }}
            />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-3xl">
      {/* Header */}
      <div className="flex items-center justify-between mb-5">
        <div>
          <h2 className="text-[15px] font-semibold text-foreground">My Reviews</h2>
          <p className="text-[12px] text-muted-foreground mt-0.5">
            {mine.length} assigned · {mine.filter((a) => a.status === 'submitted').length} completed
          </p>
        </div>
        {/* Search */}
        <div className="relative w-56">
          <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-[14px] w-[14px] text-muted-foreground/60 pointer-events-none" />
          <Input
            className="pl-8 h-8 text-[13px]"
            placeholder="Search…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      {filtered.length === 0 ? (
        <div className="bg-card rounded-xl border border-border p-12 text-center shadow-sm">
          <div className="h-10 w-10 rounded-full bg-muted flex items-center justify-center mx-auto mb-3">
            <ClipboardList className="h-5 w-5 text-muted-foreground" />
          </div>
          <p className="text-[13px] font-medium text-foreground mb-1">No reviews found</p>
          <p className="text-[12px] text-muted-foreground">Try adjusting your search.</p>
        </div>
      ) : (
        <div className="space-y-6">
          {pending.length > 0 && (
            <section>
              <p className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground/70 mb-3">
                Pending · {pending.length}
              </p>
              <div className="space-y-2">
                {pending.map((a) => <ReviewCard key={a.id} a={a} />)}
              </div>
            </section>
          )}
          {submitted.length > 0 && (
            <section>
              <p className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground/70 mb-3">
                Submitted · {submitted.length}
              </p>
              <div className="space-y-2">
                {submitted.map((a) => <ReviewCard key={a.id} a={a} />)}
              </div>
            </section>
          )}
        </div>
      )}
    </div>
  );
}
