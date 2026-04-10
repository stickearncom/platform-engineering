import { useState } from 'react';
import { Plus, Pencil, Trash2 } from 'lucide-react';
import { toast } from 'sonner';
import { useReviewStore } from '@/shared/stores/reviewStore';
import { useEmployeeStore } from '@/shared/stores/employeeStore';
import { useTemplateStore } from '@/shared/stores/templateStore';
import { useTable } from '@/shared/hooks/useTable';
import { DataTable } from '@/shared/components/DataTable';
import { PageHeader } from '@/shared/components/PageHeader';
import { ConfirmDialog } from '@/shared/components/ConfirmDialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { formatDate } from '@/lib/utils';
import type { ReviewAssignment } from '@/shared/types';

type AssignmentForm = Omit<ReviewAssignment, 'id' | 'status'>;
const emptyForm = (): AssignmentForm => ({
  reviewerId: '',
  revieweeId: '',
  reviewType: 'peer',
  templateId: '',
  cycleId: '',
  dueDate: '',
});

const statusVariant = { pending: 'warning', submitted: 'success' } as const;
const typeVariant = { peer: 'info', self: 'secondary', manager: 'warning' } as const;

export function AssignmentsPage() {
  const { assignments, reviewCycles, addAssignment, updateAssignment, deleteAssignment } = useReviewStore();
  const { employees } = useEmployeeStore();
  const { templates } = useTemplateStore();
  const [modalOpen, setModalOpen] = useState(false);
  const [editTarget, setEditTarget] = useState<ReviewAssignment | null>(null);
  const [form, setForm] = useState<AssignmentForm>(emptyForm());
  const [deleteTarget, setDeleteTarget] = useState<ReviewAssignment | null>(null);

  // Enrich assignments for search
  const enriched = assignments.map((a) => ({
    ...a,
    reviewerName: employees.find((e) => e.id === a.reviewerId)?.name ?? '',
    revieweeName: employees.find((e) => e.id === a.revieweeId)?.name ?? '',
  }));

  const table = useTable({
    data: enriched as unknown as Record<string, unknown>[],
    searchFields: ['reviewerName', 'revieweeName'],
  });

  const openCreate = () => { setEditTarget(null); setForm(emptyForm()); setModalOpen(true); };
  const openEdit = (a: ReviewAssignment) => {
    setEditTarget(a);
    setForm({ reviewerId: a.reviewerId, revieweeId: a.revieweeId, reviewType: a.reviewType, templateId: a.templateId, cycleId: a.cycleId, dueDate: a.dueDate });
    setModalOpen(true);
  };

  const handleSave = () => {
    if (!form.reviewerId || !form.revieweeId || !form.templateId || !form.cycleId || !form.dueDate) {
      toast.error('All fields are required.');
      return;
    }
    if (editTarget) {
      updateAssignment(editTarget.id, form);
      toast.success('Assignment updated.');
    } else {
      addAssignment({ ...form, status: 'pending' });
      toast.success('Assignment created.');
    }
    setModalOpen(false);
  };

  const handleDelete = () => {
    if (!deleteTarget) return;
    deleteAssignment(deleteTarget.id);
    toast.success('Assignment deleted.');
    setDeleteTarget(null);
  };

  const getName = (id: string) => employees.find((e) => e.id === id)?.name ?? '—';
  const getCycleName = (id: string) => reviewCycles.find((c) => c.id === id)?.name ?? '—';
  const getTemplateName = (id: string) => templates.find((t) => t.id === id)?.name ?? '—';

  const columns = [
    {
      key: 'reviewerId',
      label: 'Reviewer',
      render: (item: Record<string, unknown>) => (
        <span className="font-medium text-gray-800">{getName(item.reviewerId as string)}</span>
      ),
    },
    {
      key: 'revieweeId',
      label: 'Reviewee',
      render: (item: Record<string, unknown>) => (
        <span className="text-foreground">{getName(item.revieweeId as string)}</span>
      ),
    },
    {
      key: 'reviewType',
      label: 'Type',
      render: (item: Record<string, unknown>) => (
        <Badge variant={typeVariant[item.reviewType as keyof typeof typeVariant] ?? 'secondary'}>
          {item.reviewType as string}
        </Badge>
      ),
    },
    {
      key: 'cycleId',
      label: 'Cycle',
      render: (item: Record<string, unknown>) => <span className="text-sm">{getCycleName(item.cycleId as string)}</span>,
    },
    {
      key: 'templateId',
      label: 'Template',
      render: (item: Record<string, unknown>) => <span className="text-sm text-muted-foreground truncate max-w-[120px] block">{getTemplateName(item.templateId as string)}</span>,
    },
    {
      key: 'dueDate',
      label: 'Due',
      render: (item: Record<string, unknown>) => <span className="text-sm">{formatDate(item.dueDate as string)}</span>,
    },
    {
      key: 'status',
      label: 'Status',
      render: (item: Record<string, unknown>) => (
        <Badge variant={statusVariant[item.status as keyof typeof statusVariant] ?? 'secondary'}>
          {item.status as string}
        </Badge>
      ),
    },
  ];

  return (
    <div className="p-6">
      <PageHeader
        title="Assignments"
        description={`${assignments.length} total assignments`}
        action={
          <Button onClick={openCreate} size="sm">
            <Plus className="h-4 w-4" />
            New Assignment
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
        searchPlaceholder="Search by reviewer or reviewee…"
        actions={(item) => (
          <div className="flex items-center justify-end gap-1">
            <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => openEdit(item as unknown as ReviewAssignment)}>
              <Pencil className="h-3.5 w-3.5" />
            </Button>
            <Button
              variant="ghost" size="icon" className="h-7 w-7 text-red-500 hover:text-red-600 hover:bg-red-50"
              onClick={() => setDeleteTarget(item as unknown as ReviewAssignment)}
            >
              <Trash2 className="h-3.5 w-3.5" />
            </Button>
          </div>
        )}
      />

      <Dialog open={modalOpen} onOpenChange={setModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editTarget ? 'Edit Assignment' : 'New Assignment'}</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-2">
            <div className="grid grid-cols-2 gap-3">
              <div className="grid gap-1.5">
                <Label>Reviewer *</Label>
                <Select value={form.reviewerId} onValueChange={(v) => setForm((f) => ({ ...f, reviewerId: v }))}>
                  <SelectTrigger><SelectValue placeholder="Select reviewer" /></SelectTrigger>
                  <SelectContent>
                    {employees.map((e) => <SelectItem key={e.id} value={e.id}>{e.name}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-1.5">
                <Label>Reviewee *</Label>
                <Select value={form.revieweeId} onValueChange={(v) => setForm((f) => ({ ...f, revieweeId: v }))}>
                  <SelectTrigger><SelectValue placeholder="Select reviewee" /></SelectTrigger>
                  <SelectContent>
                    {employees.map((e) => <SelectItem key={e.id} value={e.id}>{e.name}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="grid gap-1.5">
                <Label>Review Type *</Label>
                <Select value={form.reviewType} onValueChange={(v) => setForm((f) => ({ ...f, reviewType: v as ReviewAssignment['reviewType'] }))}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="peer">Peer</SelectItem>
                    <SelectItem value="self">Self</SelectItem>
                    <SelectItem value="manager">Manager</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-1.5">
                <Label>Template *</Label>
                <Select value={form.templateId} onValueChange={(v) => setForm((f) => ({ ...f, templateId: v }))}>
                  <SelectTrigger><SelectValue placeholder="Select template" /></SelectTrigger>
                  <SelectContent>
                    {templates.map((t) => <SelectItem key={t.id} value={t.id}>{t.name}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="grid gap-1.5">
                <Label>Cycle *</Label>
                <Select value={form.cycleId} onValueChange={(v) => setForm((f) => ({ ...f, cycleId: v }))}>
                  <SelectTrigger><SelectValue placeholder="Select cycle" /></SelectTrigger>
                  <SelectContent>
                    {reviewCycles.map((c) => <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-1.5">
                <Label>Due Date *</Label>
                <Input type="date" value={form.dueDate} onChange={(e) => setForm((f) => ({ ...f, dueDate: e.target.value }))} />
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setModalOpen(false)}>Cancel</Button>
            <Button onClick={handleSave}>{editTarget ? 'Save changes' : 'Create assignment'}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <ConfirmDialog
        open={!!deleteTarget}
        onOpenChange={(o) => !o && setDeleteTarget(null)}
        description="Delete this assignment? This cannot be undone."
        onConfirm={handleDelete}
      />
    </div>
  );
}
