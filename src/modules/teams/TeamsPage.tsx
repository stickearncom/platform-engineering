import { useState } from 'react';
import { Plus, Pencil, Trash2 } from 'lucide-react';
import { toast } from 'sonner';
import { useEmployeeStore } from '@/shared/stores/employeeStore';
import { useTable } from '@/shared/hooks/useTable';
import { DataTable } from '@/shared/components/DataTable';
import { PageHeader } from '@/shared/components/PageHeader';
import { ConfirmDialog } from '@/shared/components/ConfirmDialog';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import type { Team } from '@/shared/types';

export function TeamsPage() {
  const { teams, employees, addTeam, updateTeam, deleteTeam } = useEmployeeStore();
  const [modalOpen, setModalOpen] = useState(false);
  const [editTarget, setEditTarget] = useState<Team | null>(null);
  const [name, setName] = useState('');
  const [deleteTarget, setDeleteTarget] = useState<Team | null>(null);

  const table = useTable({
    data: teams as unknown as Record<string, unknown>[],
    searchFields: ['name'],
  });

  const openCreate = () => { setEditTarget(null); setName(''); setModalOpen(true); };
  const openEdit = (t: Team) => { setEditTarget(t); setName(t.name); setModalOpen(true); };

  const handleSave = () => {
    if (!name.trim()) { toast.error('Name is required.'); return; }
    if (editTarget) { updateTeam(editTarget.id, { name }); toast.success('Team updated.'); }
    else { addTeam({ name }); toast.success('Team created.'); }
    setModalOpen(false);
  };

  const handleDelete = () => {
    if (!deleteTarget) return;
    deleteTeam(deleteTarget.id);
    toast.success('Team deleted.');
    setDeleteTarget(null);
  };

  const getMemberCount = (teamId: string) => employees.filter((e) => e.teamId === teamId).length;

  const columns = [
    {
      key: 'name',
      label: 'Team Name',
      render: (item: Record<string, unknown>) => (
        <span className="font-medium text-foreground">{item.name as string}</span>
      ),
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
          <div className="grid gap-1.5 py-2">
            <Label>Name *</Label>
            <Input placeholder="Team name" value={name} onChange={(e) => setName(e.target.value)} />
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
