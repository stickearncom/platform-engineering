import { useState } from 'react';
import { Plus, Pencil, Trash2, Save } from 'lucide-react';
import { toast } from 'sonner';
import { useQuestionStore } from '@/shared/stores/templateStore';
import { useEmployeeStore } from '@/shared/stores/employeeStore';
import { PageHeader } from '@/shared/components/PageHeader';
import { ConfirmDialog } from '@/shared/components/ConfirmDialog';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import type { ScoreHintExample, ScoreValue, ReviewType } from '@/shared/types';

const SCORE_LABELS: Record<ScoreValue, string> = {
  1: 'Needs Improvement',
  2: 'Below Expectations',
  3: 'Meets Expectations',
  4: 'Exceeds Expectations',
  5: 'Significantly Exceeds',
  6: 'Outstanding',
};

const SCORE_COLORS: Record<ScoreValue, string> = {
  1: 'bg-red-100 text-red-700 border-red-200',
  2: 'bg-orange-100 text-orange-700 border-orange-200',
  3: 'bg-yellow-100 text-yellow-700 border-yellow-200',
  4: 'bg-blue-100 text-blue-700 border-blue-200',
  5: 'bg-green-100 text-green-700 border-green-200',
  6: 'bg-emerald-100 text-emerald-700 border-emerald-200',
};

const REVIEW_TYPE_LABELS: Record<ReviewType, string> = {
  peer: 'Peer Review',
  self: 'Self Review',
  manager: 'Manager Review',
  subordinate: 'Subordinate Review',
};

// ─────────────────────────────────────────────────────────────────────────────
// Tab 1: Anchor Hints (per question, 6 score rows)
// ─────────────────────────────────────────────────────────────────────────────

