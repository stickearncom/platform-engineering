import { useState } from 'react';
import { Plus, Pencil, Trash2 } from 'lucide-react';
import { toast } from 'sonner';
import { useEmployeeStore } from '@/shared/stores/employeeStore';
import { useTable } from '@/shared/hooks/useTable';
import { DataTable } from '@/shared/components/DataTable';
import { PageHeader } from '@/shared/components/PageHeader';
import { ConfirmDialog } from '@/shared/components/ConfirmDialog';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import type { Role } from '@/shared/types';

export function RolesPage() {
  const { roles, employees, addRole, updateRole, deleteRole } = useEmployeeStore();
  const [modalOpen, setModalOpen] = useState(false);
  const [editTarget, setEditTarget] = useState<Role | null>(null);
  const [name, setName] = useState('');
  const [deleteTarget, setDeleteTarget] = useState<Role | null>(null);

  const table = useTable({
    data: roles as unknown as Record<string, unknown>[],
    searchFields: ['name'],
  });

  const openCreate = () => { setEditTarget(null); setName(''); setModalOpen(true); };
  const openEdit = (r: Role) => { setEditTarget(r); setName(r.name); setModalOpen(true); };

  const handleSave = () => {
    if (!name.trim()) { toast.error('Name is required.'); return; }
    if (editTarget) { updateRole(editTarget.id, { name }); toast.success('Role updated.'); }
    else { addRole({ name }); toast.success('Role created.'); }
    setModalOpen(false);
  };

  const handleDelete = () => {
    if (!deleteTarget) return;
    deleteRole(deleteTarget.id);
    toast.success('Role deleted.');
    setDeleteTarget(null);
  };

  const getHeadcount = (roleId: string) => employees.filter((e) => e.roleId === roleId).length;

  const columns = [
    {
      key: 'name',
      label: 'Role Name',
      render: (item: Record<string, unknown>) => (
        <span className="font-medium text-foreground">{item.name as string}</span>
      ),
    },
    {
      key: 'id',
      label: 'Headcount',
      render: (item: Record<string, unknown>) => (
        <span className="text-sm text-muted-foreground">{getHeadcount(item.id as string)} employees</span>
      ),
    },
  ];

  return (
    <div className="p-6">
      <PageHeader
        title="Roles"
        description={`${roles.length} roles defined`}
        action={
          <Button onClick={openCreate} size="sm">
            <Plus className="h-4 w-4" />
            Add Role
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
        searchPlaceholder="Search roles…"
        actions={(item) => (
          <div className="flex items-center justify-end gap-1">
            <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => openEdit(item as unknown as Role)}>
              <Pencil className="h-3.5 w-3.5" />
            </Button>
            <Button
              variant="ghost" size="icon" className="h-7 w-7 text-red-500 hover:text-red-600 hover:bg-red-50"
              onClick={() => setDeleteTarget(item as unknown as Role)}
            >
              <Trash2 className="h-3.5 w-3.5" />
            </Button>
          </div>
        )}
      />

      <Dialog open={modalOpen} onOpenChange={setModalOpen}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle>{editTarget ? 'Edit Role' : 'Add Role'}</DialogTitle>
          </DialogHeader>
          <div className="grid gap-1.5 py-2">
            <Label>Name *</Label>
            <Input placeholder="Role name" value={name} onChange={(e) => setName(e.target.value)} />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setModalOpen(false)}>Cancel</Button>
            <Button onClick={handleSave}>{editTarget ? 'Save changes' : 'Add role'}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <ConfirmDialog
        open={!!deleteTarget}
        onOpenChange={(o) => !o && setDeleteTarget(null)}
        description={`Delete role "${deleteTarget?.name}"?`}
        onConfirm={handleDelete}
      />
    </div>
  );
}
