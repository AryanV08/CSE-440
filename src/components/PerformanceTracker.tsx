import React, { useState, useEffect, useRef } from 'react';
import { WorkoutPlan, RepLog, SystemStatus } from '../types';
import { EXERCISE_DATABASE } from './WorkoutPlanner';
import { soundEngine } from './SoundEngine';
import { 
  Bluetooth, 
  BluetoothOff, 
  Battery, 
  RotateCcw, 
  CheckCircle, 
  XCircle, 
  Play, 
  Pause, 
  Activity, 
  Volume2, 
  VolumeX, 
  Flame, 
  Tv, 
  AlertTriangle 
} from 'lucide-react';

interface PerformanceTrackerProps {
  activePlan: WorkoutPlan | null;
}

export default function PerformanceTracker({ activePlan }: PerformanceTrackerProps) {
  // Use first exercise in active plan or default to squat
  const exercisesToTrack = activePlan 
    ? activePlan.exercises.map(e => EXERCISE_DATABASE[e.exerciseId]).filter(Boolean)
    : [EXERCISE_DATABASE.squat, EXERCISE_DATABASE.bicep_curl, EXERCISE_DATABASE.overhead_press];

  const [selectedExercise, setSelectedExercise] = useState(exercisesToTrack[0] || EXERCISE_DATABASE.squat);
  const [bluetoothConnected, setBluetoothConnected] = useState(false);
  const [volume, setVolume] = useState(0.5);
  const [isMuted, setIsMuted] = useState(false);
  
  // Track continuous simulation state
  const [isPlaying, setIsPlaying] = useState(false);
  const [repCount, setRepCount] = useState(3);
  const [repLogs, setRepLogs] = useState<RepLog[]>([
    { repNumber: 3, timestamp: '18:14:22', isGoodForm: true, score: 96, durationMs: 2400 },
    { repNumber: 2, timestamp: '18:14:02', isGoodForm: false, score: 48, issueDetected: 'Deep spinal flexion (>12° bend)', durationMs: 3100 },
    { repNumber: 1, timestamp: '18:13:38', isGoodForm: true, score: 91, durationMs: 2600 },
  ]);

  // Joint and velocity simulation states
  const [currentHeight, setCurrentHeight] = useState(10); // 10% to 90%
  const [isDescending, setIsDescending] = useState(true);
  const [spineAngleDev, setSpineAngleDev] = useState(1.4); // degrees sway
  const [calibrationStatus, setCalibrationStatus] = useState<'calibrated' | 'searching'>('calibrated');

  // SVG dynamic plotting wave
  const [chartData, setChartData] = useState<number[]>([10, 20, 45, 80, 85, 80, 50, 20, 10]);

  // Audio gesture safety trigger indicator
  const [audioNeedsGesture, setAudioNeedsGesture] = useState(true);

  // Apply sound changes
  useEffect(() => {
    soundEngine.setVolume(isMuted ? 0 : volume);
  }, [volume, isMuted]);

  // Handle auto-sim loop for visual feedback
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isPlaying) {
      interval = setInterval(() => {
        setCurrentHeight((prev) => {
          let next = prev;
          if (isDescending) {
            next = prev + 4;
            if (next >= 85) {
              setIsDescending(false);
              // Slight spine wobble at deep point
              setSpineAngleDev(Math.random() * 6);
            }
          } else {
            next = prev - 4;
            if (next <= 12) {
              setIsDescending(true);
              // Rep successfully finished! Compile a simulated standard Good Rep
              triggerRepSimulation(true);
            }
          }
          // Update wave
          setChartData((prevWave) => [...prevWave.slice(1), next]);
          return next;
        });
      }, 100);
    }
    return () => clearInterval(interval);
  }, [isPlaying, isDescending]);

  // Core callback to trigger and audio-beep
  const triggerRepSimulation = (isGood: boolean) => {
    setAudioNeedsGesture(false);

    // Increment local state counter
    const nextRep = repCount + 1;
    setRepCount(nextRep);

    // Audio cue matching exact PRD specifications
    if (bluetoothConnected) {
      if (isGood) {
        soundEngine.playGoodRep();
      } else {
        soundEngine.playOffFormRep();
      }
    }

    const formatTime = () => {
      const d = new Date();
      return `${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}:${String(d.getSeconds()).padStart(2, '0')}`;
    };

    // Construct precise kinematic error details
    let issue: string | undefined = undefined;
    if (!isGood) {
      if (selectedExercise.id === 'squat') {
        issue = 'Shallow depth (81° flexion detected - Ideal: >90°)';
      } else if (selectedExercise.id === 'bicep_curl') {
        issue = 'Shoulder sway deviation exceed threshold (>6.8° swing)';
      } else if (selectedExercise.id === 'overhead_press') {
        issue = 'Cervical alignment compromised (Left temporal tilt)';
      } else {
        issue = 'Uncontrolled eccentric tempo transition (<1.1s acceleration)';
      }
    }

    const log: RepLog = {
      repNumber: nextRep,
      timestamp: formatTime(),
      isGoodForm: isGood,
      score: isGood ? Math.floor(92 + Math.random() * 7) : Math.floor(40 + Math.random() * 20),
      durationMs: isGood ? 2200 + Math.floor(Math.random() * 500) : 1500 + Math.floor(Math.random() * 1500),
      issueDetected: issue
    };

    setRepLogs(prev => [log, ...prev]);

    // Graph peak update response
    setChartData(prev => [...prev.slice(3), isGood ? 98 : 42, 60, 15]);
  };

  const handleBluetoothToggle = () => {
    setAudioNeedsGesture(false);
    if (!bluetoothConnected) {
      setBluetoothConnected(true);
      soundEngine.playBluetoothConnect();
    } else {
      soundEngine.playBluetoothDisconnect();
      setBluetoothConnected(false);
    }
  };

  const resetTracker = () => {
    setRepCount(0);
    setRepLogs([]);
  };

  // Compute stats
  const goodRepsCount = repLogs.filter(r => r.isGoodForm).length;
  const currentFormScore = repLogs.length > 0 
    ? Math.round(repLogs.reduce((acc, r) => acc + r.score, 0) / repLogs.length)
    : 100;

  return (
    <div className="grid lg:grid-cols-12 gap-8">
      {/* 1. Sensors & Device Connection Status Deck */}
      <div className="lg:col-span-4 space-y-6">
        
        {/* Bluetooth Earphones Board */}
        <div id="device-bluetooth-status" className="bg-neutral-900 border border-neutral-800 rounded-2xl p-5 shadow-xl space-y-4">
          <div className="flex justify-between items-center pb-3 border-b border-neutral-800/80">
            <h4 className="text-sm font-semibold text-neutral-200 flex items-center gap-2">
              <Bluetooth className={`w-4 h-4 ${bluetoothConnected ? 'text-blue-400 animate-pulse' : 'text-neutral-500'}`} />
              Earbud Node (IMU-Link)
            </h4>
            <span className={`text-[10px] font-mono px-2 py-0.5 rounded-full ${
              bluetoothConnected 
                ? 'bg-blue-400/10 text-blue-400 border border-blue-400/20' 
                : 'bg-neutral-800 text-neutral-500'
            }`}>
              {bluetoothConnected ? 'Linked' : 'Offline'}
            </span>
          </div>

          <div className="flex justify-between items-center">
            <span className="text-xs text-neutral-400 font-sans">Bluetooth Audio Stream</span>
            <button
              onClick={handleBluetoothToggle}
              className={`p-2.5 rounded-xl cursor-pointer font-sans text-xs font-semibold flex items-center gap-2 transition active:scale-95 ${
                bluetoothConnected 
                  ? 'bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/20' 
                  : 'bg-blue-500 text-neutral-950 font-bold hover:bg-blue-400'
              }`}
            >
              {bluetoothConnected ? (
                <>
                  <BluetoothOff className="w-4 h-4" />
                  Disconnect BLE
                </>
              ) : (
                <>
                  <Bluetooth className="w-4 h-4" />
                  Scan & Pair Earphones
                </>
              )}
            </button>
          </div>

          {/* Battery and telemetry mock details */}
          {bluetoothConnected && (
            <div className="space-y-2.5 pt-2 border-t border-neutral-800/40 text-xs font-mono">
              <div className="flex justify-between text-neutral-400">
                <span>Bud Battery Balance</span>
                <span className="flex items-center gap-1">
                  <Battery className="w-4 h-4 text-emerald-400 fill-emerald-400" />
                  92% (Continuous)
                </span>
              </div>
              <div className="flex justify-between text-neutral-400">
                <span>IMU Gyro Hz rate</span>
                <span className="text-neutral-200">120 Hz standard</span>
              </div>
            </div>
          )}

          {audioNeedsGesture && (
            <div className="p-3 bg-amber-400/5 border border-amber-400/10 rounded-xl text-[11px] text-neutral-400 leading-normal flex gap-2">
              <span className="text-amber-400 shrink-0 font-bold">💡 Audio Hint:</span>
              <span>Tap the button above to authorize audio beeps in your browser sandboxed sandbox.</span>
            </div>
          )}
        </div>

        {/* Spatial Depth Camera Board */}
        <div id="spatial-depth-camera" className="bg-neutral-900 border border-neutral-800 rounded-2xl p-5 shadow-xl space-y-4">
          <div className="flex justify-between items-center pb-3 border-b border-neutral-800/80">
            <h4 className="text-sm font-semibold text-neutral-200 flex items-center gap-2">
              <Tv className="w-4 h-4 text-amber-400" />
              Spatial Depth Anchor
            </h4>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-amber-400/10 text-amber-400">
              Calibrated
            </span>
          </div>

          <div className="text-xs space-y-2 font-mono text-neutral-400">
            <div className="flex justify-between">
              <span>Sensor Focal Frame</span>
              <span className="text-neutral-200">60 FPS (True-Depth)</span>
            </div>
            <div className="flex justify-between">
              <span>Active Body Nodes</span>
              <span className="text-neutral-100 font-sans font-semibold">14 Joints Tracked</span>
            </div>
            <div className="flex justify-between">
              <span>Ambient Calibration</span>
              <span className="text-neutral-200">0.94 lux stable</span>
            </div>
          </div>
        </div>

        {/* Audio Volume Mixer Settings */}
        <div id="audio-settings" className="bg-neutral-900 border border-neutral-800 rounded-2xl p-5 shadow-xl space-y-4">
          <h4 className="text-sm font-semibold text-neutral-200 flex items-center gap-2">
            <Volume2 className="w-4 h-4 text-neutral-400" />
            Earbud Cue Volume
          </h4>

          <div className="flex items-center gap-3">
            <button 
              onClick={() => setIsMuted(!isMuted)} 
              className="text-neutral-400 hover:text-neutral-200 transition"
              title={isMuted ? "Unmute" : "Mute"}
            >
              {isMuted ? <VolumeX className="text-rose-400" /> : <Volume2 />}
            </button>
            <input 
              type="range"
              min="0"
              max="1"
              step="0.1"
              value={volume}
              onChange={(e) => {
                setVolume(parseFloat(e.target.value));
                setIsMuted(false);
              }}
              className="flex-1 accent-amber-400 bg-neutral-950 rounded-lg cursor-pointer h-1.5"
            />
          </div>
          <span className="text-[10px] font-mono text-neutral-500 block text-center">
            {isMuted ? 'Muted' : `Volume Coefficient: ${Math.round(volume * 100)}%`}
          </span>
        </div>
      </div>

      {/* 2. Real-Time Telemetry & Tracking Console Grid */}
      <div className="lg:col-span-8 space-y-6">

        {/* Core Live Monitor Display */}
        <div className="bg-neutral-900 border border-neutral-800 rounded-2xl overflow-hidden shadow-2xl">
          
          {/* Header */}
          <div className="p-5 border-b border-neutral-800 bg-neutral-950/20 flex flex-wrap justify-between items-center gap-3">
            <div>
              <span className="text-[10px] uppercase font-mono font-bold text-amber-400 tracking-wider">
                Telemetry View: {selectedExercise.name}
              </span>
              <h3 className="text-lg font-bold text-neutral-100">Live Sensory Signal Feed</h3>
            </div>

            <div className="flex gap-2">
              {exercisesToTrack.map((ex) => (
                <button
                  key={ex.id}
                  onClick={() => setSelectedExercise(ex)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium cursor-pointer transition ${
                    selectedExercise.id === ex.id
                      ? 'bg-amber-400 text-neutral-950 font-bold shadow'
                      : 'bg-neutral-800 text-neutral-400 hover:text-neutral-200'
                  }`}
                >
                  {ex.name.split(' ')[0]}
                </button>
              ))}
            </div>
          </div>

          {/* Interactive Plotting Dashboard & Real-Time Visualization */}
          <div className="p-6 grid md:grid-cols-12 gap-6 bg-neutral-950/10">
            
            {/* Visual joint coordination wireframe (pure beautiful SVG simulator) */}
            <div className="md:col-span-5 bg-neutral-950 border border-neutral-800/80 rounded-xl p-4 flex flex-col justify-between items-center min-h-[220px]">
              <span className="text-[9px] font-mono text-neutral-600 uppercase tracking-widest block self-start">
                Deterministic Kinematic Wire
              </span>

              {/* Dynamic SVG representation of joint metrics relative to depth */}
              <svg className="w-40 h-40 mt-2" viewBox="0 0 100 100">
                <defs>
                  <radialGradient id="ring-glow" cx="50%" cy="50%" r="50%">
                    <stop offset="0%" stopColor="#f59e0b" stopOpacity="0.15" />
                    <stop offset="100%" stopColor="#f59e0b" stopOpacity="0" />
                  </radialGradient>
                </defs>

                {/* Ground Line */}
                <line x1="10" y1="90" x2="90" y2="90" stroke="#404040" strokeWidth="2" strokeDasharray="3,3" />

                {/* Simulated Spine line */}
                <line 
                  x1="50" 
                  y1="25" 
                  x2="50" 
                  y2="55" 
                  stroke={spineAngleDev > 5 ? '#f43f5e' : '#10b981'} 
                  strokeWidth="3.5" 
                  className="transition-all duration-200"
                />

                {/* Head (with Earbud tracker indicator dots) */}
                <circle 
                  cx="50" 
                  cy="18" 
                  r="7" 
                  fill="#262626" 
                  stroke={bluetoothConnected ? '#3b82f6' : '#525252'} 
                  strokeWidth="2" 
                />
                {/* Lit indicators for BLE earphones */}
                {bluetoothConnected && (
                  <>
                    <circle cx="43" cy="18" r="1.5" fill="#3b82f6" className="animate-ping" />
                    <circle cx="57" cy="18" r="1.5" fill="#3b82f6" />
                  </>
                )}

                {/* Knee to Hip lever mechanism based on depth height parameter */}
                {/* Hip */}
                <circle cx="50" cy="55" r="4" fill="#f59e0b" />
                {/* Knee flex points dynamically scaling height factor representing standard repetitions */}
                <line 
                  x1="50" 
                  y1="55" 
                  x2={38 + (currentHeight / 8)} 
                  y2={55 + (currentHeight / 3)} 
                  stroke="#a3a3a3" 
                  strokeWidth="3"
                />
                {/* Knee */}
                <circle cx={38 + (currentHeight / 8)} cy={55 + (currentHeight / 3)} r="4" fill="#a3a3a3" />
                {/* Ankle Anchor */}
                <line 
                  x1={38 + (currentHeight / 8)} 
                  y1={55 + (currentHeight / 3)} 
                  x2="48" 
                  y2="90" 
                  stroke="#a3a3a3" 
                  strokeWidth="3"
                />
                <circle cx="48" cy="90" r="3" fill="#525252" />

                {/* Active Range of Movement threshold glow box */}
                <rect x="25" y="45" width="50" height="30" fill="url(#ring-glow)" stroke="#f59e0b" strokeWidth="1" strokeOpacity="0.2" rx="3" />
              </svg>

              <div className="w-full text-center mt-3 text-xs font-mono text-neutral-400">
                <div className="flex justify-between px-2">
                  <span>Joint Height:</span>
                  <span className="text-neutral-100">{currentHeight}%</span>
                </div>
                <div className="flex justify-between px-2">
                  <span>Spine Deviation:</span>
                  <span className={spineAngleDev > 5 ? 'text-rose-400 font-bold' : 'text-emerald-400'}>
                    {spineAngleDev.toFixed(1)}° {spineAngleDev > 5 ? 'FAULT' : 'GOOD'}
                  </span>
                </div>
              </div>
            </div>

            {/* Velocity / Acceleration Wave Telemetry Graph */}
            <div className="md:col-span-7 bg-neutral-950 border border-neutral-800/80 rounded-xl p-4 flex flex-col justify-between">
              <div>
                <span className="text-[9px] font-mono text-neutral-600 uppercase tracking-widest block">
                  Continuous Velocity Profiling (m/s)
                </span>
                <p className="text-xs text-neutral-400 mt-1">
                  Plotting dynamic phase changes (eccentric and concentric velocity thresholds).
                </p>
              </div>

              {/* Dynamic waveform SVG graph plotting simulated rep data */}
              <div className="h-28 w-full mt-2 relative flex items-end">
                <svg className="w-full h-full overflow-visible" viewBox="0 0 200 100" preserveAspectRatio="none">
                  {/* Grid Lines */}
                  <line x1="0" y1="20" x2="200" y2="20" stroke="#171717" strokeWidth="1" />
                  <line x1="0" y1="50" x2="200" y2="50" stroke="#262626" strokeWidth="1" />
                  <line x1="0" y1="80" x2="200" y2="80" stroke="#171717" strokeWidth="1" />

                  {/* Dynamic waveform paths */}
                  <path
                    d={`M ${chartData.map((val, idx) => `${(idx / (chartData.length - 1)) * 200},${100 - val}`).join(' L ')}`}
                    fill="none"
                    stroke="#f59e0b"
                    strokeWidth="2.5"
                    className="transition-all duration-300"
                  />

                  {/* Pulsing focal node */}
                  <circle
                    cx="200"
                    cy={100 - chartData[chartData.length - 1]}
                    r="4"
                    fill="#f59e0b"
                    className="animate-pulse"
                  />
                </svg>

                <div className="absolute right-2 top-2 font-mono text-[9px] text-neutral-500 bg-neutral-900 border border-neutral-800 px-1.5 py-0.5 rounded">
                  Max: 1.48 m/s
                </div>
              </div>

              <div className="flex justify-between items-center text-[10px] font-mono text-neutral-500 pt-3 border-t border-neutral-900">
                <span>Phase: {currentHeight > 75 ? 'Transition Peak' : isDescending ? 'Eccentric Swing' : 'Concentric Lift'}</span>
                <span>Threshold: &lt;1.65 m/s maximum velocity bounds</span>
              </div>
            </div>
          </div>

          {/* Interactive Trigger Control Console. Play beeps on demand or start automation */}
          <div className="p-5 border-t border-neutral-800 bg-neutral-950/40 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex gap-2.5 w-full sm:w-auto">
              {/* Play loop automation */}
              <button
                onClick={() => setIsPlaying(!isPlaying)}
                className={`flex-1 sm:flex-none py-2.5 px-4 rounded-xl font-sans text-xs font-bold cursor-pointer transition flex items-center justify-center gap-2 ${
                  isPlaying 
                    ? 'bg-rose-500/15 text-rose-400 border border-rose-500/30 hover:bg-rose-500/25' 
                    : 'bg-amber-400 text-neutral-950 hover:bg-amber-300 shadow'
                }`}
              >
                {isPlaying ? (
                  <>
                    <Pause className="w-3.5 h-3.5" />
                    Pause Auto-Motion
                  </>
                ) : (
                  <>
                    <Play className="w-3.5 h-3.5 fill-current" />
                    Start Auto-Motion
                  </>
                )}
              </button>

              <button
                onClick={resetTracker}
                title="Reset log state"
                className="p-2.5 border border-neutral-800 bg-neutral-900 hover:bg-neutral-800 rounded-xl transition cursor-pointer"
              >
                <RotateCcw className="w-4 h-4 text-neutral-400" />
              </button>
            </div>

            {/* Direct manual triggers simulating a single completed repetition */}
            <div className="flex items-center gap-2 w-full sm:w-auto">
              <span className="text-xs text-neutral-400 font-sans mr-1 hidden sm:inline">Manual Telemetry Injection:</span>
              
              <button
                onClick={() => triggerRepSimulation(true)}
                className="flex-1 sm:flex-none py-2.5 px-3.5 bg-neutral-900 hover:bg-neutral-800 border border-neutral-800 rounded-xl text-xs font-bold text-emerald-400 cursor-pointer flex items-center justify-center gap-1.5 transition active:scale-95"
              >
                <CheckCircle className="w-3.5 h-3.5" />
                Good Rep Beep
              </button>

              <button
                onClick={() => triggerRepSimulation(false)}
                className="flex-1 sm:flex-none py-2.5 px-3.5 bg-neutral-900 hover:bg-neutral-800 border border-neutral-800 rounded-xl text-xs font-bold text-rose-400 cursor-pointer flex items-center justify-center gap-1.5 transition active:scale-95"
              >
                <XCircle className="w-3.5 h-3.5" />
                Off-Form Beep
              </button>
            </div>
          </div>
        </div>

        {/* 3. Session Statistics Dashboard Deck */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-neutral-900 border border-neutral-800 p-4 rounded-xl shadow-md text-center">
            <span className="text-[10px] font-mono text-neutral-400 uppercase tracking-widest block">Total Repetitions</span>
            <span className="text-2xl font-bold font-sans text-neutral-100 block mt-1">{repLogs.length}</span>
          </div>

          <div className="bg-neutral-900 border border-neutral-800 p-4 rounded-xl shadow-md text-center">
            <span className="text-[10px] font-mono text-neutral-400 uppercase tracking-widest block">Good Form reps</span>
            <span className="text-2xl font-bold font-sans text-emerald-400 block mt-1">{goodRepsCount}</span>
          </div>

          <div className="bg-neutral-900 border border-neutral-800 p-4 rounded-xl shadow-md text-center">
            <span className="text-[10px] font-mono text-neutral-400 uppercase tracking-widest block">Accuracy Core</span>
            <span className={`text-2xl font-bold font-sans block mt-1 ${
              currentFormScore > 85 ? 'text-emerald-400' : currentFormScore > 65 ? 'text-amber-400' : 'text-rose-400'
            }`}>
              {currentFormScore}%
            </span>
          </div>

          <div className="bg-neutral-900 border border-neutral-800 p-4 rounded-xl shadow-md text-center">
            <span className="text-[10px] font-mono text-neutral-400 uppercase tracking-widest block">Acoustic Feedback</span>
            <span className="text-xs font-mono text-neutral-300 block mt-2.5">
              {bluetoothConnected 
                ? <span className="text-blue-400 font-bold">Active in buds</span> 
                : <span className="text-rose-400">Offline (No BLE)</span>
              }
            </span>
          </div>
        </div>

        {/* 4. Telemetry Records (Workout log of raw calculations) */}
        <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-6 shadow-xl">
          <div className="flex justify-between items-center pb-4 border-b border-neutral-800">
            <div>
              <h4 className="text-sm font-semibold text-neutral-100">Live Device Logs</h4>
              <p className="text-xs text-neutral-500 mt-0.5">Continuous kinematic frame results triggered directly by physical action</p>
            </div>
            <span className="text-[10px] font-mono text-neutral-400">Total logs: {repLogs.length}</span>
          </div>

          <div className="mt-4 space-y-3 max-h-[220px] overflow-y-auto pr-1">
            {repLogs.length === 0 ? (
              <div className="text-center py-8 text-neutral-500 text-xs">
                No telemetry sequences logged yet. Trigger reps above or start auto-motion simulator loops!
              </div>
            ) : (
              repLogs.map((log) => (
                <div 
                  key={log.repNumber} 
                  className={`flex items-center justify-between p-3 border rounded-xl gap-3 text-xs transition ${
                    log.isGoodForm 
                      ? 'bg-neutral-950/20 border-neutral-800/80 hover:border-emerald-500/20' 
                      : 'bg-rose-950/5 border-rose-950/40 hover:border-rose-500/20'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span className={`w-8 h-8 rounded-lg flex items-center justify-center font-mono font-bold text-xs ${
                      log.isGoodForm 
                        ? 'bg-emerald-500/10 text-emerald-400' 
                        : 'bg-rose-500/10 text-rose-400'
                    }`}>
                      #{log.repNumber}
                    </span>

                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-neutral-200">{selectedExercise.name}</span>
                        <span className="text-[10px] font-mono text-neutral-500">{log.timestamp}</span>
                      </div>
                      
                      {log.issueDetected ? (
                        <p className="text-rose-400 font-medium text-[11px] mt-0.5 flex items-center gap-1">
                          <AlertTriangle className="w-3.5 h-3.5" />
                          Fault: {log.issueDetected}
                        </p>
                      ) : (
                        <p className="text-neutral-400 text-[11px] mt-0.5">Execution profile within limits. Kinetic alignment is nominal.</p>
                      )}
                    </div>
                  </div>

                  <div className="text-right shrink-0">
                    <span className={`font-mono font-bold text-xs ${log.isGoodForm ? 'text-emerald-400' : 'text-rose-400'}`}>
                      {log.score}% Quality
                    </span>
                    <span className="text-[10px] font-mono text-neutral-500 block mt-0.5">
                      Feedback: {log.isGoodForm ? 'Chime (Good)' : 'Pitch Drop (Fault)'}
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

      </div>
    </div>
  );
}