function AnchorHintsTab() {
  const { questions, scoreHints, addScoreHint, updateScoreHint, deleteScoreHint } = useQuestionStore();
  const [filterType, setFilterType] = useState<ReviewType | 'all'>('all');
  const [selectedQuestionId, setSelectedQuestionId] = useState<string | null>(null);
  const [localAnchors, setLocalAnchors] = useState<Record<ScoreValue, string>>({
    1: '', 2: '', 3: '', 4: '', 5: '', 6: '',
  });
  const [dirty, setDirty] = useState(false);

  const filteredQuestions = filterType === 'all'
    ? questions
    : questions.filter((q) => q.reviewType === filterType);

  const selectedQuestion = questions.find((q) => q.id === selectedQuestionId) ?? null;

  const loadQuestion = (qId: string) => {
    const hints = scoreHints.filter((h) => h.questionId === qId);
    const anchors = { 1: '', 2: '', 3: '', 4: '', 5: '', 6: '' } as Record<ScoreValue, string>;
    hints.forEach((h) => { anchors[h.scoreValue] = h.anchorText; });
    setLocalAnchors(anchors);
    setSelectedQuestionId(qId);
    setDirty(false);
  };

  const handleSave = () => {
    if (!selectedQuestionId) return;
    ([1, 2, 3, 4, 5, 6] as ScoreValue[]).forEach((sv) => {
      const existing = scoreHints.find((h) => h.questionId === selectedQuestionId && h.scoreValue === sv);
      const text = localAnchors[sv].trim();
      if (existing) {
        if (text) updateScoreHint(existing.id, { anchorText: text });
        else deleteScoreHint(existing.id);
      } else {
        if (text) addScoreHint({ questionId: selectedQuestionId, scoreValue: sv, anchorText: text });
      }
    });
    toast.success('Score hints saved.');
    setDirty(false);
  };

  const hintCountFor = (qId: string) => scoreHints.filter((h) => h.questionId === qId).length;

  return (
    <div className="flex gap-6 mt-4 min-h-[500px]">
      {/* Question list */}
      <div className="w-72 shrink-0 flex flex-col gap-2">
        <Select value={filterType} onValueChange={(v) => setFilterType(v as ReviewType | 'all')}>
          <SelectTrigger className="h-8 text-xs">
            <SelectValue placeholder="Filter by type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All types</SelectItem>
            <SelectItem value="self">Self Review</SelectItem>
            <SelectItem value="manager">Manager Review</SelectItem>
            <SelectItem value="peer">Peer Review</SelectItem>
            <SelectItem value="subordinate">Subordinate Review</SelectItem>
          </SelectContent>
        </Select>

        <div className="flex flex-col gap-1 overflow-y-auto max-h-[480px] pr-1">
          {filteredQuestions.map((q) => (
            <button
              key={q.id}
              onClick={() => loadQuestion(q.id)}
              className={`text-left px-3 py-2 rounded-lg border text-sm transition-colors ${
                selectedQuestionId === q.id
                  ? 'bg-primary text-primary-foreground border-primary'
                  : 'bg-background hover:bg-muted border-border'
              }`}
            >
              <div className="font-medium line-clamp-2 leading-snug">{q.text}</div>
              <div className="flex items-center gap-2 mt-1">
                <span className={`text-[10px] px-1 rounded ${selectedQuestionId === q.id ? 'text-primary-foreground/70' : 'text-muted-foreground'}`}>
                  {q.reviewType}
                </span>
                <span className={`text-[10px] ${selectedQuestionId === q.id ? 'text-primary-foreground/70' : 'text-muted-foreground'}`}>
                  {hintCountFor(q.id)}/6 hints
                </span>
              </div>
            </button>
          ))}
          {filteredQuestions.length === 0 && (
            <p className="text-sm text-muted-foreground px-3 py-4">No questions found</p>
          )}
        </div>
      </div>

      {/* Score hint editor */}
      <div className="flex-1">
        {selectedQuestion ? (
          <Card>
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <CardTitle className="text-base leading-snug">{selectedQuestion.text}</CardTitle>
                  <CardDescription className="mt-1">
                    <Badge variant="secondary" className="text-[10px]">
                      {REVIEW_TYPE_LABELS[selectedQuestion.reviewType]}
                    </Badge>
                  </CardDescription>
                </div>
                <Button size="sm" disabled={!dirty} onClick={handleSave}>
                  <Save className="h-4 w-4" />
                  Save hints
                </Button>
              </div>
            </CardHeader>
            <CardContent className="grid gap-3">
              {([1, 2, 3, 4, 5, 6] as ScoreValue[]).map((sv) => (
                <div key={sv} className="flex items-start gap-3">
                  <div className={`shrink-0 mt-1 px-2 py-0.5 rounded border text-xs font-semibold ${SCORE_COLORS[sv]}`}>
                    {sv} — {SCORE_LABELS[sv]}
                  </div>
                  <Textarea
                    rows={2}
                    className="text-sm resize-none flex-1"
                    placeholder="Anchor text describing this score level…"
                    value={localAnchors[sv]}
                    onChange={(e) => {
                      setLocalAnchors((a) => ({ ...a, [sv]: e.target.value }));
                      setDirty(true);
                    }}
                  />
                </div>
              ))}
            </CardContent>
          </Card>
        ) : (
          <div className="flex flex-col items-center justify-center h-full text-center text-muted-foreground gap-2">
            <p className="text-sm">Select a question on the left to edit its score hints.</p>
          </div>
        )}
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Tab 2: Role / Specialization Examples
// ─────────────────────────────────────────────────────────────────────────────

type ExampleForm = Omit<ScoreHintExample, 'id'>;
const emptyExampleForm = (): ExampleForm => ({
  scoreHintId: '',
  roleId: '',
  exampleText: '',
});

function RoleExamplesTab() {
  const { questions, scoreHints, scoreHintExamples, addScoreHintExample, updateScoreHintExample, deleteScoreHintExample } = useQuestionStore();
  const { roles } = useEmployeeStore();

  const [filterQId, setFilterQId] = useState<string>('all');
  const [modalOpen, setModalOpen] = useState(false);
  const [editTarget, setEditTarget] = useState<ScoreHintExample | null>(null);
  const [form, setForm] = useState<ExampleForm>(emptyExampleForm());
  const [deleteTarget, setDeleteTarget] = useState<ScoreHintExample | null>(null);

  const filteredExamples = filterQId === 'all'
    ? scoreHintExamples
    : scoreHintExamples.filter((ex) => {
        const hint = scoreHints.find((h) => h.id === ex.scoreHintId);
        return hint?.questionId === filterQId;
      });

  const getHintLabel = (hintId: string) => {
    const hint = scoreHints.find((h) => h.id === hintId);
    if (!hint) return '—';
    const q = questions.find((q) => q.id === hint.questionId);
    return `${q?.text?.slice(0, 40) ?? '?'}… [${hint.scoreValue}]`;
  };

  const getRoleName = (roleId: string) => roles.find((r) => r.id === roleId)?.name ?? roleId;

  const openCreate = () => { setEditTarget(null); setForm(emptyExampleForm()); setModalOpen(true); };
  const openEdit = (ex: ScoreHintExample) => {
    setEditTarget(ex);
    setForm({ scoreHintId: ex.scoreHintId, roleId: ex.roleId, exampleText: ex.exampleText });
    setModalOpen(true);
  };

  const handleSave = () => {
    if (!form.scoreHintId) { toast.error('Select a score hint.'); return; }
    if (!form.roleId) { toast.error('Select a specialization.'); return; }
    if (!form.exampleText.trim()) { toast.error('Example text is required.'); return; }
    if (editTarget) { updateScoreHintExample(editTarget.id, form); toast.success('Example updated.'); }
    else { addScoreHintExample(form); toast.success('Example added.'); }
    setModalOpen(false);
  };

  const handleDelete = () => {
    if (!deleteTarget) return;
    deleteScoreHintExample(deleteTarget.id);
    toast.success('Example deleted.');
    setDeleteTarget(null);
  };

  return (
    <div className="mt-4 flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <Select value={filterQId} onValueChange={setFilterQId}>
          <SelectTrigger className="h-8 text-xs w-72">
            <SelectValue placeholder="Filter by question" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All questions</SelectItem>
            {questions.map((q) => (
              <SelectItem key={q.id} value={q.id}>{q.text.slice(0, 55)}…</SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Button size="sm" onClick={openCreate}>
          <Plus className="h-4 w-4" />
          Add example
        </Button>
      </div>

      <div className="rounded-md border overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-muted text-muted-foreground text-xs uppercase">
            <tr>
              <th className="px-4 py-2 text-left">Score Hint</th>
              <th className="px-4 py-2 text-left">Specialization</th>
              <th className="px-4 py-2 text-left">Example Text</th>
              <th className="px-4 py-2 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredExamples.length === 0 ? (
              <tr>
                <td colSpan={4} className="text-center text-muted-foreground py-8">No examples yet</td>
              </tr>
            ) : filteredExamples.map((ex) => {
              const hint = scoreHints.find((h) => h.id === ex.scoreHintId);
              return (
                <tr key={ex.id} className="border-t">
                  <td className="px-4 py-2">
                    <div className="text-xs text-muted-foreground line-clamp-1">{getHintLabel(ex.scoreHintId)}</div>
                    {hint && (
                      <span className={`text-[10px] px-1.5 rounded border ${SCORE_COLORS[hint.scoreValue]}`}>
                        Score {hint.scoreValue} — {SCORE_LABELS[hint.scoreValue]}
                      </span>
                    )}
                  </td>
                  <td className="px-4 py-2">
                    <span className="text-xs font-medium">{getRoleName(ex.roleId)}</span>
                  </td>
                  <td className="px-4 py-2">
                    <p className="line-clamp-2 text-sm">{ex.exampleText}</p>
                  </td>
                  <td className="px-4 py-2 text-right">
                    <div className="flex items-center justify-end gap-1">
                      <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => openEdit(ex)}>
                        <Pencil className="h-3.5 w-3.5" />
                      </Button>
                      <Button
                        variant="ghost" size="icon" className="h-7 w-7 text-red-500 hover:text-red-600 hover:bg-red-50"
                        onClick={() => setDeleteTarget(ex)}
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </Button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <Dialog open={modalOpen} onOpenChange={setModalOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>{editTarget ? 'Edit Example' : 'Add Specialization Example'}</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-2">
            <div className="grid gap-1.5">
              <Label>Question *</Label>
              <Select
                value={form.scoreHintId}
                onValueChange={(v) => setForm((f) => ({ ...f, scoreHintId: v }))}
              >
                <SelectTrigger><SelectValue placeholder="Select score hint…" /></SelectTrigger>
                <SelectContent>
                  {scoreHints.map((h) => {
                    const q = questions.find((q) => q.id === h.questionId);
                    return (
                      <SelectItem key={h.id} value={h.id}>
                        [{h.scoreValue}] {q?.text?.slice(0, 45)}…
                      </SelectItem>
                    );
                  })}
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-1.5">
              <Label>Specialization *</Label>
              <Select
                value={form.roleId}
                onValueChange={(v) => setForm((f) => ({ ...f, roleId: v }))}
              >
                <SelectTrigger><SelectValue placeholder="Select specialization…" /></SelectTrigger>
                <SelectContent>
                  {roles.map((r) => (
                    <SelectItem key={r.id} value={r.id}>{r.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-1.5">
              <Label>Example Text *</Label>
              <Textarea
                rows={3}
                placeholder="Describe a concrete example demonstrating this score for this specialization…"
                value={form.exampleText}
                onChange={(e) => setForm((f) => ({ ...f, exampleText: e.target.value }))}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setModalOpen(false)}>Cancel</Button>
            <Button onClick={handleSave}>{editTarget ? 'Save changes' : 'Add example'}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <ConfirmDialog
        open={!!deleteTarget}
        onOpenChange={(o) => !o && setDeleteTarget(null)}
        description="Delete this specialization example? This cannot be undone."
        onConfirm={handleDelete}
      />
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Main Page
// ─────────────────────────────────────────────────────────────────────────────

export function ScoreHintsPage() {
  return (
    <div className="p-6">
      <PageHeader
        title="Score Hints"
        description="Manage scoring anchor text (1–6) and division-specific examples for each review question"
      />
      <Tabs defaultValue="anchors" className="mt-4">
        <TabsList>
          <TabsTrigger value="anchors">Anchor Hints</TabsTrigger>
          <TabsTrigger value="examples">Specialization Examples</TabsTrigger>
        </TabsList>
        <TabsContent value="anchors">
          <AnchorHintsTab />
        </TabsContent>
        <TabsContent value="examples">
          <RoleExamplesTab />
        </TabsContent>
      </Tabs>
    </div>
  );
}
