import { create } from 'zustand';
import type { QuestionTemplate, Question } from '@/shared/types';
import { resolveTemplate } from '@/lib/templateResolver';
import { generateId } from '@/lib/utils';
import type { ReviewType } from '@/shared/types';

const mockTemplates: QuestionTemplate[] = [
  { id: 'tmpl1', name: 'General Peer Review', reviewType: 'peer', reviewerRoleId: null, revieweeRoleId: null, priority: 1 },
  { id: 'tmpl2', name: 'Self Assessment', reviewType: 'self', reviewerRoleId: null, revieweeRoleId: null, priority: 1 },
  { id: 'tmpl3', name: 'Manager Review', reviewType: 'manager', reviewerRoleId: null, revieweeRoleId: null, priority: 1 },
  { id: 'tmpl4', name: 'Senior Eng → Engineer Peer Review', reviewType: 'peer', reviewerRoleId: 'r2', revieweeRoleId: 'r3', priority: 2 },
];

const mockQuestions: Question[] = [
  // tmpl1 - Peer Review
  { id: 'q1', templateId: 'tmpl1', type: 'score', text: 'Rate their collaboration skills.', order: 1 },
  { id: 'q2', templateId: 'tmpl1', type: 'score', text: 'Rate their technical skills.', order: 2 },
  { id: 'q3', templateId: 'tmpl1', type: 'score', text: 'Rate their communication effectiveness.', order: 3 },
  { id: 'q4', templateId: 'tmpl1', type: 'essay', text: 'What do you appreciate most about working with this person?', order: 4 },
  { id: 'q5', templateId: 'tmpl1', type: 'essay', text: 'What would you suggest they improve on?', order: 5 },
  // tmpl2 - Self
  { id: 'q6', templateId: 'tmpl2', type: 'score', text: 'Rate your own collaboration with the team.', order: 1 },
  { id: 'q7', templateId: 'tmpl2', type: 'score', text: 'Rate your technical contributions this quarter.', order: 2 },
  { id: 'q8', templateId: 'tmpl2', type: 'essay', text: 'What were your key achievements this period?', order: 3 },
  { id: 'q9', templateId: 'tmpl2', type: 'essay', text: 'What areas do you want to focus on improving?', order: 4 },
  // tmpl3 - Manager
  { id: 'q10', templateId: 'tmpl3', type: 'score', text: 'Rate their overall performance this cycle.', order: 1 },
  { id: 'q11', templateId: 'tmpl3', type: 'score', text: 'Rate their growth and professional development.', order: 2 },
  { id: 'q12', templateId: 'tmpl3', type: 'score', text: 'Rate their impact on the team.', order: 3 },
  { id: 'q13', templateId: 'tmpl3', type: 'essay', text: 'What were their most significant contributions?', order: 4 },
  { id: 'q14', templateId: 'tmpl3', type: 'essay', text: 'What areas should they focus on for development?', order: 5 },
  // tmpl4 - Sr Eng peer review
  { id: 'q15', templateId: 'tmpl4', type: 'score', text: 'Rate their readiness for senior-level responsibilities.', order: 1 },
  { id: 'q16', templateId: 'tmpl4', type: 'score', text: 'Rate their technical depth and ownership.', order: 2 },
  { id: 'q17', templateId: 'tmpl4', type: 'essay', text: 'What strengths would make them an effective senior engineer?', order: 3 },
  { id: 'q18', templateId: 'tmpl4', type: 'essay', text: 'What gaps should they address before a senior promotion?', order: 4 },
];

interface TemplateStore {
  templates: QuestionTemplate[];
  questions: Question[];
  addTemplate: (template: Omit<QuestionTemplate, 'id'>) => void;
  updateTemplate: (id: string, updates: Partial<Omit<QuestionTemplate, 'id'>>) => void;
  deleteTemplate: (id: string) => void;
  addQuestion: (question: Omit<Question, 'id'>) => void;
  updateQuestion: (id: string, updates: Partial<Omit<Question, 'id'>>) => void;
  deleteQuestion: (id: string) => void;
  resolveTemplate: (reviewType: ReviewType, reviewerRoleId: string | null, revieweeRoleId: string | null) => QuestionTemplate | null;
}

export const useTemplateStore = create<TemplateStore>((set, get) => ({
  templates: mockTemplates,
  questions: mockQuestions,

  addTemplate: (template) =>
    set((s) => ({ templates: [...s.templates, { ...template, id: generateId() }] })),
  updateTemplate: (id, updates) =>
    set((s) => ({ templates: s.templates.map((t) => (t.id === id ? { ...t, ...updates } : t)) })),
  deleteTemplate: (id) =>
    set((s) => ({ templates: s.templates.filter((t) => t.id !== id) })),

  addQuestion: (question) =>
    set((s) => ({ questions: [...s.questions, { ...question, id: generateId() }] })),
  updateQuestion: (id, updates) =>
    set((s) => ({ questions: s.questions.map((q) => (q.id === id ? { ...q, ...updates } : q)) })),
  deleteQuestion: (id) =>
    set((s) => ({ questions: s.questions.filter((q) => q.id !== id) })),

  resolveTemplate: (reviewType, reviewerRoleId, revieweeRoleId) =>
    resolveTemplate(reviewType, reviewerRoleId, revieweeRoleId, get().templates),
}));
