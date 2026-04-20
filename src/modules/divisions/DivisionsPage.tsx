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
import type { Division } from '@/shared/types';

export function DivisionsPage() {
  const { divisions, teams, employees, addDivision, updateDivision, deleteDivision } =
    useEmployeeStore();

  const [modalOpen, setModalOpen] = useState(false);
  const [editTarget, setEditTarget] = useState<Division | null>(null);
  const [name, setName] = useState('');
  const [deleteTarget, setDeleteTarget] = useState<Division | null>(null);

  const table = useTable({
    data: divisions as unknown as Record<string, unknown>[],
    searchFields: ['name'],
  });

  const openCreate = () => {
    setEditTarget(null);
    setName('');
    setModalOpen(true);
  };

  const openEdit = (d: Division) => {
    setEditTarget(d);
    setName(d.name);
    setModalOpen(true);
  };

  const handleSave = () => {
    if (!name.trim()) {
      toast.error('Division name is required.');
      return;
    }
    if (editTarget) {
      updateDivision(editTarget.id, { name });
      toast.success('Division updated.');
    } else {
      addDivision({ name });
      toast.success('Division created.');
    }
    setModalOpen(false);
  };

  const handleDelete = () => {
    if (!deleteTarget) return;
    deleteDivision(deleteTarget.id);
    toast.success('Division deleted.');
    setDeleteTarget(null);
  };

  const getTeamCount = (divisionId: string) =>
    teams.filter((t) => t.divisionId === divisionId).length;

  const getMemberCount = (divisionId: string) => {
    const divTeamIds = teams.filter((t) => t.divisionId === divisionId).map((t) => t.id);
    return employees.filter((e) => divTeamIds.includes(e.teamId)).length;
  };

  const columns = [
    {
      key: 'name',
      label: 'Division Name',
      render: (item: Record<string, unknown>) => (
        <span className="font-medium text-foreground">{item.name as string}</span>
      ),
    },
    {
      key: 'id',
      label: 'Teams',
      render: (item: Record<string, unknown>) => (
        <span className="text-sm text-muted-foreground">
          {getTeamCount(item.id as string)} teams
        </span>
      ),
    },
    {
      key: '_members',
      label: 'Members',
      render: (item: Record<string, unknown>) => (
        <span className="text-sm text-muted-foreground">
          {getMemberCount(item.id as string)} members
        </span>
      ),
    },
  ];

  return (
    <div className="p-6">
      <PageHeader
        title="Divisions"
        description={`${divisions.length} divisions`}
        action={
          <Button onClick={openCreate} size="sm">
            <Plus className="h-4 w-4" />
            Add Division
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
        searchPlaceholder="Search divisions…"
        actions={(item) => (
          <div className="flex items-center justify-end gap-1">
            <Button
              variant="ghost"
              size="icon"
              className="h-7 w-7"
              onClick={() => openEdit(item as unknown as Division)}
            >
              <Pencil className="h-3.5 w-3.5" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="h-7 w-7 text-red-500 hover:text-red-600 hover:bg-red-50"
              onClick={() => setDeleteTarget(item as unknown as Division)}
            >
              <Trash2 className="h-3.5 w-3.5" />
            </Button>
          </div>
        )}
      />

      <Dialog open={modalOpen} onOpenChange={setModalOpen}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle>{editTarget ? 'Edit Division' : 'Add Division'}</DialogTitle>
          </DialogHeader>
          <div className="grid gap-1.5 py-2">
            <Label>Name *</Label>
            <Input
              placeholder="e.g. Engineering, Product, Design"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setModalOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSave}>{editTarget ? 'Save changes' : 'Add division'}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <ConfirmDialog
        open={!!deleteTarget}
        onOpenChange={(o) => !o && setDeleteTarget(null)}
        description={`Delete division "${deleteTarget?.name}"? Teams in this division will no longer have a division assigned.`}
        onConfirm={handleDelete}
      />
    </div>
  );
}
