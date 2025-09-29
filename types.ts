import type { ReactNode } from 'react';

export interface Task {
  id: string;
  text: string;
  completed: boolean;
  category?: 'Personal' | 'Work' | 'Fitness';
  time?: string;
  completionDate?: string;
  date?: string;
}

export type Screen = 'home' | 'tasks' | 'tracker' | 'settings';