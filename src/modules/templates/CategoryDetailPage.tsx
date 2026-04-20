import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ChevronDown, ChevronRight, Plus, Pencil, Trash2, Save, BookOpen, ArrowLeft } from 'lucide-react';
import { toast } from 'sonner';
import { useQuestionStore } from '@/shared/stores/templateStore';
import { useEmployeeStore } from '@/shared/stores/employeeStore';
import { ConfirmDialog } from '@/shared/components/ConfirmDialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import type { Question, ScoreValue, ReviewType, ScoreHintExample } from '@/shared/types';

// ── Constants ─────────────────────────────────────────────────────────────────

const SCORE_VALUES: ScoreValue[] = [1, 2, 3, 4, 5, 6];

const SCORE_LABELS: Record<ScoreValue, string> = {
  1: 'Needs Improvement',
  2: 'Below Expectations',
  3: 'Meets Expectations',
  4: 'Exceeds Expectations',
  5: 'Significantly Exceeds',
  6: 'Outstanding',
};

const SCORE_RING: Record<ScoreValue, string> = {
  1: 'border-red-200 bg-red-50/60',
  2: 'border-orange-200 bg-orange-50/60',
  3: 'border-yellow-200 bg-yellow-50/60',
  4: 'border-blue-200 bg-blue-50/60',
  5: 'border-green-200 bg-green-50/60',
  6: 'border-emerald-200 bg-emerald-50/60',
};

const SCORE_TEXT: Record<ScoreValue, string> = {
  1: 'text-red-700',
  2: 'text-orange-700',
  3: 'text-yellow-700',
  4: 'text-blue-700',
  5: 'text-green-700',
  6: 'text-emerald-700',
};

const RT_COLOR: Record<ReviewType, 'info' | 'success' | 'warning' | 'secondary'> = {
  peer: 'info',
  self: 'success',
  manager: 'warning',
  subordinate: 'secondary',
};

// ── ExamplesDialog ─────────────────────────────────────────────────────────────

type ExamplesDialogProps = {
  hintId: string;
  scoreValue: ScoreValue;
  questionText: string;
  onClose: () => void;
};

