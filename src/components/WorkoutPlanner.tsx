import React, { useState } from 'react';
import { WorkoutGoal, EquipmentRequirement, Exercise, WorkoutPlan } from '../types';
import { Dumbbell, Target, Sliders, Play, CircleDot, Info, Calendar, Zap, AlertTriangle } from 'lucide-react';

// Hardcoded core exercise database - deterministic biomechanical inputs
export const EXERCISE_DATABASE: Record<string, Exercise> = {
  squat: {
    id: 'squat',
    name: 'Biomechanical Depth Squat',
    category: 'lower',
    baseReps: 10,
    baseSets: 4,
    formTips: [
      'Maintain hips passing below knee line (90°)',
      'Keep head erect to preserve IMU neck alignment',
      'Distribute force evenly across rear foot vectors'
    ],
    commonErrors: [
      'Shallow Squat Depth',
      'Shoulder Lean Forward',
      'Knee Varus (Caving inward)'
    ],
    keyMetrics: { label: 'Min Depth Angle', idealRange: '80° - 90°', unit: 'degrees' }
  },
  bicep_curl: {
    id: 'bicep_curl',
    name: 'Strict Velocity Dumbbell Curl',
    category: 'upper',
    baseReps: 12,
    baseSets: 3,
    formTips: [
      'Brace shoulder coordinate anchor against momentum sway',
      'Full eccentric elbow extension prior to repetition trigger',
      'Hold peak squeeze for 1.0s at isometric terminal'
    ],
    commonErrors: [
      'Shoulder Momentum Help',
      'Elbow Drift Outward',
      'Incomplete Extension'
    ],
    keyMetrics: { label: 'Shoulder Angle Shift', idealRange: '< 5°', unit: 'degrees' }
  },
  overhead_press: {
    id: 'overhead_press',
    name: 'Precision Overhead Press',
    category: 'upper',
    baseReps: 8,
    baseSets: 4,
    formTips: [
      'Lock out elbows fully at the peak apex',
      'Keep spine straight - avoid lumbar spine hyperextension',
      'Press barbell coordinate line straight over ears'
    ],
    commonErrors: [
      'Lumbar Spine Hyperextension',
      'Incomplete Peak Lockout',
      'Forearm Drift in coronal plane'
    ],
    keyMetrics: { label: 'Lumbar Extension Drift', idealRange: '< 8°', unit: 'degrees' }
  },
  pushup: {
    id: 'pushup',
    name: 'Stabilized Floor Push-Up',
    category: 'upper',
    baseReps: 15,
    baseSets: 3,
    formTips: [
      'Keep head in strict neutral alignment with cervical spine',
      'Core braced to secure continuous linear torso vector',
      'Lower chest to 3cm off floor height'
    ],
    commonErrors: [
      'Sagging Lower Hips',
      'Hyperextended Head Positioning',
      'Partial Rep Height'
    ],
    keyMetrics: { label: 'Average Core Sag', idealRange: '0 - 2 cm', unit: 'cm' }
  }
};

interface WorkoutPlannerProps {
  onStartWorkout: (plan: WorkoutPlan) => void;
}

