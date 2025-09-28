import type { ReactNode } from 'react';

export interface Task {
  id: string;
  text: string;
  completed: boolean;
  category?: 'Personal' | 'Work' | 'Fitness';
}

export type Screen = 'home' | 'tasks' | 'tracker' | 'settings';
