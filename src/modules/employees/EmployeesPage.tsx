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
import type { Employee } from '@/shared/types';

type EmployeeForm = Omit<Employee, 'id'>;

const emptyForm = (): EmployeeForm => ({
  name: '',
  email: '',
  roleId: '',
  teamId: '',
  managerId: null,
});

export function EmployeesPage() {
  const { employees, roles, teams, addEmployee, updateEmployee, deleteEmployee } = useEmployeeStore();

  const [modalOpen, setModalOpen] = useState(false);
  const [editTarget, setEditTarget] = useState<Employee | null>(null);
  const [form, setForm] = useState<EmployeeForm>(emptyForm());
  const [deleteTarget, setDeleteTarget] = useState<Employee | null>(null);

  const table = useTable({
    data: employees as unknown as Record<string, unknown>[],
    searchFields: ['name', 'email'],
  });

  const openCreate = () => {
    setEditTarget(null);
    setForm(emptyForm());
    setModalOpen(true);
  };

  const openEdit = (emp: Employee) => {
    setEditTarget(emp);
    setForm({ name: emp.name, email: emp.email, roleId: emp.roleId, teamId: emp.teamId, managerId: emp.managerId });
    setModalOpen(true);
  };

  const handleSave = () => {
    if (!form.name.trim() || !form.email.trim() || !form.roleId || !form.teamId) {
      toast.error('Please fill in all required fields.');
      return;
    }
    if (editTarget) {
      updateEmployee(editTarget.id, form);
      toast.success('Employee updated.');
    } else {
      addEmployee(form);
      toast.success('Employee added.');
    }
    setModalOpen(false);
  };

  const handleDelete = () => {
    if (!deleteTarget) return;
    deleteEmployee(deleteTarget.id);
    toast.success('Employee deleted.');
    setDeleteTarget(null);
  };

  const getRoleName = (id: string) => roles.find((r) => r.id === id)?.name ?? '—';
  const getTeamName = (id: string) => teams.find((t) => t.id === id)?.name ?? '—';

  const columns = [
    {
      key: 'name',
      label: 'Name',
      render: (item: Record<string, unknown>) => (
        <div>
          <p className="font-medium text-foreground">{item.name as string}</p>
          <p className="text-xs text-muted-foreground">{item.email as string}</p>
        </div>
      ),
    },
    {
      key: 'roleId',
      label: 'Role',
      render: (item: Record<string, unknown>) => (
        <Badge variant="secondary">{getRoleName(item.roleId as string)}</Badge>
      ),
    },
    {
      key: 'teamId',
      label: 'Team',
      render: (item: Record<string, unknown>) => (
        <span className="text-sm text-foreground">{getTeamName(item.teamId as string)}</span>
      ),
    },
    {
      key: 'managerId',
      label: 'Manager',
      render: (item: Record<string, unknown>) => {
        const mgr = employees.find((e) => e.id === item.managerId);
        return <span className="text-sm text-muted-foreground">{mgr?.name ?? '—'}</span>;
      },
    },
  ];

  return (
    <div className="p-6">
      <PageHeader
        title="Employees"
        description={`${employees.length} total members`}
        action={
          <Button onClick={openCreate} size="sm">
            <Plus className="h-4 w-4" />
            Add Employee
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
        searchPlaceholder="Search by name or email…"
        actions={(item) => (
          <div className="flex items-center justify-end gap-1">
            <Button
              variant="ghost"
              size="icon"
              className="h-7 w-7"
              onClick={() => openEdit(item as unknown as Employee)}
            >
              <Pencil className="h-3.5 w-3.5" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="h-7 w-7 text-red-500 hover:text-red-600 hover:bg-red-50"
              onClick={() => setDeleteTarget(item as unknown as Employee)}
            >
              <Trash2 className="h-3.5 w-3.5" />
            </Button>
          </div>
        )}
      />

      {/* Create / Edit Modal */}
      <Dialog open={modalOpen} onOpenChange={setModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editTarget ? 'Edit Employee' : 'Add Employee'}</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-2">
            <div className="grid gap-1.5">
              <Label>Name *</Label>
              <Input
                placeholder="Full name"
                value={form.name}
                onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
              />
            </div>
            <div className="grid gap-1.5">
              <Label>Email *</Label>
              <Input
                type="email"
                placeholder="name@company.com"
                value={form.email}
                onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="grid gap-1.5">
                <Label>Role *</Label>
                <Select value={form.roleId} onValueChange={(v) => setForm((f) => ({ ...f, roleId: v }))}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select role" />
                  </SelectTrigger>
                  <SelectContent>
                    {roles.map((r) => (
                      <SelectItem key={r.id} value={r.id}>{r.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-1.5">
                <Label>Team *</Label>
                <Select value={form.teamId} onValueChange={(v) => setForm((f) => ({ ...f, teamId: v }))}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select team" />
                  </SelectTrigger>
                  <SelectContent>
                    {teams.map((t) => (
                      <SelectItem key={t.id} value={t.id}>{t.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="grid gap-1.5">
              <Label>Manager</Label>
              <Select
                value={form.managerId ?? 'none'}
                onValueChange={(v) => setForm((f) => ({ ...f, managerId: v === 'none' ? null : v }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="No manager" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">— No manager</SelectItem>
                  {employees
                    .filter((e) => !editTarget || e.id !== editTarget.id)
                    .map((e) => (
                      <SelectItem key={e.id} value={e.id}>{e.name}</SelectItem>
                    ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setModalOpen(false)}>Cancel</Button>
            <Button onClick={handleSave}>{editTarget ? 'Save changes' : 'Add employee'}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirm */}
      <ConfirmDialog
        open={!!deleteTarget}
        onOpenChange={(o) => !o && setDeleteTarget(null)}
        description={`Delete "${deleteTarget?.name}"? This cannot be undone.`}
        onConfirm={handleDelete}
      />
    </div>
  );
}
