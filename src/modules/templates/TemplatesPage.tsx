import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Pencil, Trash2, ChevronRight } from 'lucide-react';
import { toast } from 'sonner';
import { useQuestionStore } from '@/shared/stores/templateStore';
import { useTable } from '@/shared/hooks/useTable';
import { DataTable } from '@/shared/components/DataTable';
import { PageHeader } from '@/shared/components/PageHeader';
import { ConfirmDialog } from '@/shared/components/ConfirmDialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import type { GoalCategory, ReviewType } from '@/shared/types';

type CategoryForm = Omit<GoalCategory, 'id'>;
const emptyForm = (): CategoryForm => ({
  name: '',
  slug: '',
  reviewType: null,
  description: null,
});

const reviewTypeColor: Record<string, 'info' | 'success' | 'warning' | 'secondary'> = {
  peer: 'info',
  self: 'success',
  manager: 'warning',
  subordinate: 'secondary',
};

export function GoalCategoriesPage() {
  const navigate = useNavigate();
  const { goalCategories, questions, addGoalCategory, updateGoalCategory, deleteGoalCategory } = useQuestionStore();
  const [modalOpen, setModalOpen] = useState(false);
  const [editTarget, setEditTarget] = useState<GoalCategory | null>(null);
  const [form, setForm] = useState<CategoryForm>(emptyForm());
  const [deleteTarget, setDeleteTarget] = useState<GoalCategory | null>(null);

  const table = useTable({
    data: goalCategories as unknown as Record<string, unknown>[],
    searchFields: ['name', 'slug'],
  });

  const openCreate = () => { setEditTarget(null); setForm(emptyForm()); setModalOpen(true); };
  const openEdit = (c: GoalCategory) => {
    setEditTarget(c);
    setForm({ name: c.name, slug: c.slug, reviewType: c.reviewType, description: c.description });
    setModalOpen(true);
  };

  const handleSave = () => {
    if (!form.name.trim()) { toast.error('Name is required.'); return; }
    if (!form.slug.trim()) { toast.error('Slug is required.'); return; }
    if (editTarget) { updateGoalCategory(editTarget.id, form); toast.success('Goal category updated.'); }
    else { addGoalCategory(form); toast.success('Goal category created.'); }
    setModalOpen(false);
  };

  const handleDelete = () => {
    if (!deleteTarget) return;
    deleteGoalCategory(deleteTarget.id);
    toast.success('Goal category deleted.');
    setDeleteTarget(null);
  };

  const getQuestionCount = (catId: string) => questions.filter((q) => q.categoryId === catId).length;

  const columns = [
    {
      key: 'name',
      label: 'Category Name',
      render: (item: Record<string, unknown>) => (
        <button
          className="font-medium text-foreground hover:text-primary hover:underline text-left"
          onClick={() => navigate(`/goal-categories/${item.id as string}`)}
        >
          {item.name as string}
        </button>
      ),
    },
    {
      key: 'slug',
      label: 'Slug',
      render: (item: Record<string, unknown>) => (
        <code className="text-xs bg-muted px-1.5 py-0.5 rounded text-muted-foreground">{item.slug as string}</code>
      ),
    },
    {
      key: 'reviewType',
      label: 'Review Type',
      render: (item: Record<string, unknown>) => {
        const rt = item.reviewType as ReviewType | null;
        if (!rt) return <span className="text-xs text-muted-foreground">Universal</span>;
        return <Badge variant={reviewTypeColor[rt] ?? 'secondary'}>{rt}</Badge>;
      },
    },
    {
      key: 'description',
      label: 'Description',
      render: (item: Record<string, unknown>) => (
        <span className="text-sm text-muted-foreground line-clamp-1">{(item.description as string) ?? '—'}</span>
      ),
    },
    {
      key: 'id',
      label: 'Questions',
      render: (item: Record<string, unknown>) => (
        <span className="text-sm text-muted-foreground">{getQuestionCount(item.id as string)}</span>
      ),
    },
  ];

  return (
    <div className="p-6">
      <PageHeader
        title="Goal Categories"
        description="Define goal categories that route questions by review type (ERD v6: goal_categories)"
        action={
          <Button onClick={openCreate} size="sm">
            <Plus className="h-4 w-4" />
            New Category
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
        searchPlaceholder="Search categories…"
        actions={(item) => (
          <div className="flex items-center justify-end gap-1">
            <Button
              variant="ghost" size="sm"
              className="h-7 text-xs gap-1 text-muted-foreground"
              onClick={() => navigate(`/goal-categories/${item.id as string}`)}
            >
              Questions
              <ChevronRight className="h-3 w-3" />
            </Button>
            <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => openEdit(item as unknown as GoalCategory)}>
              <Pencil className="h-3.5 w-3.5" />
            </Button>
            <Button
              variant="ghost" size="icon" className="h-7 w-7 text-red-500 hover:text-red-600 hover:bg-red-50"
              onClick={() => setDeleteTarget(item as unknown as GoalCategory)}
            >
              <Trash2 className="h-3.5 w-3.5" />
            </Button>
          </div>
        )}
      />

      <Dialog open={modalOpen} onOpenChange={setModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editTarget ? 'Edit Goal Category' : 'New Goal Category'}</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-2">
            <div className="grid gap-1.5">
              <Label>Name *</Label>
              <Input
                placeholder="e.g. Delivery & Reliability"
                value={form.name}
                onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
              />
            </div>
            <div className="grid gap-1.5">
              <Label>Slug *</Label>
              <Input
                placeholder="e.g. delivery_reliability"
                value={form.slug}
                onChange={(e) => setForm((f) => ({ ...f, slug: e.target.value }))}
              />
            </div>
            <div className="grid gap-1.5">
              <Label>Review Type</Label>
              <Select
                value={form.reviewType ?? 'universal'}
                onValueChange={(v) => setForm((f) => ({ ...f, reviewType: v === 'universal' ? null : (v as ReviewType) }))}
              >
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="universal"><span className="text-muted-foreground">Universal (all types)</span></SelectItem>
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
                placeholder="Brief description of this category…"
                rows={2}
                value={form.description ?? ''}
                onChange={(e) => setForm((f) => ({ ...f, description: e.target.value || null }))}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setModalOpen(false)}>Cancel</Button>
            <Button onClick={handleSave}>{editTarget ? 'Save changes' : 'Create category'}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <ConfirmDialog
        open={!!deleteTarget}
        onOpenChange={(o) => !o && setDeleteTarget(null)}
        description="Delete this goal category? Questions linked to it will lose their category."
        onConfirm={handleDelete}
      />
    </div>
  );
}

/** @deprecated Use GoalCategoriesPage */
export { GoalCategoriesPage as TemplatesPage };
