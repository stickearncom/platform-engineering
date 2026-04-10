import { useState } from 'react';
import { Plus, Pencil, Trash2 } from 'lucide-react';
import { toast } from 'sonner';
import { useTemplateStore } from '@/shared/stores/templateStore';
import { useEmployeeStore } from '@/shared/stores/employeeStore';
import { useTable } from '@/shared/hooks/useTable';
import { DataTable } from '@/shared/components/DataTable';
import { PageHeader } from '@/shared/components/PageHeader';
import { ConfirmDialog } from '@/shared/components/ConfirmDialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import type { QuestionTemplate } from '@/shared/types';

type TemplateForm = Omit<QuestionTemplate, 'id'>;
const emptyForm = (): TemplateForm => ({
  name: '',
  reviewType: 'peer',
  reviewerRoleId: null,
  revieweeRoleId: null,
  priority: 1,
});

const reviewTypeColor: Record<string, 'info' | 'success' | 'warning'> = {
  peer: 'info',
  self: 'success',
  manager: 'warning',
};

export function TemplatesPage() {
  const { templates, questions, addTemplate, updateTemplate, deleteTemplate } = useTemplateStore();
  const { roles } = useEmployeeStore();
  const [modalOpen, setModalOpen] = useState(false);
  const [editTarget, setEditTarget] = useState<QuestionTemplate | null>(null);
  const [form, setForm] = useState<TemplateForm>(emptyForm());
  const [deleteTarget, setDeleteTarget] = useState<QuestionTemplate | null>(null);

  const table = useTable({
    data: templates as unknown as Record<string, unknown>[],
    searchFields: ['name'],
  });

  const openCreate = () => { setEditTarget(null); setForm(emptyForm()); setModalOpen(true); };
  const openEdit = (t: QuestionTemplate) => {
    setEditTarget(t);
    setForm({ name: t.name, reviewType: t.reviewType, reviewerRoleId: t.reviewerRoleId, revieweeRoleId: t.revieweeRoleId, priority: t.priority });
    setModalOpen(true);
  };

  const handleSave = () => {
    if (!form.name.trim()) { toast.error('Name is required.'); return; }
    if (editTarget) { updateTemplate(editTarget.id, form); toast.success('Template updated.'); }
    else { addTemplate(form); toast.success('Template created.'); }
    setModalOpen(false);
  };

  const handleDelete = () => {
    if (!deleteTarget) return;
    deleteTemplate(deleteTarget.id);
    toast.success('Template deleted.');
    setDeleteTarget(null);
  };

  const getRoleName = (id: string | null) => id ? (roles.find((r) => r.id === id)?.name ?? id) : 'Any';
  const getQuestionCount = (tId: string) => questions.filter((q) => q.templateId === tId).length;

  const columns = [
    {
      key: 'name',
      label: 'Template Name',
      render: (item: Record<string, unknown>) => (
        <span className="font-medium text-foreground">{item.name as string}</span>
      ),
    },
    {
      key: 'reviewType',
      label: 'Type',
      render: (item: Record<string, unknown>) => (
        <Badge variant={reviewTypeColor[item.reviewType as string] ?? 'secondary'}>
          {item.reviewType as string}
        </Badge>
      ),
    },
    {
      key: 'reviewerRoleId',
      label: 'Reviewer Role',
      render: (item: Record<string, unknown>) => <span className="text-sm">{getRoleName(item.reviewerRoleId as string | null)}</span>,
    },
    {
      key: 'revieweeRoleId',
      label: 'Reviewee Role',
      render: (item: Record<string, unknown>) => <span className="text-sm">{getRoleName(item.revieweeRoleId as string | null)}</span>,
    },
    {
      key: 'priority',
      label: 'Priority',
      render: (item: Record<string, unknown>) => <span className="text-sm font-medium">{item.priority as number}</span>,
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
        title="Templates"
        description="Define review templates and matching rules"
        action={
          <Button onClick={openCreate} size="sm">
            <Plus className="h-4 w-4" />
            New Template
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
        searchPlaceholder="Search templates…"
        actions={(item) => (
          <div className="flex items-center justify-end gap-1">
            <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => openEdit(item as unknown as QuestionTemplate)}>
              <Pencil className="h-3.5 w-3.5" />
            </Button>
            <Button
              variant="ghost" size="icon" className="h-7 w-7 text-red-500 hover:text-red-600 hover:bg-red-50"
              onClick={() => setDeleteTarget(item as unknown as QuestionTemplate)}
            >
              <Trash2 className="h-3.5 w-3.5" />
            </Button>
          </div>
        )}
      />

      <Dialog open={modalOpen} onOpenChange={setModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editTarget ? 'Edit Template' : 'New Template'}</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-2">
            <div className="grid gap-1.5">
              <Label>Name *</Label>
              <Input placeholder="Template name" value={form.name} onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))} />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="grid gap-1.5">
                <Label>Review Type *</Label>
                <Select value={form.reviewType} onValueChange={(v) => setForm((f) => ({ ...f, reviewType: v as QuestionTemplate['reviewType'] }))}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="peer">Peer</SelectItem>
                    <SelectItem value="self">Self</SelectItem>
                    <SelectItem value="manager">Manager</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-1.5">
                <Label>Priority</Label>
                <Input type="number" min={1} max={10} value={form.priority} onChange={(e) => setForm((f) => ({ ...f, priority: Number(e.target.value) }))} />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="grid gap-1.5">
                <Label>Reviewer Role</Label>
                <Select value={form.reviewerRoleId ?? 'any'} onValueChange={(v) => setForm((f) => ({ ...f, reviewerRoleId: v === 'any' ? null : v }))}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="any">Any (wildcard)</SelectItem>
                    {roles.map((r) => <SelectItem key={r.id} value={r.id}>{r.name}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-1.5">
                <Label>Reviewee Role</Label>
                <Select value={form.revieweeRoleId ?? 'any'} onValueChange={(v) => setForm((f) => ({ ...f, revieweeRoleId: v === 'any' ? null : v }))}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="any">Any (wildcard)</SelectItem>
                    {roles.map((r) => <SelectItem key={r.id} value={r.id}>{r.name}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setModalOpen(false)}>Cancel</Button>
            <Button onClick={handleSave}>{editTarget ? 'Save changes' : 'Create template'}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <ConfirmDialog
        open={!!deleteTarget}
        onOpenChange={(o) => !o && setDeleteTarget(null)}
        description={`Delete template "${deleteTarget?.name}"?`}
        onConfirm={handleDelete}
      />
    </div>
  );
}
