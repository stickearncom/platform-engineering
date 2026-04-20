import { create } from 'zustand';
import type { ReviewCycle, ReviewAssignment, ReviewAnswer } from '@/shared/types';
import { generateId } from '@/lib/utils';

const mockCycles: ReviewCycle[] = [
  { id: 'c1', name: 'Q1 2025 Review',      startDate: '2025-01-01', endDate: '2025-03-31', activeReviewTypes: ['self', 'peer'] },
  { id: 'c2', name: 'Q2 2025 Mid-year',    startDate: '2025-04-01', endDate: '2025-06-30', activeReviewTypes: ['self', 'peer', 'manager'] },
];

const mockAssignments: ReviewAssignment[] = [
  { id: 'a1', reviewerId: 'e2', revieweeId: 'e3', reviewType: 'peer',    ruleId: null, cycleId: 'c1', status: 'submitted', dueDate: '2025-03-31' },
  { id: 'a2', reviewerId: 'e2', revieweeId: 'e4', reviewType: 'peer',    ruleId: null, cycleId: 'c1', status: 'pending',   dueDate: '2025-03-31' },
  { id: 'a3', reviewerId: 'e3', revieweeId: 'e2', reviewType: 'peer',    ruleId: null, cycleId: 'c1', status: 'submitted', dueDate: '2025-03-31' },
  { id: 'a4', reviewerId: 'e2', revieweeId: 'e2', reviewType: 'self',    ruleId: null, cycleId: 'c1', status: 'submitted', dueDate: '2025-03-31' },
  { id: 'a5', reviewerId: 'e1', revieweeId: 'e2', reviewType: 'manager', ruleId: null, cycleId: 'c1', status: 'pending',   dueDate: '2025-03-31' },
  { id: 'a6', reviewerId: 'e4', revieweeId: 'e3', reviewType: 'peer',    ruleId: null, cycleId: 'c2', status: 'pending',   dueDate: '2025-06-30' },
  { id: 'a7', reviewerId: 'e3', revieweeId: 'e3', reviewType: 'self',    ruleId: null, cycleId: 'c2', status: 'pending',   dueDate: '2025-06-30' },
  { id: 'a8', reviewerId: 'e9', revieweeId: 'e10', reviewType: 'peer',   ruleId: null, cycleId: 'c2', status: 'pending',   dueDate: '2025-06-30' },
];

