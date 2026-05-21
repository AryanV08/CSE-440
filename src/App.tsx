import React, { useState, useEffect } from 'react';
import { WorkoutPlan } from './types';
import PRDViewer from './components/PRDViewer';
import WorkoutPlanner from './components/WorkoutPlanner';
import PerformanceTracker from './components/PerformanceTracker';
import { soundEngine } from './components/SoundEngine';
import { 
  Activity, 
  Dumbbell, 
  FileText, 
  Bluetooth, 
  Clock, 
  Play, 
  Volume2, 
  ShieldCheck, 
  Check, 
  Smartphone,
  ChevronRight,
  Info
} from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState<'console' | 'planner' | 'prd'>('console');
  const [activePlan, setActivePlan] = useState<WorkoutPlan | null>(null);
  const [utcTime, setUtcTime] = useState<string>('2026-05-21 18:08:10');
  const [showToast, setShowToast] = useState<string | null>(null);

  // Maintain UTC clock in footer matching environmental metadata
  useEffect(() => {
    const timer = setInterval(() => {
      const date = new Date();
      const format = date.getUTCFullYear() + '-' + 
        String(date.getUTCMonth() + 1).padStart(2, '0') + '-' + 
        String(date.getUTCDate()).padStart(2, '0') + ' ' + 
        String(date.getUTCHours()).padStart(2, '0') + ':' + 
        String(date.getUTCMinutes()).padStart(2, '0') + ':' + 
        String(date.getUTCSeconds()).padStart(2, '0');
      setUtcTime(format);
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // When compilation launches a workout, trigger transition
  const handleLaunchWorkout = (plan: WorkoutPlan) => {
    setActivePlan(plan);
    setActiveTab('console');
    triggerToast(`Loaded Program: ${plan.title}. Telemetry channels activated!`);
    
    // Play greeting beep
    soundEngine.playBluetoothConnect();
  };

  const triggerToast = (msg: string) => {
    setShowToast(msg);
    setTimeout(() => setShowToast(null), 4000);
  };

  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-100 flex flex-col justify-between selection:bg-amber-400 selection:text-neutral-950">
      
      {/* Toast Notification Trigger */}
      {showToast && (
        <div className="fixed top-6 right-6 z-50 bg-neutral-900 border-2 border-emerald-500/40 text-neutral-100 px-5 py-3 rounded-xl shadow-2xl flex items-center gap-3 animate-bounce">
          <Check className="w-5 h-5 text-emerald-400 shrink-0" />
          <span className="text-xs font-mono">{showToast}</span>
        </div>
      )}

      {/* Main Core Viewport */}
      <div>
        
        {/* Navigation Portal */}
        <header className="border-b border-neutral-900 bg-neutral-950/80 sticky top-0 z-40 backdrop-blur">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-18 flex items-center justify-between">
            
            {/* System Title */}
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 bg-amber-400 rounded-lg flex items-center justify-center font-display font-black text-neutral-950 tracking-tighter text-lg shadow-lg shadow-amber-400/10">
                Ω
              </div>
              <div>
                <h1 className="text-lg font-display font-bold leading-none tracking-tight">
                  AuraGym Console
                </h1>
                <span className="text-[10px] font-mono text-neutral-500 block tracking-widest uppercase">
                  Biomechanical Sensor-Link
                </span>
              </div>
            </div>

            {/* Quick Action Tabs */}
            <nav className="flex items-center gap-1.5 bg-neutral-900 p-1 rounded-xl">
              <button
                onClick={() => setActiveTab('console')}
                className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-medium font-sans transition cursor-pointer ${
                  activeTab === 'console'
                    ? 'bg-amber-400 text-neutral-950 font-bold'
                    : 'text-neutral-400 hover:text-neutral-200 hover:bg-neutral-800'
                }`}
              >
                <Activity className="w-3.5 h-3.5" />
                Live Console
              </button>

              <button
                onClick={() => setActiveTab('planner')}
                className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-medium font-sans transition cursor-pointer ${
                  activeTab === 'planner'
                    ? 'bg-amber-400 text-neutral-950 font-bold'
                    : 'text-neutral-400 hover:text-neutral-200 hover:bg-neutral-800'
                }`}
              >
                <Dumbbell className="w-3.5 h-3.5" />
                Plan Synthesizer
              </button>

              <button
                onClick={() => setActiveTab('prd')}
                className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-medium font-sans transition cursor-pointer ${
                  activeTab === 'prd'
                    ? 'bg-amber-400 text-neutral-950 font-bold'
                    : 'text-neutral-400 hover:text-neutral-200 hover:bg-neutral-800'
                }`}
              >
                <FileText className="w-3.5 h-3.5" />
                Technical PRD
              </button>
            </nav>

            {/* Connection Telemetry Badge */}
            <div className="hidden md:flex items-center gap-3 text-xs font-mono">
              <div className="flex items-center gap-1.5 text-neutral-400">
                <Clock className="w-3.5 h-3.5 text-amber-400" />
                <span>UTC Active</span>
              </div>
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
            </div>

          </div>
        </header>

        {/* Hero Segment */}
        <section className="bg-gradient-to-b from-neutral-900/60 to-neutral-950 py-10 md:py-14 border-b border-neutral-900 px-4">
          <div className="max-w-4xl mx-auto text-center space-y-4">
            
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-amber-400/10 border border-amber-400/20 rounded-full text-[10px] font-mono text-amber-300 uppercase tracking-widest">
              <span>Local Hardware Kinematic Processing</span>
              <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-ping"></span>
            </div>

            <h2 className="text-4xl md:text-5xl font-display font-extrabold tracking-tight text-neutral-100 max-w-2xl mx-auto leading-tight">
              Instant Biomechanical Sound Feedback.
            </h2>
            
            <p className="text-sm md:text-base text-neutral-400 max-w-lg mx-auto leading-relaxed">
              No screens to look at. No statistical cloud models. AuraGym pairs dynamic depth analysis with 9-axis earbud trajectory sensors to beep instantly when form drops.
            </p>

            {/* Feature Highlights Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-6 max-w-xl mx-auto text-left">
              <div className="bg-neutral-900/50 border border-neutral-800 rounded-xl p-3 flex gap-2 items-start">
                <Smartphone className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                <div>
                  <span className="font-semibold text-neutral-200 text-xs block">Absolute Focus</span>
                  <p className="text-[10px] text-neutral-500 mt-0.5">Eyes on execution, not distracting dashboard tablets.</p>
                </div>
              </div>

              <div className="bg-neutral-900/50 border border-neutral-800 rounded-xl p-3 flex gap-2 items-start">
                <Volume2 className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                <div>
                  <span className="font-semibold text-neutral-200 text-xs block">45ms Audio Loop</span>
                  <p className="text-[10px] text-neutral-500 mt-0.5">Custom hardware beep patterns coordinate alignment states.</p>
                </div>
              </div>

              <div className="bg-neutral-900/50 border border-neutral-800 rounded-xl p-3 flex gap-2 items-start">
                <ShieldCheck className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                <div>
                  <span className="font-semibold text-neutral-200 text-xs block">Mathematical Spec</span>
                  <p className="text-[10px] text-neutral-500 mt-0.5">Zero statistical AI layers. Pure physical kinematic ratios.</p>
                </div>
              </div>
            </div>

          </div>
        </section>

        {/* Content Tabs Area */}
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          
          {/* Tab 1: Live Interactive Monitor Console (Performance Tracking & BLE buds sound emulation) */}
          {activeTab === 'console' && (
            <div className="space-y-6">
              <div className="flex flex-col md:flex-row justify-between md:items-center gap-3">
                <div>
                  <h3 className="text-xl font-sans font-bold text-neutral-200 flex items-center gap-2">
                    <Activity className="w-5 h-5 text-amber-400" />
                    Biomechanical Tracking Telemetry
                  </h3>
                  <p className="text-xs text-neutral-400 mt-0.5">
                    Connect earphones to hear standard auditory chime-tones. Test ideal vs. deficient reps dynamically.
                  </p>
                </div>

                {activePlan && (
                  <div className="bg-neutral-900 border border-neutral-800 px-3.5 py-1.5 rounded-lg flex items-center gap-2 text-xs">
                    <span className="w-2 h-2 rounded-full bg-amber-400"></span>
                    <span className="text-neutral-400">Plan Tracked: <strong className="text-neutral-100">{activePlan.title}</strong></span>
                  </div>
                )}
              </div>

              <PerformanceTracker activePlan={activePlan} />
            </div>
          )}

          {/* Tab 2: Plan Compiler Synthesizer (Personalized Workout Plan local compiler) */}
          {activeTab === 'planner' && (
            <div className="space-y-6">
              <div>
                <h3 className="text-xl font-sans font-bold text-neutral-200 flex items-center gap-2">
                  <Dumbbell className="w-5 h-5 text-amber-400" />
                  Deterministic Workout Plan Synthesizer
                </h3>
                <p className="text-xs text-neutral-400 mt-0.5">
                  Compile custom workout parameters into mechanical joint profiles based on equipment availability.
                </p>
              </div>

              <WorkoutPlanner onStartWorkout={handleLaunchWorkout} />
            </div>
          )}

          {/* Tab 3: Full PRD Release Viewer Tab */}
          {activeTab === 'prd' && (
            <div className="space-y-6">
              <div>
                <h3 className="text-xl font-sans font-bold text-neutral-200 flex items-center gap-2">
                  <FileText className="w-5 h-5 text-amber-400" />
                  Hardware-Software PRD Specifications
                </h3>
                <p className="text-xs text-neutral-400 mt-0.5">
                  Read complete technical criteria regarding latency ratios, BLE Bluetooth packages, and form offset vectors.
                </p>
              </div>

              <PRDViewer />
            </div>
          )}

        </main>

      </div>

      {/* Footer system details with dynamic Clock and telemetry coordinates */}
      <footer className="border-t border-neutral-900 bg-neutral-950 py-8 px-4 text-xs">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          
          <div className="flex items-center gap-2 text-neutral-500 font-mono">
            <span>AuraGym Biomechanical Node</span>
            <span>•</span>
            <span className="flex items-center gap-1">
              <Clock className="w-3.5 h-3.5 text-neutral-600" />
              {utcTime} UTC
            </span>
          </div>

          <div className="flex items-center gap-1.5 text-[10px] uppercase font-mono text-neutral-600">
            <span>Local Engine</span>
            <span>|</span>
            <span>Zero AI Model dependency</span>
            <span>|</span>
            <span>True Hardware Interface</span>
          </div>

        </div>
      </footer>

    </div>
  );
}
