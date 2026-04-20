import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, CheckCircle2, AlertCircle } from 'lucide-react';
import { toast } from 'sonner';
import { useReviewStore } from '@/shared/stores/reviewStore';
import { useEmployeeStore } from '@/shared/stores/employeeStore';
import { useQuestionStore } from '@/shared/stores/templateStore';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from '@/components/ui/dialog';
import { cn } from '@/lib/utils';
import type { ReviewAnswer, ScoreValue } from '@/shared/types';

const SCORE_OPTS: { value: number; label: string }[] = [
  { value: 1, label: 'Needs Improvement' },
  { value: 2, label: 'Below Expectations' },
  { value: 3, label: 'Meets Expectations' },
  { value: 4, label: 'Exceeds Expectations' },
  { value: 5, label: 'Significantly Exceeds' },
  { value: 6, label: 'Outstanding' },
];

const TYPE_BADGE: Record<string, 'info' | 'purple' | 'orange'> = {
  peer: 'info',
  self: 'purple',
  manager: 'orange',
};

export function ReviewFormPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const { assignments, getAnswers, saveAnswers } = useReviewStore();
  const { employees, roles } = useEmployeeStore();
  const { questions, getHintsForQuestion } = useQuestionStore();

  const assignment = assignments.find((a) => a.id === id);
  const [answers, setAnswers] = useState<Map<string, Partial<ReviewAnswer>>>(new Map());
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);

  useEffect(() => {
    if (!assignment) return;
    const existing = getAnswers(assignment.id);
    const map = new Map<string, Partial<ReviewAnswer>>();
    existing.forEach((a) => map.set(a.questionId, a));
    setAnswers(map);
    const t = setTimeout(() => setLoading(false), 350);
    return () => clearTimeout(t);
  }, [assignment?.id]);

  if (!assignment) {
    return (
      <div className="flex flex-col items-center justify-center h-full gap-3 p-12">
        <AlertCircle className="h-8 w-8 text-muted-foreground" />
        <p className="text-[13px] text-muted-foreground">Assignment not found.</p>
        <Button size="sm" variant="outline" onClick={() => navigate('/reviews')}>
          Back to reviews
        </Button>
      </div>
    );
  }

  const reviewee = employees.find((e) => e.id === assignment.revieweeId);
  const reviewer = employees.find((e) => e.id === assignment.reviewerId);
  const templateQs = questions
    .filter((q) => q.reviewType === assignment.reviewType)
    .sort((a, b) => a.order - b.order);

  const getRoleName = (id?: string | null) => roles.find((r) => r.id === id)?.name ?? '—';

  const setScore = (qId: string, score: number) =>
    setAnswers((prev) => new Map(prev).set(qId, { ...prev.get(qId), questionId: qId, scoreValue: score as ScoreValue, textValue: null }));

  const setText = (qId: string, text: string) =>
    setAnswers((prev) => new Map(prev).set(qId, { ...prev.get(qId), questionId: qId, textValue: text, scoreValue: null }));

  const answeredCount = templateQs.filter((q) => {
    const a = answers.get(q.id);
    return q.type === 'score' ? !!a?.scoreValue : !!a?.textValue?.trim();
  }).length;

  const isReadonly = assignment.status === 'submitted';
  const progressPct = templateQs.length > 0 ? Math.round((answeredCount / templateQs.length) * 100) : 0;

  const doSubmit = () => {
    setSubmitting(true);
    setConfirmOpen(false);
    setTimeout(() => {
      const toSave = Array.from(answers.values())
        .filter((a) => a.questionId)
        .map((a) => ({
          assignmentId: assignment.id,
          questionId: a.questionId!,
          scoreValue: a.scoreValue ?? null,
          textValue: a.textValue ?? null,
        }));
      saveAnswers(assignment.id, toSave);
      toast.success('Review submitted successfully!');
      navigate('/reviews');
    }, 500);
  };

  const handleSubmitClick = () => {
    for (const q of templateQs) {
      const a = answers.get(q.id);
      if (q.type === 'score' && !a?.scoreValue) {
        toast.error(`Please rate: "${q.text.slice(0, 48)}…"`);
        return;
      }
      if (q.type === 'essay' && !a?.textValue?.trim()) {
        toast.error(`Please answer: "${q.text.slice(0, 48)}…"`);
        return;
      }
    }
    setConfirmOpen(true);
  };

  const handleSaveDraft = () => {
    const toSave = Array.from(answers.values())
      .filter((a) => a.questionId)
      .map((a) => ({
        assignmentId: assignment.id,
        questionId: a.questionId!,
        scoreValue: a.scoreValue ?? null,
        textValue: a.textValue ?? null,
      }));
    saveAnswers(assignment.id, toSave);
    toast.success('Draft saved.');
  };

  return (
    <div className="flex flex-col h-full">
      {/* Scrollable content */}
      <div className="flex-1 overflow-y-auto">
        <div className="max-w-2xl mx-auto px-6 py-6 pb-28">
          {/* Back */}
          <button
            className="flex items-center gap-1.5 text-[12px] text-muted-foreground hover:text-foreground transition-colors mb-5"
            onClick={() => navigate('/reviews')}
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            Back to reviews
          </button>

          {/* Review header */}
          <div className="bg-card rounded-xl border border-border p-5 mb-5 shadow-sm">
            <div className="flex items-start justify-between gap-4">
              <div className="flex items-start gap-3.5">
                <div className="h-10 w-10 rounded-full bg-indigo-100 flex items-center justify-center text-[13px] font-semibold text-indigo-700 shrink-0">
                  {reviewee?.name?.slice(0, 2).toUpperCase()}
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <Badge variant={TYPE_BADGE[assignment.reviewType] ?? 'secondary'}>
                      {assignment.reviewType}
                    </Badge>
                    {isReadonly && (
                      <Badge variant="success" className="gap-1">
                        <CheckCircle2 className="h-2.5 w-2.5" />
                        submitted
                      </Badge>
                    )}
                  </div>
                  <p className="text-[15px] font-semibold text-foreground leading-none">
                    {assignment.reviewType === 'self'
                      ? 'Self Assessment'
                      : `Review for ${reviewee?.name}`}
                  </p>
                  <p className="text-[12px] text-muted-foreground mt-1">
                    {reviewee?.name} · {getRoleName(reviewee?.roleId)}
                  </p>
                </div>
              </div>
              <div className="text-right shrink-0">
                <p className="text-[11px] text-muted-foreground mb-1">Progress</p>
                <p className="text-[22px] font-semibold text-foreground tabular-nums leading-none">
                  {answeredCount}<span className="text-[14px] font-normal text-muted-foreground">/{templateQs.length}</span>
                </p>
              </div>
            </div>

            {/* Progress bar */}
            <div className="mt-4 pt-4 border-t border-border">
              <div className="flex justify-between text-[11px] text-muted-foreground mb-1.5">
                <span className="capitalize">{assignment.reviewType} Review</span>
                <span className="tabular-nums">{progressPct}%</span>
              </div>
              <div className="h-1 bg-muted rounded-full overflow-hidden">
                <div
                  className="h-full bg-indigo-500 rounded-full transition-all duration-300"
                  style={{ width: `${progressPct}%` }}
                />
              </div>
            </div>

            <div className="mt-3 flex items-center gap-4 text-[12px] text-muted-foreground">
              <span>Reviewer: <strong className="text-foreground font-medium">{reviewer?.name}</strong></span>
              <span>Due: <strong className="text-foreground font-medium">{new Date(assignment.dueDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</strong></span>
            </div>
          </div>

          {/* Questions */}
          <div className="space-y-3">
            {loading
              ? Array.from({ length: 4 }).map((_, i) => (
                  <div key={i} className="bg-card rounded-xl border border-border p-5">
                    <Skeleton className="h-4 w-2/3 mb-4 rounded" />
                    <div className="grid grid-cols-3 gap-2">
                      {[1, 2, 3, 4, 5, 6].map((s) => <Skeleton key={s} className="h-16 flex-1 rounded-lg" />)}
                    </div>
                  </div>
                ))
              : templateQs.map((q, idx) => {
                  const answer = answers.get(q.id);
                  const isAnswered = q.type === 'score' ? !!answer?.scoreValue : !!answer?.textValue?.trim();

                  return (
                    <div
                      key={q.id}
                      className={cn(
                        'bg-card rounded-xl border p-5 transition-colors',
                        isAnswered ? 'border-indigo-200 bg-indigo-50/20' : 'border-border',
                      )}
                    >
                      <div className="flex items-start gap-3 mb-4">
                        <span className={cn(
                          'flex h-5 w-5 shrink-0 items-center justify-center rounded-full text-[11px] font-semibold mt-0.5',
                          isAnswered ? 'bg-indigo-600 text-white' : 'bg-muted text-muted-foreground',
                        )}>
                          {isAnswered ? <CheckCircle2 className="h-3 w-3" /> : idx + 1}
                        </span>
                        <p className="text-[13px] font-medium text-foreground leading-snug">{q.text}</p>
                      </div>

                      {q.type === 'score' ? (
                        <div className="ml-8">
                          <RadioGroup
                            value={answer?.scoreValue ? String(answer.scoreValue) : ''}
                            onValueChange={(v) => !isReadonly && setScore(q.id, Number(v))}
                            className="grid grid-cols-3 gap-2"
                            disabled={isReadonly}
                          >
                            {SCORE_OPTS.map(({ value, label }) => (
                              <div key={value}>
                                <RadioGroupItem value={String(value)} id={`${q.id}-${value}`} className="sr-only" />
                                <Label
                                  htmlFor={`${q.id}-${value}`}
                                  className={cn(
                                    'flex flex-col items-center justify-center h-16 rounded-lg border-2 cursor-pointer transition-all text-center px-1',
                                    answer?.scoreValue === value
                                      ? 'border-indigo-500 bg-indigo-50 text-indigo-700'
                                      : 'border-border bg-white hover:border-indigo-200 text-muted-foreground',
                                    isReadonly && 'cursor-default',
                                  )}
                                >
                                  <span className="text-[18px] font-bold leading-none">{value}</span>
                                  <span className="text-[10px] mt-1 leading-tight">{label}</span>
                                </Label>
                              </div>
                            ))}
                          </RadioGroup>
                          {answer?.scoreValue && (() => {
                            const hints = getHintsForQuestion(q.id);
                            const activeHint = hints.find((h) => h.scoreValue === answer.scoreValue);
                            return activeHint ? (
                              <p className="mt-2 text-[12px] text-indigo-600/80 italic border-l-2 border-indigo-200 pl-2">
                                {activeHint.anchorText}
                              </p>
                            ) : null;
                          })()}
                        </div>
                      ) : (
                        <div className="ml-8">
                          <Textarea
                            placeholder="Share your perspective…"
                            rows={4}
                            value={answer?.textValue ?? ''}
                            onChange={(e) => !isReadonly && setText(q.id, e.target.value)}
                            disabled={isReadonly}
                            className={cn(
                              'resize-y min-h-[120px] text-[13px] rounded-lg border-border',
                              isReadonly && 'bg-muted/30',
                            )}
                          />
                        </div>
                      )}
                    </div>
                  );
                })}
          </div>
        </div>
      </div>

      {/* Sticky footer */}
      {!isReadonly && (
        <div className="shrink-0 border-t border-border bg-white/95 backdrop-blur px-6 py-4">
          <div className="max-w-2xl mx-auto flex items-center justify-between">
            <Button variant="outline" onClick={handleSaveDraft} disabled={submitting}>
              Save draft
            </Button>
            <Button onClick={handleSubmitClick} disabled={submitting} className="min-w-[130px]">
              {submitting ? 'Submitting…' : 'Submit review'}
            </Button>
          </div>
        </div>
      )}

      {/* Confirm dialog */}
      <Dialog open={confirmOpen} onOpenChange={setConfirmOpen}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle>Submit review?</DialogTitle>
            <DialogDescription>
              Once submitted, you won't be able to edit your responses.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="ghost" onClick={() => setConfirmOpen(false)}>
              Cancel
            </Button>
            <Button onClick={doSubmit} disabled={submitting}>
              {submitting ? 'Submitting…' : 'Submit'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
