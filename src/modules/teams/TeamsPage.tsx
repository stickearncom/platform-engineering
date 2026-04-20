import { useState } from 'react';
import { Plus, Pencil, Trash2 } from 'lucide-react';
import { toast } from 'sonner';
import { useEmployeeStore } from '@/shared/stores/employeeStore';
import { useTable } from '@/shared/hooks/useTable';
import { DataTable } from '@/shared/components/DataTable';
import { PageHeader } from '@/shared/components/PageHeader';
import { ConfirmDialog } from '@/shared/components/ConfirmDialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import type { Team } from '@/shared/types';

type TeamForm = Omit<Team, 'id'>;
const emptyForm = (): TeamForm => ({ name: '', divisionId: null });

export function TeamsPage() {
  const { teams, divisions, employees, addTeam, updateTeam, deleteTeam } = useEmployeeStore();
  const [modalOpen, setModalOpen] = useState(false);
  const [editTarget, setEditTarget] = useState<Team | null>(null);
  const [form, setForm] = useState<TeamForm>(emptyForm());
  const [deleteTarget, setDeleteTarget] = useState<Team | null>(null);

  const table = useTable({
    data: teams as unknown as Record<string, unknown>[],
    searchFields: ['name'],
  });

  const openCreate = () => { setEditTarget(null); setForm(emptyForm()); setModalOpen(true); };
  const openEdit = (t: Team) => {
    setEditTarget(t);
    setForm({ name: t.name, divisionId: t.divisionId });
    setModalOpen(true);
  };

  const handleSave = () => {
    if (!form.name.trim()) { toast.error('Name is required.'); return; }
    if (editTarget) { updateTeam(editTarget.id, form); toast.success('Team updated.'); }
    else { addTeam(form); toast.success('Team created.'); }
    setModalOpen(false);
  };

  const handleDelete = () => {
    if (!deleteTarget) return;
    deleteTeam(deleteTarget.id);
    toast.success('Team deleted.');
    setDeleteTarget(null);
  };

  const getMemberCount = (teamId: string) => employees.filter((e) => e.teamId === teamId).length;
  const getDivisionName = (id: string | null) =>
    id ? (divisions.find((d) => d.id === id)?.name ?? '—') : '—';

  const columns = [
    {
      key: 'name',
      label: 'Team Name',
      render: (item: Record<string, unknown>) => (
        <span className="font-medium text-foreground">{item.name as string}</span>
      ),
    },
    {
      key: 'divisionId',
      label: 'Division',
      render: (item: Record<string, unknown>) => {
        const name = getDivisionName(item.divisionId as string | null);
        return name !== '—'
          ? <Badge variant="secondary">{name}</Badge>
          : <span className="text-sm text-muted-foreground">—</span>;
      },
    },
    {
      key: 'id',
      label: 'Members',
      render: (item: Record<string, unknown>) => (
        <span className="text-sm text-muted-foreground">{getMemberCount(item.id as string)} members</span>
      ),
    },
  ];

  return (
    <div className="p-6">
      <PageHeader
        title="Teams"
        description={`${teams.length} teams`}
        action={
          <Button onClick={openCreate} size="sm">
            <Plus className="h-4 w-4" />
            Add Team
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
        searchPlaceholder="Search teams…"
        actions={(item) => (
          <div className="flex items-center justify-end gap-1">
            <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => openEdit(item as unknown as Team)}>
              <Pencil className="h-3.5 w-3.5" />
            </Button>
            <Button
              variant="ghost" size="icon" className="h-7 w-7 text-red-500 hover:text-red-600 hover:bg-red-50"
              onClick={() => setDeleteTarget(item as unknown as Team)}
            >
              <Trash2 className="h-3.5 w-3.5" />
            </Button>
          </div>
        )}
      />

      <Dialog open={modalOpen} onOpenChange={setModalOpen}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle>{editTarget ? 'Edit Team' : 'Add Team'}</DialogTitle>
          </DialogHeader>
          <div className="grid gap-3 py-2">
            <div className="grid gap-1.5">
              <Label>Name *</Label>
              <Input
                placeholder="Team name"
                value={form.name}
                onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
              />
            </div>
            <div className="grid gap-1.5">
              <Label>Division</Label>
              <Select
                value={form.divisionId ?? 'none'}
                onValueChange={(v) => setForm((f) => ({ ...f, divisionId: v === 'none' ? null : v }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select division (optional)" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">— No division —</SelectItem>
                  {divisions.map((d) => (
                    <SelectItem key={d.id} value={d.id}>{d.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setModalOpen(false)}>Cancel</Button>
            <Button onClick={handleSave}>{editTarget ? 'Save changes' : 'Add team'}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <ConfirmDialog
        open={!!deleteTarget}
        onOpenChange={(o) => !o && setDeleteTarget(null)}
        description={`Delete team "${deleteTarget?.name}"?`}
        onConfirm={handleDelete}
      />
    </div>
  );
}
