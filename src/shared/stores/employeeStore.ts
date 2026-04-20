import { create } from 'zustand';
import type { Employee, Role, Division, Team } from '@/shared/types';
import { generateId } from '@/lib/utils';

const mockRoles: Role[] = [
  { id: 'r1', name: 'Engineering Manager' },
  { id: 'r2', name: 'Senior Software Engineer' },
  { id: 'r3', name: 'Software Engineer' },
  { id: 'r4', name: 'Product Manager' },
  { id: 'r5', name: 'UX Designer' },
  { id: 'r6', name: 'Frontend Engineer' },
  { id: 'r7', name: 'Backend Engineer' },
  { id: 'r8', name: 'QA Engineer' },
  { id: 'r9', name: 'DevOps Engineer' },
  { id: 'r10', name: 'Data Analyst' },
  { id: 'r11', name: 'Data Engineer' },
];

const mockDivisions: Division[] = [
  { id: 'd1', name: 'Engineering' },
  { id: 'd2', name: 'Product' },
  { id: 'd3', name: 'Design' },
];

const mockTeams: Team[] = [
  { id: 't1', name: 'Platform Engineering', divisionId: 'd1' },
  { id: 't2', name: 'Product',              divisionId: 'd2' },
  { id: 't3', name: 'Design',               divisionId: 'd3' },
  { id: 't4', name: 'DevOps',               divisionId: 'd1' },
];

const mockEmployees: Employee[] = [
  { id: 'e1', name: 'Alice Chen', email: 'alice@company.com', roleId: 'r1', teamId: 't1', managerId: null },
  { id: 'e2', name: 'Bob Smith', email: 'bob@company.com', roleId: 'r2', teamId: 't1', managerId: 'e1' },
  { id: 'e3', name: 'Carol Davis', email: 'carol@company.com', roleId: 'r3', teamId: 't1', managerId: 'e1' },
  { id: 'e4', name: 'David Kim', email: 'david@company.com', roleId: 'r3', teamId: 't1', managerId: 'e2' },
  { id: 'e5', name: 'Emma Wilson', email: 'emma@company.com', roleId: 'r1', teamId: 't2', managerId: null },
  { id: 'e6', name: 'Frank Brown', email: 'frank@company.com', roleId: 'r4', teamId: 't2', managerId: 'e5' },
  { id: 'e7', name: 'Grace Lee', email: 'grace@company.com', roleId: 'r5', teamId: 't3', managerId: null },
  { id: 'e8', name: 'Henry Taylor', email: 'henry@company.com', roleId: 'r1', teamId: 't4', managerId: null },
  { id: 'e9', name: 'Iris Martinez', email: 'iris@company.com', roleId: 'r2', teamId: 't4', managerId: 'e8' },
  { id: 'e10', name: 'James Johnson', email: 'james@company.com', roleId: 'r3', teamId: 't4', managerId: 'e9' },
  { id: 'e11', name: 'Kate White', email: 'kate@company.com', roleId: 'r3', teamId: 't1', managerId: 'e2' },
  { id: 'e12', name: 'Liam Anderson', email: 'liam@company.com', roleId: 'r4', teamId: 't2', managerId: 'e5' },
];

interface EmployeeStore {
  employees: Employee[];
  roles: Role[];
  divisions: Division[];
  teams: Team[];
  addEmployee: (employee: Omit<Employee, 'id'>) => void;
  updateEmployee: (id: string, updates: Partial<Omit<Employee, 'id'>>) => void;
  deleteEmployee: (id: string) => void;
  addRole: (role: Omit<Role, 'id'>) => void;
  updateRole: (id: string, updates: Partial<Omit<Role, 'id'>>) => void;
  deleteRole: (id: string) => void;
  addDivision: (division: Omit<Division, 'id'>) => void;
  updateDivision: (id: string, updates: Partial<Omit<Division, 'id'>>) => void;
  deleteDivision: (id: string) => void;
  addTeam: (team: Omit<Team, 'id'>) => void;
  updateTeam: (id: string, updates: Partial<Omit<Team, 'id'>>) => void;
  deleteTeam: (id: string) => void;
}

export const useEmployeeStore = create<EmployeeStore>((set) => ({
  employees: mockEmployees,
  roles: mockRoles,
  divisions: mockDivisions,
  teams: mockTeams,

  addEmployee: (employee) =>
    set((s) => ({ employees: [...s.employees, { ...employee, id: generateId() }] })),
  updateEmployee: (id, updates) =>
    set((s) => ({ employees: s.employees.map((e) => (e.id === id ? { ...e, ...updates } : e)) })),
  deleteEmployee: (id) =>
    set((s) => ({ employees: s.employees.filter((e) => e.id !== id) })),

  addRole: (role) =>
    set((s) => ({ roles: [...s.roles, { ...role, id: generateId() }] })),
  updateRole: (id, updates) =>
    set((s) => ({ roles: s.roles.map((r) => (r.id === id ? { ...r, ...updates } : r)) })),
  deleteRole: (id) =>
    set((s) => ({ roles: s.roles.filter((r) => r.id !== id) })),

  addDivision: (division) =>
    set((s) => ({ divisions: [...s.divisions, { ...division, id: generateId() }] })),
  updateDivision: (id, updates) =>
    set((s) => ({ divisions: s.divisions.map((d) => (d.id === id ? { ...d, ...updates } : d)) })),
  deleteDivision: (id) =>
    set((s) => ({ divisions: s.divisions.filter((d) => d.id !== id) })),

  addTeam: (team) =>
    set((s) => ({ teams: [...s.teams, { ...team, id: generateId() }] })),
  updateTeam: (id, updates) =>
    set((s) => ({ teams: s.teams.map((t) => (t.id === id ? { ...t, ...updates } : t)) })),
  deleteTeam: (id) =>
    set((s) => ({ teams: s.teams.filter((t) => t.id !== id) })),
}));
