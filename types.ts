
export type Frequency = 'daily' | 'weekly' | 'monthly';

export interface Habit {
  id: string;
  name: string;
  icon: string;
  color: string;
  soundUrl: string;
  frequency: Frequency;
  targetCount: number;
  completedDates: string[]; // ISO Strings (YYYY-MM-DD)
  createdAt: string;
}

export interface HabitHistory {
  date: string;
  completed: boolean;
}

export interface AIAdvice {
  advice: string;
  encouragement: string;
}
