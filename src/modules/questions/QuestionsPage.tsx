import { useState } from 'react';
import { Plus, Pencil, Trash2 } from 'lucide-react';
import { toast } from 'sonner';
import { useQuestionStore } from '@/shared/stores/templateStore';
import { useTable } from '@/shared/hooks/useTable';
import { DataTable } from '@/shared/components/DataTable';
import { PageHeader } from '@/shared/components/PageHeader';
import { ConfirmDialog } from '@/shared/components/ConfirmDialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import type { Question, ReviewType } from '@/shared/types';

type QuestionForm = Omit<Question, 'id'>;

const emptyForm = (): QuestionForm => ({ reviewType: 'self', categoryId: null, type: 'score', text: '', order: 1 });

const REVIEW_TYPE_LABELS: Record<ReviewType, string> = {
  peer: 'Peer',
  self: 'Self',
  manager: 'Manager',
  subordinate: 'Subordinate',
};

export function QuestionsPage() {
  const { questions, goalCategories, addQuestion, updateQuestion, deleteQuestion } = useQuestionStore();
  const [modalOpen, setModalOpen] = useState(false);
  const [editTarget, setEditTarget] = useState<Question | null>(null);
  const [form, setForm] = useState<QuestionForm>(emptyForm());
  const [deleteTarget, setDeleteTarget] = useState<Question | null>(null);

  const table = useTable({
    data: questions as unknown as Record<string, unknown>[],
    searchFields: ['text'],
  });

  const openCreate = () => { setEditTarget(null); setForm(emptyForm()); setModalOpen(true); };
  const openEdit = (q: Question) => {
    setEditTarget(q);
    setForm({ reviewType: q.reviewType, categoryId: q.categoryId, type: q.type, text: q.text, order: q.order });
    setModalOpen(true);
  };

  const handleSave = () => {
    if (form.type === 'score' && !form.categoryId) { toast.error('Goal category is required for score questions.'); return; }
    if (form.type === 'essay' && !form.text.trim()) { toast.error('Question text is required for essay type.'); return; }
    if (editTarget) { updateQuestion(editTarget.id, form); toast.success('Question updated.'); }
    else { addQuestion(form); toast.success('Question added.'); }
    setModalOpen(false);
  };

  const handleDelete = () => {
    if (!deleteTarget) return;
    deleteQuestion(deleteTarget.id);
    toast.success('Question deleted.');
    setDeleteTarget(null);
  };

  const getCategoryName = (id: string | null) => id ? (goalCategories.find((c) => c.id === id)?.name ?? '—') : '—';

  const columns = [
    {
      key: 'text',
      label: 'Question',
      render: (item: Record<string, unknown>) => (
        <span className="text-sm text-gray-800 line-clamp-2">{item.text as string}</span>
      ),
    },
    {
      key: 'reviewType',
      label: 'Review Type',
      render: (item: Record<string, unknown>) => (
        <Badge variant={item.reviewType === 'self' ? 'success' : item.reviewType === 'manager' ? 'warning' : item.reviewType === 'subordinate' ? 'secondary' : 'info'}>
          {REVIEW_TYPE_LABELS[item.reviewType as ReviewType]}
        </Badge>
      ),
    },
    {
      key: 'type',
      label: 'Type',
      render: (item: Record<string, unknown>) => (
        <Badge variant={item.type === 'score' ? 'info' : 'secondary'}>
          {item.type === 'score' ? 'Score (1–6)' : 'Essay'}
        </Badge>
      ),
    },
    {
      key: 'categoryId',
      label: 'Goal Category',
      render: (item: Record<string, unknown>) => (
        <span className="text-sm text-muted-foreground">{getCategoryName(item.categoryId as string)}</span>
      ),
    },
    {
      key: 'order',
      label: '#',
      className: 'w-12 text-center',
      render: (item: Record<string, unknown>) => (
        <span className="text-xs text-muted-foreground text-center block">{item.order as number}</span>
      ),
    },
  ];

  return (
    <div className="p-6">
      <PageHeader
        title="Questions"
        description={`${questions.length} questions across all review types`}
        action={
          <Button onClick={openCreate} size="sm">
            <Plus className="h-4 w-4" />
            Add Question
          </Button>
        }
      />

      <DataTable
        columns={columns}
        data={table.filteredData}
        paginatedData={table.paginatedData}
        searchTerm={table.searchTerm}
        setSearchTerm={table.setSearchTerm}
        currentPage={table.currentPage}
        totalPages={table.totalPages}
        totalItems={table.totalItems}
        pageSize={table.pageSize}
        setPage={table.setPage}
        setPageSize={table.setPageSize}
        searchPlaceholder="Search question text…"
        actions={(item) => (
          <div className="flex items-center justify-end gap-1">
            <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => openEdit(item as unknown as Question)}>
              <Pencil className="h-3.5 w-3.5" />
            </Button>
            <Button
              variant="ghost" size="icon" className="h-7 w-7 text-red-500 hover:text-red-600 hover:bg-red-50"
              onClick={() => setDeleteTarget(item as unknown as Question)}
            >
              <Trash2 className="h-3.5 w-3.5" />
            </Button>
          </div>
        )}
      />

      <Dialog open={modalOpen} onOpenChange={setModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editTarget ? 'Edit Question' : 'Add Question'}</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-2">
            <div className="grid gap-1.5">
              <Label>Review Type *</Label>
              <Select value={form.reviewType} onValueChange={(v) => setForm((f) => ({ ...f, reviewType: v as ReviewType }))}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="self">Self Review</SelectItem>
                  <SelectItem value="manager">Manager Review</SelectItem>
                  <SelectItem value="peer">Peer Review</SelectItem>
                  <SelectItem value="subordinate">Subordinate Review</SelectItem>
                </SelectContent>
              </Select>
            </div>            <div className="grid gap-1.5">
              <Label>{form.type === 'score' ? 'Goal Category *' : 'Goal Category'}</Label>
              <Select
                value={form.categoryId ?? 'none'}
                onValueChange={(v) => setForm((f) => ({ ...f, categoryId: v === 'none' ? null : v }))}
              >
                <SelectTrigger><SelectValue placeholder="Choose category" /></SelectTrigger>
                <SelectContent>
                  {form.type === 'essay' && (
                    <SelectItem value="none"><span className="text-muted-foreground">None (General / Cross-cutting)</span></SelectItem>
                  )}
                  {goalCategories.map((c) => <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>            <div className="grid grid-cols-2 gap-3">
              <div className="grid gap-1.5">
                <Label>Type *</Label>
                <Select value={form.type} onValueChange={(v) => setForm((f) => ({ ...f, type: v as Question['type'], text: v === 'score' ? '' : f.text }))}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="score">Score (1–6)</SelectItem>
                    <SelectItem value="essay">Essay</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-1.5">
                <Label>Order</Label>
                <Input type="number" min={1} value={form.order} onChange={(e) => setForm((f) => ({ ...f, order: Number(e.target.value) }))} />
              </div>
            </div>
            {form.type === 'essay' && (
              <div className="grid gap-1.5">
                <Label>Question Text *</Label>
                <Textarea
                  placeholder="e.g. What do you appreciate most about working with this person?"
                  rows={3}
                  value={form.text}
                  onChange={(e) => setForm((f) => ({ ...f, text: e.target.value }))}
                />
              </div>
            )}
            {form.type === 'score' && (
              <p className="text-xs text-muted-foreground bg-muted px-3 py-2 rounded">
                Score hints (1–6) are managed per-question in the <strong>Score Hints</strong> page.
              </p>
            )}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setModalOpen(false)}>Cancel</Button>
            <Button onClick={handleSave}>{editTarget ? 'Save changes' : 'Add question'}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <ConfirmDialog
        open={!!deleteTarget}
        onOpenChange={(o) => !o && setDeleteTarget(null)}
        description="Delete this question? All associated answers will be unlinked."
        onConfirm={handleDelete}
      />
    </div>
  );
}
