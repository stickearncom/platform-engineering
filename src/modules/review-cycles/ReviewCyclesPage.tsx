import { useState } from 'react';
import { Plus, Pencil, Trash2 } from 'lucide-react';
import { toast } from 'sonner';
import { useReviewStore } from '@/shared/stores/reviewStore';
import { useTable } from '@/shared/hooks/useTable';
import { DataTable } from '@/shared/components/DataTable';
import { PageHeader } from '@/shared/components/PageHeader';
import { ConfirmDialog } from '@/shared/components/ConfirmDialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { formatDate } from '@/lib/utils';
import type { ReviewCycle } from '@/shared/types';

type CycleForm = Omit<ReviewCycle, 'id'>;
const emptyForm = (): CycleForm => ({ name: '', startDate: '', endDate: '' });

export function ReviewCyclesPage() {
  const { reviewCycles, assignments, addCycle, updateCycle, deleteCycle } = useReviewStore();
  const [modalOpen, setModalOpen] = useState(false);
  const [editTarget, setEditTarget] = useState<ReviewCycle | null>(null);
  const [form, setForm] = useState<CycleForm>(emptyForm());
  const [deleteTarget, setDeleteTarget] = useState<ReviewCycle | null>(null);

  const table = useTable({
    data: reviewCycles as unknown as Record<string, unknown>[],
    searchFields: ['name'],
  });

  const openCreate = () => { setEditTarget(null); setForm(emptyForm()); setModalOpen(true); };
  const openEdit = (c: ReviewCycle) => {
    setEditTarget(c);
    setForm({ name: c.name, startDate: c.startDate, endDate: c.endDate });
    setModalOpen(true);
  };

  const handleSave = () => {
    if (!form.name.trim() || !form.startDate || !form.endDate) {
      toast.error('All fields are required.');
      return;
    }
    if (editTarget) { updateCycle(editTarget.id, form); toast.success('Cycle updated.'); }
    else { addCycle(form); toast.success('Cycle created.'); }
    setModalOpen(false);
  };

  const handleDelete = () => {
    if (!deleteTarget) return;
    deleteCycle(deleteTarget.id);
    toast.success('Cycle deleted.');
    setDeleteTarget(null);
  };

  const isActive = (c: ReviewCycle) => {
    const now = new Date();
    return new Date(c.startDate) <= now && now <= new Date(c.endDate);
  };

  const columns = [
    {
      key: 'name',
      label: 'Cycle Name',
      render: (item: Record<string, unknown>) => {
        const c = item as unknown as ReviewCycle;
        return (
          <div className="flex items-center gap-2">
            <span className="font-medium text-foreground">{c.name}</span>
            {isActive(c) && <Badge variant="success">Active</Badge>}
          </div>
        );
      },
    },
    {
      key: 'startDate',
      label: 'Start Date',
      render: (item: Record<string, unknown>) => <span className="text-sm">{formatDate(item.startDate as string)}</span>,
    },
    {
      key: 'endDate',
      label: 'End Date',
      render: (item: Record<string, unknown>) => <span className="text-sm">{formatDate(item.endDate as string)}</span>,
    },
    {
      key: 'id',
      label: 'Assignments',
      render: (item: Record<string, unknown>) => (
        <span className="text-sm text-muted-foreground">
          {assignments.filter((a) => a.cycleId === item.id).length} assignments
        </span>
      ),
    },
  ];

  return (
    <div className="p-6">
      <PageHeader
        title="Review Cycles"
        description={`${reviewCycles.length} cycles`}
        action={
          <Button onClick={openCreate} size="sm">
            <Plus className="h-4 w-4" />
            New Cycle
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
        searchPlaceholder="Search cycles…"
        actions={(item) => (
          <div className="flex items-center justify-end gap-1">
            <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => openEdit(item as unknown as ReviewCycle)}>
              <Pencil className="h-3.5 w-3.5" />
            </Button>
            <Button
              variant="ghost" size="icon" className="h-7 w-7 text-red-500 hover:text-red-600 hover:bg-red-50"
              onClick={() => setDeleteTarget(item as unknown as ReviewCycle)}
            >
              <Trash2 className="h-3.5 w-3.5" />
            </Button>
          </div>
        )}
      />

      <Dialog open={modalOpen} onOpenChange={setModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editTarget ? 'Edit Cycle' : 'New Review Cycle'}</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-2">
            <div className="grid gap-1.5">
              <Label>Name *</Label>
              <Input placeholder="e.g. Q3 2025 Review" value={form.name} onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))} />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="grid gap-1.5">
                <Label>Start Date *</Label>
                <Input type="date" value={form.startDate} onChange={(e) => setForm((f) => ({ ...f, startDate: e.target.value }))} />
              </div>
              <div className="grid gap-1.5">
                <Label>End Date *</Label>
                <Input type="date" value={form.endDate} onChange={(e) => setForm((f) => ({ ...f, endDate: e.target.value }))} />
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setModalOpen(false)}>Cancel</Button>
            <Button onClick={handleSave}>{editTarget ? 'Save changes' : 'Create cycle'}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <ConfirmDialog
        open={!!deleteTarget}
        onOpenChange={(o) => !o && setDeleteTarget(null)}
        description={`Delete cycle "${deleteTarget?.name}"?`}
        onConfirm={handleDelete}
      />
    </div>
  );
}