function ExamplesDialog({ hintId, scoreValue, questionText, onClose }: ExamplesDialogProps) {
  const { scoreHintExamples, addScoreHintExample, updateScoreHintExample, deleteScoreHintExample } = useQuestionStore();
  const { roles } = useEmployeeStore();

  const [roleFilter, setRoleFilter] = useState<string>('all');
  const [formOpen, setFormOpen] = useState(false);
  const [editTarget, setEditTarget] = useState<ScoreHintExample | null>(null);
  const [form, setForm] = useState<{ roleId: string; exampleText: string }>({ roleId: '', exampleText: '' });
  const [deleteTarget, setDeleteTarget] = useState<ScoreHintExample | null>(null);

  const allExamples = scoreHintExamples.filter(e => e.scoreHintId === hintId);
  const filtered = roleFilter === 'all' ? allExamples : allExamples.filter(e => e.roleId === roleFilter);

  const getRoleName = (id: string) => roles.find(r => r.id === id)?.name ?? id;

  const openAdd = () => {
    setEditTarget(null);
    setForm({ roleId: '', exampleText: '' });
    setFormOpen(true);
  };

  const openEdit = (ex: ScoreHintExample) => {
    setEditTarget(ex);
    setForm({ roleId: ex.roleId, exampleText: ex.exampleText });
    setFormOpen(true);
  };

  const handleSave = () => {
    if (!form.roleId) { toast.error('Specialization is required.'); return; }
    if (!form.exampleText.trim()) { toast.error('Example text is required.'); return; }
    if (editTarget) {
      updateScoreHintExample(editTarget.id, form);
      toast.success('Example updated.');
    } else {
      addScoreHintExample({ scoreHintId: hintId, roleId: form.roleId, exampleText: form.exampleText });
      toast.success('Example added.');
    }
    setFormOpen(false);
  };

  return (
    <>
      <Dialog open onOpenChange={open => !open && onClose()}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>
              Score Hint Examples
              <span className="block text-sm font-normal text-muted-foreground mt-0.5">
                <span className={`font-medium ${SCORE_TEXT[scoreValue]}`}>{scoreValue} — {SCORE_LABELS[scoreValue]}</span>
                {' · '}
                <span className="line-clamp-1 inline">{questionText}</span>
              </span>
            </DialogTitle>
          </DialogHeader>

          {/* Filter + Add */}
          <div className="flex items-center gap-3">
            <Label className="text-xs whitespace-nowrap text-muted-foreground">Specialization:</Label>
            <Select value={roleFilter} onValueChange={setRoleFilter}>
              <SelectTrigger className="h-8 w-52 text-xs"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Specializations</SelectItem>
                {roles.map(r => <SelectItem key={r.id} value={r.id}>{r.name}</SelectItem>)}
              </SelectContent>
            </Select>
            <div className="ml-auto">
              <Button size="sm" className="h-8 text-xs gap-1" onClick={openAdd}>
                <Plus className="h-3 w-3" />
                Add Example
              </Button>
            </div>
          </div>

          {/* Table */}
          <div className="rounded-md border overflow-hidden">
            {filtered.length === 0 ? (
              <div className="py-8 text-center text-sm text-muted-foreground">
                No examples for this score level{roleFilter !== 'all' ? ' / specialization' : ''}.
              </div>
            ) : (
              <table className="w-full text-sm">
                <thead className="bg-muted/50 text-xs text-muted-foreground">
                  <tr>
                    <th className="px-3 py-2 text-left font-medium w-40">Specialization</th>
                    <th className="px-3 py-2 text-left font-medium">Example Text</th>
                    <th className="px-3 py-2 w-16" />
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {filtered.map(ex => (
                    <tr key={ex.id} className="hover:bg-muted/30">
                      <td className="px-3 py-2.5 text-xs font-medium text-muted-foreground whitespace-nowrap">{getRoleName(ex.roleId)}</td>
                      <td className="px-3 py-2.5 text-sm">{ex.exampleText}</td>
                      <td className="px-3 py-2.5">
                        <div className="flex items-center gap-0.5 justify-end">
                          <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => openEdit(ex)}>
                            <Pencil className="h-3 w-3" />
                          </Button>
                          <Button
                            variant="ghost" size="icon"
                            className="h-6 w-6 text-red-500 hover:text-red-600 hover:bg-red-50"
                            onClick={() => setDeleteTarget(ex)}
                          >
                            <Trash2 className="h-3 w-3" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={onClose}>Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Add / Edit form */}
      <Dialog open={formOpen} onOpenChange={open => !open && setFormOpen(false)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editTarget ? 'Edit Example' : 'Add Example'}</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-2">
            <div className="grid gap-1.5">
              <Label>Specialization *</Label>
              <Select
                value={form.roleId || 'none'}
                onValueChange={v => setForm(f => ({ ...f, roleId: v === 'none' ? '' : v }))}
              >
                <SelectTrigger><SelectValue placeholder="Select specialization" /></SelectTrigger>
                <SelectContent>
                  {roles.map(r => <SelectItem key={r.id} value={r.id}>{r.name}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-1.5">
              <Label>Example Text *</Label>
              <Textarea
                rows={3}
                placeholder="How does this score level look for this specialization?"
                value={form.exampleText}
                onChange={e => setForm(f => ({ ...f, exampleText: e.target.value }))}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setFormOpen(false)}>Cancel</Button>
            <Button onClick={handleSave}>{editTarget ? 'Save changes' : 'Add example'}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <ConfirmDialog
        open={!!deleteTarget}
        onOpenChange={open => !open && setDeleteTarget(null)}
        description="Delete this score hint example?"
        onConfirm={() => {
          if (!deleteTarget) return;
          deleteScoreHintExample(deleteTarget.id);
          toast.success('Example deleted.');
          setDeleteTarget(null);
        }}
      />
    </>
  );
}

// ── ScoreHintRows (mounted fresh per question via key prop) ───────────────────

type ScoreHintRowsProps = { question: Question };

function ScoreHintRows({ question }: ScoreHintRowsProps) {
  const { scoreHints, scoreHintExamples, addScoreHint, updateScoreHint } = useQuestionStore();
  const hints = scoreHints.filter(h => h.questionId === question.id);

  // Initialize local edits from store (safe because key=question.id remounts this component)
  const [anchors, setAnchors] = useState<Record<ScoreValue, string>>(() => {
    const init: Record<ScoreValue, string> = { 1: '', 2: '', 3: '', 4: '', 5: '', 6: '' };
    hints.forEach(h => { init[h.scoreValue] = h.anchorText; });
    return init;
  });
  const [dirty, setDirty] = useState(false);
  const [examplesFor, setExamplesFor] = useState<{ hintId: string; scoreValue: ScoreValue } | null>(null);

  const handleChange = (sv: ScoreValue, val: string) => {
    setAnchors(prev => ({ ...prev, [sv]: val }));
    setDirty(true);
  };

  const handleSave = () => {
    SCORE_VALUES.forEach(sv => {
      const existing = hints.find(h => h.scoreValue === sv);
      if (existing) {
        updateScoreHint(existing.id, { anchorText: anchors[sv] });
      } else if (anchors[sv].trim()) {
        addScoreHint({ questionId: question.id, scoreValue: sv, anchorText: anchors[sv] });
      }
    });
    setDirty(false);
    toast.success('Score hints saved.');
  };

  const getExCount = (sv: ScoreValue) => {
    const h = hints.find(x => x.scoreValue === sv);
    return h ? scoreHintExamples.filter(e => e.scoreHintId === h.id).length : 0;
  };

  const getHintId = (sv: ScoreValue) => hints.find(h => h.scoreValue === sv)?.id ?? null;

  return (
    <div className="border-t bg-slate-50/40 px-4 py-4 space-y-2.5">
      <div className="flex items-center justify-between mb-0.5">
        <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
          Score Anchor Hints
        </span>
        <Button
          size="sm"
          variant={dirty ? 'default' : 'outline'}
          className="h-7 text-xs gap-1"
          onClick={handleSave}
        >
          <Save className="h-3 w-3" />
          {dirty ? 'Save Changes' : 'Save Hints'}
        </Button>
      </div>

      {SCORE_VALUES.map(sv => {
        const exCount = getExCount(sv);
        const hintId = getHintId(sv);
        return (
          <div key={sv} className={`rounded-lg border p-3 ${SCORE_RING[sv]}`}>
            <div className="flex items-center gap-2 mb-1.5">
              <span className={`text-xs font-bold tabular-nums w-4 flex-shrink-0 ${SCORE_TEXT[sv]}`}>{sv}</span>
              <span className={`text-xs font-semibold ${SCORE_TEXT[sv]}`}>{SCORE_LABELS[sv]}</span>
              <Button
                variant="ghost"
                size="sm"
                className="ml-auto h-6 text-xs px-2 gap-1 flex-shrink-0"
                onClick={() => hintId && setExamplesFor({ hintId, scoreValue: sv })}
                disabled={!hintId}
                title={hintId ? undefined : 'Save hint first to manage examples'}
              >
                <BookOpen className="h-3 w-3" />
                {exCount > 0 ? `${exCount} example${exCount !== 1 ? 's' : ''}` : 'Examples'}
              </Button>
            </div>
            <Textarea
              rows={2}
              className="text-xs resize-none bg-white/80 border-0 shadow-none focus-visible:ring-1"
              placeholder={`Anchor description for score ${sv}…`}
              value={anchors[sv]}
              onChange={e => handleChange(sv, e.target.value)}
            />
          </div>
        );
      })}

      {examplesFor && (
        <ExamplesDialog
          hintId={examplesFor.hintId}
          scoreValue={examplesFor.scoreValue}
          questionText={question.text}
          onClose={() => setExamplesFor(null)}
        />
      )}
    </div>
  );
}

// ── CategoryDetailPage ────────────────────────────────────────────────────────

type QuestionForm = Omit<Question, 'id' | 'categoryId'>;
const emptyQForm = (): QuestionForm => ({ reviewType: 'peer', type: 'score', text: '', order: 1 });

type CategoryForm = {
  name: string;
  slug: string;
  reviewType: ReviewType | null;
  description: string | null;
};

export function CategoryDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const {
    goalCategories, questions,
    updateGoalCategory,
    addQuestion, updateQuestion, deleteQuestion,
  } = useQuestionStore();

  const category = goalCategories.find(c => c.id === id);
  const categoryQuestions = questions
    .filter(q => q.categoryId === id)
    .sort((a, b) => a.order - b.order);

  const [expandedQId, setExpandedQId] = useState<string | null>(null);

  // ── Category edit ──────────────────────────────────────────────────────────
  const [catEditOpen, setCatEditOpen] = useState(false);
  const [catForm, setCatForm] = useState<CategoryForm>({
    name: '', slug: '', reviewType: null, description: null,
  });

  const openCatEdit = () => {
    if (!category) return;
    setCatForm({
      name: category.name,
      slug: category.slug,
      reviewType: category.reviewType,
      description: category.description,
    });
    setCatEditOpen(true);
  };

  const handleCatSave = () => {
    if (!catForm.name.trim()) { toast.error('Name is required.'); return; }
    if (!catForm.slug.trim()) { toast.error('Slug is required.'); return; }
    updateGoalCategory(id!, catForm);
    toast.success('Category updated.');
    setCatEditOpen(false);
  };

  // ── Question CRUD ──────────────────────────────────────────────────────────
  const [qModalOpen, setQModalOpen] = useState(false);
  const [editQ, setEditQ] = useState<Question | null>(null);
  const [qForm, setQForm] = useState<QuestionForm>(emptyQForm());
  const [deleteQTarget, setDeleteQTarget] = useState<Question | null>(null);

  const openQCreate = () => {
    setEditQ(null);
    setQForm(emptyQForm());
    setQModalOpen(true);
  };

  const openQEdit = (q: Question, e: React.MouseEvent) => {
    e.stopPropagation();
    setEditQ(q);
    setQForm({ reviewType: q.reviewType, type: q.type, text: q.text, order: q.order });
    setQModalOpen(true);
  };

  const handleQSave = () => {
    if (qForm.type === 'essay' && !qForm.text.trim()) {
      toast.error('Question text is required.');
      return;
    }
    if (editQ) {
      updateQuestion(editQ.id, { ...qForm, categoryId: id! });
      toast.success('Question updated.');
    } else {
      addQuestion({ ...qForm, categoryId: id! });
      toast.success('Question added.');
    }
    setQModalOpen(false);
  };

  const handleQDelete = () => {
    if (!deleteQTarget) return;
    deleteQuestion(deleteQTarget.id);
    if (expandedQId === deleteQTarget.id) setExpandedQId(null);
    toast.success('Question deleted.');
    setDeleteQTarget(null);
  };

  // ── Not found ──────────────────────────────────────────────────────────────
  if (!category) {
    return (
      <div className="p-6 text-center space-y-2">
        <p className="text-muted-foreground">Goal category not found.</p>
        <Button variant="link" onClick={() => navigate('/goal-categories')}>
          ← Back to Goal Categories
        </Button>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-4xl">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-sm text-muted-foreground mb-5">
        <Button
          variant="ghost"
          size="sm"
          className="h-7 px-2 gap-1.5 -ml-2 text-muted-foreground hover:text-foreground"
          onClick={() => navigate('/goal-categories')}
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          Goal Categories
        </Button>
        <span className="text-muted-foreground/50">/</span>
        <span className="text-foreground font-medium truncate">{category.name}</span>
      </div>

      {/* Category header card */}
      <div className="rounded-xl border bg-card p-5 mb-7 shadow-sm">
        <div className="flex items-start gap-4">
          <div className="flex-1 min-w-0">
            <div className="flex items-center flex-wrap gap-2 mb-1.5">
              {category.reviewType ? (
                <Badge variant={RT_COLOR[category.reviewType]}>{category.reviewType}</Badge>
              ) : (
                <Badge variant="secondary">Universal</Badge>
              )}
              <code className="text-xs text-muted-foreground bg-muted px-1.5 py-0.5 rounded">
                {category.slug}
              </code>
            </div>
            <h1 className="text-xl font-semibold text-foreground leading-tight">{category.name}</h1>
            {category.description && (
              <p className="text-sm text-muted-foreground mt-1 leading-relaxed">{category.description}</p>
            )}
          </div>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 flex-shrink-0 text-muted-foreground hover:text-foreground"
            onClick={openCatEdit}
          >
            <Pencil className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Questions section */}
      <div className="flex items-center justify-between mb-3">
        <div>
          <h2 className="text-sm font-semibold text-foreground">Questions</h2>
          <p className="text-xs text-muted-foreground mt-0.5">
            {categoryQuestions.length} question{categoryQuestions.length !== 1 ? 's' : ''} — click a row to edit score hints
          </p>
        </div>
        <Button size="sm" onClick={openQCreate} className="gap-1">
          <Plus className="h-4 w-4" />
          Add Question
        </Button>
      </div>

      {/* Questions accordion */}
      <div className="rounded-xl border overflow-hidden divide-y shadow-sm">
        {categoryQuestions.length === 0 && (
          <div className="py-12 text-center text-sm text-muted-foreground">
            No questions yet. Click "Add Question" to get started.
          </div>
        )}
        {categoryQuestions.map(q => {
          const isOpen = expandedQId === q.id;
          return (
            <div key={q.id} className="bg-card">
              {/* Row */}
              <div
                className="flex items-center gap-3 px-4 py-3 cursor-pointer hover:bg-muted/30 group select-none"
                onClick={() => setExpandedQId(isOpen ? null : q.id)}
              >
                <span className="text-muted-foreground flex-shrink-0 w-4">
                  {isOpen
                    ? <ChevronDown className="h-4 w-4" />
                    : <ChevronRight className="h-4 w-4" />}
                </span>
                <span className="flex-1 text-sm text-foreground line-clamp-1">
                  {q.text || <span className="italic text-muted-foreground">(Score question — text auto-generated from category)</span>}
                </span>
                <div className="flex items-center gap-1.5 flex-shrink-0">
                  <Badge
                    variant={q.type === 'score' ? 'info' : 'secondary'}
                    className="text-xs hidden sm:inline-flex"
                  >
                    {q.type === 'score' ? 'Score 1–6' : 'Essay'}
                  </Badge>
                  <Badge variant={RT_COLOR[q.reviewType]} className="text-xs hidden sm:inline-flex">
                    {q.reviewType}
                  </Badge>
                  <span className="text-xs text-muted-foreground w-6 text-right">#{q.order}</span>
                  {/* Actions — visible on hover */}
                  <div
                    className="opacity-0 group-hover:opacity-100 flex items-center gap-0.5 ml-1 transition-opacity"
                    onClick={e => e.stopPropagation()}
                  >
                    <Button
                      variant="ghost" size="icon"
                      className="h-7 w-7"
                      onClick={e => openQEdit(q, e)}
                    >
                      <Pencil className="h-3.5 w-3.5" />
                    </Button>
                    <Button
                      variant="ghost" size="icon"
                      className="h-7 w-7 text-red-500 hover:text-red-600 hover:bg-red-50"
                      onClick={e => { e.stopPropagation(); setDeleteQTarget(q); }}
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </Button>
                  </div>
                </div>
              </div>

              {/* Expanded content */}
              {isOpen && q.type === 'score' && (
                <ScoreHintRows key={q.id} question={q} />
              )}
              {isOpen && q.type === 'essay' && (
                <div className="border-t bg-slate-50/40 px-4 py-4 text-sm text-muted-foreground italic">
                  Essay questions don't have score-based anchor hints.
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* ── Dialogs ── */}

      {/* Category edit */}
      <Dialog open={catEditOpen} onOpenChange={setCatEditOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Goal Category</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-2">
            <div className="grid gap-1.5">
              <Label>Name *</Label>
              <Input
                value={catForm.name}
                onChange={e => setCatForm(f => ({ ...f, name: e.target.value }))}
              />
            </div>
            <div className="grid gap-1.5">
              <Label>Slug *</Label>
              <Input
                value={catForm.slug}
                onChange={e => setCatForm(f => ({ ...f, slug: e.target.value }))}
              />
            </div>
            <div className="grid gap-1.5">
              <Label>Review Type</Label>
              <Select
                value={catForm.reviewType ?? 'universal'}
                onValueChange={v =>
                  setCatForm(f => ({ ...f, reviewType: v === 'universal' ? null : (v as ReviewType) }))
                }
              >
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="universal">
                    <span className="text-muted-foreground">Universal (all types)</span>
                  </SelectItem>
                  <SelectItem value="peer">Peer</SelectItem>
                  <SelectItem value="self">Self</SelectItem>
                  <SelectItem value="manager">Manager</SelectItem>
                  <SelectItem value="subordinate">Subordinate</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-1.5">
              <Label>Description</Label>
              <Textarea
                rows={2}
                value={catForm.description ?? ''}
                onChange={e => setCatForm(f => ({ ...f, description: e.target.value || null }))}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setCatEditOpen(false)}>Cancel</Button>
            <Button onClick={handleCatSave}>Save changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Question add / edit */}
      <Dialog open={qModalOpen} onOpenChange={setQModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editQ ? 'Edit Question' : 'Add Question'}</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-2">
            <div className="grid grid-cols-2 gap-3">
              <div className="grid gap-1.5">
                <Label>Review Type *</Label>
                <Select
                  value={qForm.reviewType}
                  onValueChange={v => setQForm(f => ({ ...f, reviewType: v as ReviewType }))}
                >
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="peer">Peer Review</SelectItem>
                    <SelectItem value="self">Self Review</SelectItem>
                    <SelectItem value="manager">Manager Review</SelectItem>
                    <SelectItem value="subordinate">Subordinate Review</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-1.5">
                <Label>Type *</Label>
                <Select
                  value={qForm.type}
                  onValueChange={v => setQForm(f => ({ ...f, type: v as Question['type'] }))}
                >
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="score">Score (1–6)</SelectItem>
                    <SelectItem value="essay">Essay</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="grid gap-1.5">
              <Label>Display Order</Label>
              <Input
                type="number" min={1}
                value={qForm.order}
                onChange={e => setQForm(f => ({ ...f, order: Number(e.target.value) }))}
              />
            </div>
            <div className="grid gap-1.5">
              <Label>{qForm.type === 'essay' ? 'Question Text *' : 'Question Text'}</Label>
              <Textarea
                rows={3}
                placeholder={
                  qForm.type === 'essay'
                    ? 'e.g. What do you appreciate most about working with this person?'
                    : 'e.g. Seberapa baik kemampuan komunikasi mereka?'
                }
                value={qForm.text}
                onChange={e => setQForm(f => ({ ...f, text: e.target.value }))}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setQModalOpen(false)}>Cancel</Button>
            <Button onClick={handleQSave}>{editQ ? 'Save changes' : 'Add question'}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Question delete confirm */}
      <ConfirmDialog
        open={!!deleteQTarget}
        onOpenChange={open => !open && setDeleteQTarget(null)}
        description="Delete this question? Its score hints and examples will also be removed."
        onConfirm={handleQDelete}
      />
    </div>
  );
}