export default function WorkoutPlanner({ onStartWorkout }: WorkoutPlannerProps) {
  const [goal, setGoal] = useState<WorkoutGoal>('strength');
  const [equipment, setEquipment] = useState<EquipmentRequirement>('dumbbells');
  const [difficulty, setDifficulty] = useState<'beginner' | 'intermediate' | 'advanced'>('intermediate');
  const [frequency, setFrequency] = useState<number>(3);
  const [activePlan, setActivePlan] = useState<WorkoutPlan | null>(null);

  // Generate deterministic workout routines based on clean logical mappings
  const compileWorkout = () => {
    // Basic heuristic compiler (Zero cloud APIs)
    const selectedExercises: { exerciseId: string; targetSets: number; targetReps: number; tempo: string }[] = [];
    
    // Choose exercises based on selected equipment and balance upper/lower/core
    if (equipment === 'bodyweight') {
      selectedExercises.push({ exerciseId: 'pushup', targetSets: difficulty === 'beginner' ? 3 : 4, targetReps: difficulty === 'beginner' ? 12 : 20, tempo: '3-1-1-1' });
      selectedExercises.push({ exerciseId: 'squat', targetSets: difficulty === 'beginner' ? 3 : 4, targetReps: difficulty === 'beginner' ? 15 : 25, tempo: '2-0-2-1' });
    } else if (equipment === 'dumbbells') {
      selectedExercises.push({ exerciseId: 'bicep_curl', targetSets: difficulty === 'beginner' ? 3 : 4, targetReps: difficulty === 'beginner' ? 10 : 12, tempo: '3-0-1-1' });
      selectedExercises.push({ exerciseId: 'squat', targetSets: difficulty === 'beginner' ? 3 : 4, targetReps: difficulty === 'beginner' ? 10 : 12, tempo: '3-1-1-0' });
      selectedExercises.push({ exerciseId: 'overhead_press', targetSets: difficulty === 'beginner' ? 3 : 4, targetReps: difficulty === 'beginner' ? 8 : 10, tempo: '2-0-1-1' });
    } else {
      // General fallbacks
      selectedExercises.push({ exerciseId: 'squat', targetSets: 4, targetReps: 10, tempo: '3-1-1-0' });
      selectedExercises.push({ exerciseId: 'pushup', targetSets: 3, targetReps: 15, tempo: '3-0-1-1' });
    }

    const titleMap: Record<WorkoutGoal, string> = {
      strength: 'Myokinetic Neuro-Activation',
      hypertrophy: 'Mechanical Tension Optimizer',
      endurance: 'Cardiovascular Work Capacity',
      mobility: 'Arthrokinematic Range Program'
    };

    const compiledPlan: WorkoutPlan = {
      id: `plan_${Date.now()}`,
      title: `${titleMap[goal]} (${difficulty})`,
      description: `Targeting muscular group dynamics via exact structural ${equipment} exercises compiled for ${frequency} weekly tracks.`,
      goal,
      difficulty,
      durationWeeks: 6,
      sessionsPerWeek: frequency,
      exercises: selectedExercises,
    };

    setActivePlan(compiledPlan);
  };

  return (
    <div id="workout-planner" className="grid lg:grid-cols-12 gap-8">
      {/* Parameters Panel */}
      <div className="lg:col-span-5 bg-neutral-900 border border-neutral-800 rounded-2xl p-6 shadow-xl space-y-6">
        <div>
          <h3 className="text-lg font-sans font-bold text-neutral-100 flex items-center gap-2">
            <Sliders className="w-5 h-5 text-amber-400" />
            Plan Synthesizer
          </h3>
          <p className="text-xs text-neutral-400 mt-1">
            Configure rules to compile a tailored biomechanical training regimen instantly.
          </p>
        </div>

        {/* Goal Selection */}
        <div className="space-y-2">
          <label className="text-xs font-mono text-neutral-400 uppercase tracking-wider block">Training Goal</label>
          <div className="grid grid-cols-2 gap-2">
            {(['strength', 'hypertrophy', 'endurance', 'mobility'] as WorkoutGoal[]).map((g) => (
              <button
                key={g}
                type="button"
                onClick={() => setGoal(g)}
                className={`py-2 px-3 text-xs font-medium rounded-lg border text-left flex items-center justify-between transition-all ${
                  goal === g
                    ? 'border-amber-400 bg-amber-400/10 text-amber-400'
                    : 'border-neutral-800 bg-neutral-950/40 text-neutral-400 hover:text-neutral-200 hover:border-neutral-700'
                }`}
              >
                <span className="capitalize">{g}</span>
                <Target className="w-3.5 h-3.5 opacity-60" />
              </button>
            ))}
          </div>
        </div>

        {/* Equipment Available */}
        <div className="space-y-2">
          <label className="text-xs font-mono text-neutral-400 uppercase tracking-wider block">Equipment Node</label>
          <div className="grid grid-cols-2 gap-2">
            {(['bodyweight', 'dumbbells', 'resistance-bands', 'barbell'] as EquipmentRequirement[]).map((eq) => (
              <button
                key={eq}
                type="button"
                onClick={() => setEquipment(eq)}
                className={`py-2 px-3 text-xs font-medium rounded-lg border text-left flex items-center justify-between transition-all ${
                  equipment === eq
                    ? 'border-amber-400 bg-amber-400/10 text-amber-400'
                    : 'border-neutral-800 bg-neutral-950/40 text-neutral-400 hover:text-neutral-200 hover:border-neutral-700'
                }`}
              >
                <span className="capitalize">{eq.replace('-', ' ')}</span>
                <Dumbbell className="w-3.5 h-3.5 opacity-60" />
              </button>
            ))}
          </div>
        </div>

        {/* Difficulty Profile */}
        <div className="space-y-2">
          <label className="text-xs font-mono text-neutral-400 uppercase tracking-wider block">Biomechanical Level</label>
          <div className="grid grid-cols-3 gap-2">
            {(['beginner', 'intermediate', 'advanced'] as const).map((lvl) => (
              <button
                key={lvl}
                type="button"
                onClick={() => setDifficulty(lvl)}
                className={`py-1.5 px-2 text-xs font-medium rounded-lg border text-center transition-all capitalize ${
                  difficulty === lvl
                    ? 'border-amber-400 bg-amber-400/10 text-amber-400'
                    : 'border-neutral-800 bg-neutral-950/40 text-neutral-400 hover:text-neutral-200 hover:border-neutral-700'
                }`}
              >
                {lvl}
              </button>
            ))}
          </div>
        </div>

        {/* Frequency Dial */}
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <label className="text-xs font-mono text-neutral-400 uppercase tracking-wider">Weekly Track Frequency</label>
            <span className="text-xs text-amber-400 font-mono font-bold">{frequency} sets/week</span>
          </div>
          <input
            type="range"
            min="2"
            max="6"
            step="1"
            value={frequency}
            onChange={(e) => setFrequency(parseInt(e.target.value, 10))}
            className="w-full accent-amber-400 bg-neutral-950/80 rounded-lg cursor-pointer h-1.5"
          />
        </div>

        {/* Compile trigger */}
        <button
          onClick={compileWorkout}
          className="w-full py-3 px-4 bg-amber-400 text-neutral-950 font-sans font-bold text-sm rounded-xl cursor-pointer hover:bg-amber-300 transition-all flex items-center justify-center gap-2 shadow-lg hover:shadow-amber-400/10"
        >
          <Zap className="w-4 h-4" />
          Compile Deterministic Plan
        </button>

        {/* Info box proving No AI LLM used */}
        <div className="bg-neutral-950 p-3.5 border border-neutral-800/80 rounded-xl flex gap-2.5 items-start">
          <Info className="w-4.5 h-4.5 text-neutral-400 shrink-0 mt-0.5" />
          <p className="text-xs text-neutral-500 leading-normal">
            No cloud compute or generative networks are contacted. The plan is synthesized client-side based on physiological motor units configuration templates.
          </p>
        </div>
      </div>

      {/* Generated Plan Workspace */}
      <div className="lg:col-span-7 bg-neutral-900 border border-neutral-800 rounded-2xl p-6 shadow-xl flex flex-col justify-between">
        {!activePlan ? (
          <div className="flex-1 flex flex-col items-center justify-center text-center p-8 border border-dashed border-neutral-800 rounded-xl bg-neutral-950/20">
            <CircleDot className="w-12 h-12 text-neutral-700 animate-pulse" />
            <h4 className="text-neutral-300 font-sans font-semibold mt-4">Workspace Blank</h4>
            <p className="text-xs text-neutral-500 mt-2 max-w-sm">
              Synthesize a plan on the left side. The compiled sequence, kinetic velocity metrics, and targets will generate here.
            </p>
          </div>
        ) : (
          <div className="space-y-6 flex-1">
            <div className="border-b border-neutral-800 pb-4">
              <span className="text-xs font-mono font-bold text-amber-400 px-2.5 py-1 rounded-full bg-amber-400/10 inline-block uppercase">
                {activePlan.difficulty} Compiled Program
              </span>
              <h3 className="text-xl font-bold text-neutral-100 mt-2 font-sans tracking-tight">
                {activePlan.title}
              </h3>
              <p className="text-xs text-neutral-400 mt-1">
                {activePlan.description}
              </p>

              <div className="flex gap-4 mt-3 text-xs text-neutral-500 font-mono">
                <span className="flex items-center gap-1"><Calendar className="w-3.5 h-3.5" /> {activePlan.durationWeeks} Weeks Loop</span>
                <span className="flex items-center gap-1"><Zap className="w-3.5 h-3.5" /> {activePlan.sessionsPerWeek} Days / Week</span>
              </div>
            </div>

            {/* List of compiled exercises with specifications */}
            <div className="space-y-3 max-h-[300px] overflow-y-auto">
              <span className="text-xs font-mono text-neutral-400 block uppercase">Kinematic Target Sequencing:</span>
              
              {activePlan.exercises.map((item, idx) => {
                const spec = EXERCISE_DATABASE[item.exerciseId];
                if (!spec) return null;
                return (
                  <div key={item.exerciseId} className="bg-neutral-950/70 border border-neutral-800/80 p-3.5 rounded-xl hover:border-neutral-700 transition">
                    <div className="flex justify-between items-start">
                      <div>
                        <span className="text-[10px] font-mono text-amber-400 block mb-0.5 uppercase tracking-widest">Exercise {idx + 1}</span>
                        <h4 className="text-sm font-semibold text-neutral-100 font-sans">{spec.name}</h4>
                      </div>
                      <div className="font-mono text-right text-xs">
                        <span className="text-amber-400 font-bold">{item.targetSets} Sets</span>
                        <span className="text-neutral-500 block text-[10px]">@{item.targetReps} reps • Tempo {item.tempo}</span>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-2 mt-3 pt-2.5 border-t border-neutral-900 text-[11px]">
                      <div>
                        <span className="text-neutral-500 block uppercase font-mono text-[9px]">Sensory Targets:</span>
                        <span className="text-neutral-300 font-mono">{spec.keyMetrics.label}: <strong className="text-neutral-100">{spec.keyMetrics.idealRange}</strong></span>
                      </div>
                      <div>
                        <span className="text-neutral-500 block uppercase font-mono text-[9px]">Sensor Node:</span>
                        <span className="text-neutral-400 font-mono">{spec.category === 'lower' ? 'Depth Hub + Earbuds' : 'Spinal Vector IMU'}</span>
                      </div>
                    </div>

                    {/* Common errors to highlight "no typical AI features" - just highly precise guidelines */}
                    <div className="mt-2 text-[10px] text-neutral-500 flex gap-1 items-start">
                      <AlertTriangle className="w-3 h-3 text-amber-500 shrink-0 mt-0.5" />
                      <span>Form alerts trip instantly on: <strong className="text-neutral-400">{spec.commonErrors.join(', ')}</strong>.</span>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Load workout trigger */}
            <div className="pt-4 border-t border-neutral-800">
              <button
                onClick={() => onStartWorkout(activePlan)}
                className="w-full py-3 h-12 bg-neutral-100 text-neutral-950 font-sans font-bold text-sm rounded-xl cursor-pointer hover:bg-white transition-all flex items-center justify-center gap-2 active:scale-95"
              >
                <Play className="w-4 h-4 fill-current" />
                Launch Dynamic Tracking Console
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
