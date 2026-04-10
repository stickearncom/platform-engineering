import { create } from 'zustand';

export interface Sprint {
  id: string;
  name: string;
  period: string;
  committedSP: number;
  completedSP: number;
  carryoverSP: number;
}

export const MOCK_SPRINTS: Sprint[] = [
  { id: 's1', name: 'Sprint 1', period: 'Jan W1–2', committedSP: 45, completedSP: 38, carryoverSP: 7  },
  { id: 's2', name: 'Sprint 2', period: 'Jan W3–4', committedSP: 42, completedSP: 42, carryoverSP: 0  },
  { id: 's3', name: 'Sprint 3', period: 'Feb W1–2', committedSP: 50, completedSP: 43, carryoverSP: 7  },
  { id: 's4', name: 'Sprint 4', period: 'Feb W3–4', committedSP: 48, completedSP: 44, carryoverSP: 4  },
  { id: 's5', name: 'Sprint 5', period: 'Mar W1–2', committedSP: 52, completedSP: 40, carryoverSP: 12 },
  { id: 's6', name: 'Sprint 6', period: 'Mar W3–4', committedSP: 46, completedSP: 45, carryoverSP: 1  },
];

export function sprintPredictability(s: Sprint): number {
  return Math.round((s.completedSP / s.committedSP) * 100);
}

export function sprintCarryoverRate(s: Sprint): number {
  return Math.round((s.carryoverSP / s.committedSP) * 100);
}

interface SprintStore {
  sprints: Sprint[];
}

export const useSprintStore = create<SprintStore>(() => ({
  sprints: MOCK_SPRINTS,
}));
