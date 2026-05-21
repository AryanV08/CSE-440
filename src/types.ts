export type WorkoutGoal = 'strength' | 'hypertrophy' | 'endurance' | 'mobility';

export type EquipmentRequirement = 'bodyweight' | 'dumbbells' | 'resistance-bands' | 'barbell';

export interface Exercise {
  id: string;
  name: string;
  category: 'lower' | 'upper' | 'core' | 'full-body';
  baseReps: number;
  baseSets: number;
  formTips: string[];
  commonErrors: string[];
  keyMetrics: { label: string; idealRange: string; unit: string };
}

export interface WorkoutPlan {
  id: string;
  title: string;
  description: string;
  goal: WorkoutGoal;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  durationWeeks: number;
  sessionsPerWeek: number;
  exercises: {
    exerciseId: string;
    targetSets: number;
    targetReps: number;
    tempo: string; // e.g., "3-0-1-1"
  }[];
}

export interface RepLog {
  repNumber: number;
  timestamp: string;
  isGoodForm: boolean;
  score: number; // percentage quality
  issueDetected?: string;
  durationMs: number;
}

export interface SystemStatus {
  bluetoothConnected: boolean;
  earbudBattery: number; // percentage
  depthSensorStatus: 'calibrated' | 'searching' | 'offline';
  averageFormScore: number;
  totalRepCount: number;
}
