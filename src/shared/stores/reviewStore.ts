import { create } from 'zustand';
import type { ReviewCycle, ReviewAssignment, ReviewAnswer } from '@/shared/types';
import { generateId } from '@/lib/utils';

const mockCycles: ReviewCycle[] = [
  { id: 'c1', name: 'Q1 2025 Review', startDate: '2025-01-01', endDate: '2025-03-31' },
  { id: 'c2', name: 'Q2 2025 Review', startDate: '2025-04-01', endDate: '2025-06-30' },
];

const mockAssignments: ReviewAssignment[] = [
  { id: 'a1', reviewerId: 'e2', revieweeId: 'e3', reviewType: 'peer', templateId: 'tmpl1', cycleId: 'c1', status: 'pending', dueDate: '2025-03-31' },
  { id: 'a2', reviewerId: 'e2', revieweeId: 'e4', reviewType: 'peer', templateId: 'tmpl4', cycleId: 'c1', status: 'pending', dueDate: '2025-03-31' },
  { id: 'a3', reviewerId: 'e3', revieweeId: 'e2', reviewType: 'peer', templateId: 'tmpl1', cycleId: 'c1', status: 'submitted', dueDate: '2025-03-31' },
  { id: 'a4', reviewerId: 'e2', revieweeId: 'e2', reviewType: 'self', templateId: 'tmpl2', cycleId: 'c1', status: 'submitted', dueDate: '2025-03-31' },
  { id: 'a5', reviewerId: 'e1', revieweeId: 'e2', reviewType: 'manager', templateId: 'tmpl3', cycleId: 'c1', status: 'pending', dueDate: '2025-03-31' },
  { id: 'a6', reviewerId: 'e4', revieweeId: 'e3', reviewType: 'peer', templateId: 'tmpl1', cycleId: 'c2', status: 'pending', dueDate: '2025-06-30' },
  { id: 'a7', reviewerId: 'e3', revieweeId: 'e3', reviewType: 'self', templateId: 'tmpl2', cycleId: 'c2', status: 'pending', dueDate: '2025-06-30' },
  { id: 'a8', reviewerId: 'e9', revieweeId: 'e10', reviewType: 'peer', templateId: 'tmpl4', cycleId: 'c2', status: 'pending', dueDate: '2025-06-30' },
];

const mockAnswers: ReviewAnswer[] = [
  // a3: e3 reviews e2 (peer)
  { id: 'ans1', assignmentId: 'a3', questionId: 'q1', scoreValue: 4, textValue: null },
  { id: 'ans2', assignmentId: 'a3', questionId: 'q2', scoreValue: 4, textValue: null },
  { id: 'ans3', assignmentId: 'a3', questionId: 'q3', scoreValue: 3, textValue: null },
  { id: 'ans4', assignmentId: 'a3', questionId: 'q4', scoreValue: null, textValue: 'Bob is an excellent mentor and always willing to unblock others. His code reviews are thorough and educational.' },
  { id: 'ans5', assignmentId: 'a3', questionId: 'q5', scoreValue: null, textValue: 'Could improve on documentation and communicating project status proactively.' },
  // a4: e2 self review
  { id: 'ans6', assignmentId: 'a4', questionId: 'q6', scoreValue: 3, textValue: null },
  { id: 'ans7', assignmentId: 'a4', questionId: 'q7', scoreValue: 4, textValue: null },
  { id: 'ans8', assignmentId: 'a4', questionId: 'q8', scoreValue: null, textValue: 'Led the API redesign project that reduced response times by 40%. Mentored two junior engineers.' },
  { id: 'ans9', assignmentId: 'a4', questionId: 'q9', scoreValue: null, textValue: 'Want to improve my presentation skills and stakeholder communication. Also looking to deepen my Kubernetes expertise.' },
];

interface ReviewStore {
  reviewCycles: ReviewCycle[];
  assignments: ReviewAssignment[];
  answers: ReviewAnswer[];
  addCycle: (cycle: Omit<ReviewCycle, 'id'>) => void;
  updateCycle: (id: string, updates: Partial<Omit<ReviewCycle, 'id'>>) => void;
  deleteCycle: (id: string) => void;
  addAssignment: (assignment: Omit<ReviewAssignment, 'id'>) => void;
  updateAssignment: (id: string, updates: Partial<Omit<ReviewAssignment, 'id'>>) => void;
  deleteAssignment: (id: string) => void;
  saveAnswers: (assignmentId: string, answers: Omit<ReviewAnswer, 'id'>[]) => void;
  getAnswers: (assignmentId: string) => ReviewAnswer[];
}

export const useReviewStore = create<ReviewStore>((set, get) => ({
  reviewCycles: mockCycles,
  assignments: mockAssignments,
  answers: mockAnswers,

  addCycle: (cycle) =>
    set((s) => ({ reviewCycles: [...s.reviewCycles, { ...cycle, id: generateId() }] })),
  updateCycle: (id, updates) =>
    set((s) => ({ reviewCycles: s.reviewCycles.map((c) => (c.id === id ? { ...c, ...updates } : c)) })),
  deleteCycle: (id) =>
    set((s) => ({ reviewCycles: s.reviewCycles.filter((c) => c.id !== id) })),

  addAssignment: (assignment) =>
    set((s) => ({ assignments: [...s.assignments, { ...assignment, id: generateId() }] })),
  updateAssignment: (id, updates) =>
    set((s) => ({ assignments: s.assignments.map((a) => (a.id === id ? { ...a, ...updates } : a)) })),
  deleteAssignment: (id) =>
    set((s) => ({ assignments: s.assignments.filter((a) => a.id !== id) })),

  saveAnswers: (assignmentId, newAnswers) =>
    set((s) => {
      const filtered = s.answers.filter((a) => a.assignmentId !== assignmentId);
      const withIds = newAnswers.map((a) => ({ ...a, id: generateId() }));
      return {
        answers: [...filtered, ...withIds],
        assignments: s.assignments.map((a) =>
          a.id === assignmentId ? { ...a, status: 'submitted' as const } : a,
        ),
      };
    }),

  getAnswers: (assignmentId) => get().answers.filter((a) => a.assignmentId === assignmentId),
}));