const mockAnswers: ReviewAnswer[] = [
  // a1: e2 reviews e3 (peer — tmpl1) SUBMITTED
  { id: 'ans_a1_1',  assignmentId: 'a1', questionId: 'qp1',  scoreValue: 3, textValue: null },
  { id: 'ans_a1_2',  assignmentId: 'a1', questionId: 'qp2',  scoreValue: 3, textValue: null },
  { id: 'ans_a1_3',  assignmentId: 'a1', questionId: 'qp3',  scoreValue: 4, textValue: null },
  { id: 'ans_a1_4',  assignmentId: 'a1', questionId: 'qp4',  scoreValue: 3, textValue: null },
  { id: 'ans_a1_5',  assignmentId: 'a1', questionId: 'qp5',  scoreValue: 3, textValue: null },
  { id: 'ans_a1_6',  assignmentId: 'a1', questionId: 'qp6',  scoreValue: 4, textValue: null },
  { id: 'ans_a1_7',  assignmentId: 'a1', questionId: 'qp7',  scoreValue: 3, textValue: null },
  { id: 'ans_a1_8',  assignmentId: 'a1', questionId: 'qp8',  scoreValue: 4, textValue: null },
  { id: 'ans_a1_9',  assignmentId: 'a1', questionId: 'qp9',  scoreValue: 4, textValue: null },
  { id: 'ans_a1_10', assignmentId: 'a1', questionId: 'qp10', scoreValue: 4, textValue: null },
  { id: 'ans_a1_11', assignmentId: 'a1', questionId: 'qp11', scoreValue: 3, textValue: null },
  { id: 'ans_a1_12', assignmentId: 'a1', questionId: 'qpe1', scoreValue: null, textValue: 'Carol should start writing post-mortems for the bugs she resolves — her debugging is excellent but insights stay in her head.' },
  { id: 'ans_a1_13', assignmentId: 'a1', questionId: 'qpe2', scoreValue: null, textValue: 'Occasionally takes too long to ask for help when stuck. Would benefit from time-boxing and escalating earlier.' },
  { id: 'ans_a1_14', assignmentId: 'a1', questionId: 'qpe3', scoreValue: null, textValue: 'Her patience when pairing with junior engineers is exceptional. Always brings calm energy during incidents.' },
  { id: 'ans_a1_15', assignmentId: 'a1', questionId: 'qpe4', scoreValue: null, textValue: 'Nothing to add privately.' },

  // a3: e3 reviews e2 (peer — tmpl1) SUBMITTED
  { id: 'ans_a3_1',  assignmentId: 'a3', questionId: 'qp1',  scoreValue: 4, textValue: null },
  { id: 'ans_a3_2',  assignmentId: 'a3', questionId: 'qp2',  scoreValue: 4, textValue: null },
  { id: 'ans_a3_3',  assignmentId: 'a3', questionId: 'qp3',  scoreValue: 3, textValue: null },
  { id: 'ans_a3_4',  assignmentId: 'a3', questionId: 'qp4',  scoreValue: 4, textValue: null },
  { id: 'ans_a3_5',  assignmentId: 'a3', questionId: 'qp5',  scoreValue: 4, textValue: null },
  { id: 'ans_a3_6',  assignmentId: 'a3', questionId: 'qp6',  scoreValue: 3, textValue: null },
  { id: 'ans_a3_7',  assignmentId: 'a3', questionId: 'qp7',  scoreValue: 4, textValue: null },
  { id: 'ans_a3_8',  assignmentId: 'a3', questionId: 'qp8',  scoreValue: 4, textValue: null },
  { id: 'ans_a3_9',  assignmentId: 'a3', questionId: 'qp9',  scoreValue: 4, textValue: null },
  { id: 'ans_a3_10', assignmentId: 'a3', questionId: 'qp10', scoreValue: 4, textValue: null },
  { id: 'ans_a3_11', assignmentId: 'a3', questionId: 'qp11', scoreValue: 4, textValue: null },
  { id: 'ans_a3_12', assignmentId: 'a3', questionId: 'qpe1', scoreValue: null, textValue: 'Bob is an excellent mentor and always willing to unblock others. His code reviews are thorough and educational.' },
  { id: 'ans_a3_13', assignmentId: 'a3', questionId: 'qpe2', scoreValue: null, textValue: 'Could improve on documentation and communicating project status more proactively.' },
  { id: 'ans_a3_14', assignmentId: 'a3', questionId: 'qpe3', scoreValue: null, textValue: 'Bob consistently delivers on time and proactively flags risks early. Keep it up.' },
  { id: 'ans_a3_15', assignmentId: 'a3', questionId: 'qpe4', scoreValue: null, textValue: 'Nothing specific to add privately.' },

  // a4: e2 self review (tmpl2) SUBMITTED
  { id: 'ans_a4_1',  assignmentId: 'a4', questionId: 'qs1',  scoreValue: 3, textValue: null },
  { id: 'ans_a4_2',  assignmentId: 'a4', questionId: 'qs2',  scoreValue: 4, textValue: null },
  { id: 'ans_a4_3',  assignmentId: 'a4', questionId: 'qs3',  scoreValue: 3, textValue: null },
  { id: 'ans_a4_4',  assignmentId: 'a4', questionId: 'qs4',  scoreValue: 4, textValue: null },
  { id: 'ans_a4_5',  assignmentId: 'a4', questionId: 'qs5',  scoreValue: 3, textValue: null },
  { id: 'ans_a4_6',  assignmentId: 'a4', questionId: 'qs6',  scoreValue: 3, textValue: null },
  { id: 'ans_a4_7',  assignmentId: 'a4', questionId: 'qs7',  scoreValue: 4, textValue: null },
  { id: 'ans_a4_8',  assignmentId: 'a4', questionId: 'qs8',  scoreValue: 3, textValue: null },
  { id: 'ans_a4_9',  assignmentId: 'a4', questionId: 'qs9',  scoreValue: 3, textValue: null },
  { id: 'ans_a4_10', assignmentId: 'a4', questionId: 'qs10', scoreValue: 4, textValue: null },
  { id: 'ans_a4_11', assignmentId: 'a4', questionId: 'qs11', scoreValue: 3, textValue: null },
  { id: 'ans_a4_12', assignmentId: 'a4', questionId: 'qse1', scoreValue: null, textValue: 'Led the API redesign project that reduced response times by 40%. Mentored two junior engineers through their first major features.' },
  { id: 'ans_a4_13', assignmentId: 'a4', questionId: 'qse2', scoreValue: null, textValue: 'Unclear sprint goals and shifting priorities mid-cycle are my biggest blockers. Context switching is costly.' },
  { id: 'ans_a4_14', assignmentId: 'a4', questionId: 'qse3', scoreValue: null, textValue: 'More autonomy on architecture decisions and clearer OKR alignment from leadership would help me focus better.' },
  { id: 'ans_a4_15', assignmentId: 'a4', questionId: 'qse4', scoreValue: null, textValue: 'I want to deepen my distributed systems knowledge. The infra projects we have are the perfect context to grow in this area.' },
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
