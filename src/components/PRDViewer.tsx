import React, { useState } from 'react';
import { BookOpen, Shield, Code, Settings, Cpu, Activity, Volume2, HardDrive, Timer } from 'lucide-react';

export default function PRDViewer() {
  const [activeTab, setActiveTab] = useState<'overview' | 'hardware' | 'software' | 'audio'>('overview');

  const tabs = [
    { id: 'overview' as const, label: 'Overview', icon: BookOpen },
    { id: 'hardware' as const, label: 'Hardware Spec', icon: Cpu },
    { id: 'software' as const, label: 'Software Specs', icon: Code },
    { id: 'audio' as const, label: 'Feedback Spec', icon: Volume2 },
  ];

  return (
    <div id="prd-viewer" className="bg-neutral-900 border border-neutral-800 rounded-2xl overflow-hidden shadow-2xl">
      {/* Header */}
      <div className="p-6 border-b border-neutral-800 bg-neutral-900/50 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-mono font-semibold text-amber-400 uppercase tracking-widest bg-amber-400/10 px-2.5 py-1 rounded-full">
            Technical PRD v2.1
          </span>
          <h2 className="text-2xl font-sans font-bold text-neutral-100 mt-2">
            Product Requirements Document (PRD)
          </h2>
          <p className="text-sm text-neutral-400 mt-1">
            Biomechanical Smart-Home Gym System with Direct Earbud-Feedback loop
          </p>
        </div>
        <div className="flex items-center gap-3 text-xs text-neutral-400 font-mono">
          <Shield className="w-4 h-4 text-emerald-500" />
          <span>Local Engine (Zero cloud/LLM dependency)</span>
        </div>
      </div>

      {/* Tabs Navigation */}
      <div className="flex border-b border-neutral-800 overflow-x-auto scrollbar-none bg-neutral-950/40">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-6 py-4 text-sm font-medium border-b-2 whitespace-nowrap transition-all duration-200 ${
                activeTab === tab.id
                  ? 'border-amber-400 text-amber-400 bg-neutral-800/20'
                  : 'border-transparent text-neutral-400 hover:text-neutral-200 hover:bg-neutral-800/10'
              }`}
            >
              <Icon className="w-4 h-4" />
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* Tab Content */}
      <div className="p-6 md:p-8 max-h-[600px] overflow-y-auto font-sans leading-relaxed text-neutral-300">
        {activeTab === 'overview' && (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold text-neutral-100 flex items-center gap-2">
                1. Product Overview & Core Mandate
              </h3>
              <p className="text-sm text-neutral-400 mt-2">
                To build a highly accurate, fully deterministic smart-home fitness ecosystem. 
                Instead of using latency-heavy cloud APIs, general LLMs, or abstract "AI coaches" that provide post-workout advice, the system relies strictly on 
                <strong> local computer vision coordinates and dual 9-Axis IMU-enabled earphones</strong> 
                to provide instantaneous, frame-by-frame biomechanical analysis.
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div className="bg-neutral-950/50 p-4 border border-neutral-800 rounded-xl">
                <h4 className="text-sm font-semibold text-amber-400 flex items-center gap-1.5">
                  <Activity className="w-4 h-4 text-amber-400" /> Real-time Performance Tracking
                </h4>
                <p className="text-xs text-neutral-400 mt-1 leading-normal">
                  Tracks movement velocity, posture alignment, depth consistency, and repetition velocity profiles. All calculation occurs directly in client memory with &lt;15ms processing latency.
                </p>
              </div>
              <div className="bg-neutral-950/50 p-4 border border-neutral-800 rounded-xl">
                <h4 className="text-sm font-semibold text-amber-400 flex items-center gap-1.5">
                  <Volume2 className="w-4 h-4 text-amber-400" /> Instant Sound-Cue Feedback
                </h4>
                <p className="text-xs text-neutral-400 mt-1 leading-normal">
                  The earphones act as the primary guidance system. As soon as a rep terminates, they play a distinct acoustic chime (Good Form) or corrective tone (Form Fault) directly to the user to maintain lifting rhythm.
                </p>
              </div>
            </div>

            <div className="bg-amber-400/5 border border-amber-400/20 p-4 rounded-xl">
              <h4 className="text-sm font-semibold text-amber-300 flex items-center gap-2">
                ⚠️ Strict Non-AI Constraint (Deterministic Engine)
              </h4>
              <p className="text-xs text-neutral-400 mt-1.5 leading-normal">
                This product deliberately avoids generative models, conversational chatbots, cloud-based text summaries, or black-box predictive networks. 
                All measurements are strictly derived from real mathematical kinematic models, high-performance physical sensors, joint coordinate trigonometric formulas, and deterministic rules.
              </p>
            </div>
          </div>
        )}

        {activeTab === 'hardware' && (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold text-neutral-100 flex items-center gap-2">
                2. Hardware Architecture & Bluetooth Pipeline
              </h3>
              <p className="text-sm text-neutral-400 mt-2">
                The smart environment integrates three physical hardware pillars working in local unison:
              </p>
            </div>

            <div className="space-y-4">
              <div className="flex gap-4 p-4 border border-neutral-800 bg-neutral-950/30 rounded-xl">
                <div className="bg-amber-400/10 p-2.5 rounded-lg h-fit text-amber-400">
                  <Volume2 className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-neutral-200">2.1 Pure Audio BLE Buds (Custom Earbud Node)</h4>
                  <p className="text-xs text-neutral-400 mt-1">
                    Equipped with a built-in 9-axis Inertial Measurement Unit (IMU). Measures head angle fluctuation, neck sway, and spine line extension. Uses high-throughput Bluetooth 5.3 Low Energy to transmit posture logs and receive immediate tone triggers.
                  </p>
                </div>
              </div>

              <div className="flex gap-4 p-4 border border-neutral-800 bg-neutral-950/30 rounded-xl">
                <div className="bg-amber-400/10 p-2.5 rounded-lg h-fit text-amber-400">
                  <Cpu className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-neutral-200">2.2 Spatial Telemetry Anchor</h4>
                  <p className="text-xs text-neutral-400 mt-1">
                    Wall-mounted or tabletop depth sensor system measuring core joint positions (Hip-Knee-Ankle-Shoulder alignment). Combines depth information with standard 60FPS video vectors locally on the hub.
                  </p>
                </div>
              </div>

              <div className="flex gap-4 p-4 border border-neutral-800 bg-neutral-950/30 rounded-xl">
                <div className="bg-amber-400/10 p-2.5 rounded-lg h-fit text-amber-400">
                  <Timer className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-neutral-200">2.3 Real-time Latency Budget</h4>
                  <p className="text-xs text-neutral-400 mt-1">
                    To maintain athletic safety and reflex timing, the time from rep completion to the earbud chime must be <strong>under 45ms</strong>:
                  </p>
                  <ul className="text-xs text-neutral-400 list-disc list-inside mt-2 space-y-1">
                    <li>Sensor-to-Hub Capture: 8ms</li>
                    <li>Kinematic State Solving: 12ms</li>
                    <li>Audio Trigger BLE Command: 5ms</li>
                    <li>On-Earbud Internal Synthesizer Latency: 15ms</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'software' && (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold text-neutral-100 flex items-center gap-2">
                3. Software Architecture & Workout Heuristics
              </h3>
              <p className="text-sm text-neutral-400 mt-2">
                The software layer models specific exercise routines through rigorous trigonometric constraints rather than statistical networks:
              </p>
            </div>

            <div className="space-y-4">
              <div className="bg-neutral-950/40 border border-neutral-800 p-4 rounded-xl">
                <h4 className="text-sm font-semibold text-neutral-200 flex items-center gap-1.5">
                  <Activity className="w-4 h-4 text-emerald-500" /> Triggers for Form Offsets
                </h4>
                <div className="grid sm:grid-cols-2 gap-4 mt-3">
                  <div className="bg-neutral-900 border border-neutral-800 p-3 rounded-lg text-xs">
                    <span className="font-semibold text-amber-400">A. Squat Depth Failure</span>
                    <p className="text-neutral-400 mt-1">
                      Knee angle threshold &gt; 95° at peak of the eccentric phase. System flags "Insufficient Depth".
                    </p>
                  </div>
                  <div className="bg-neutral-900 border border-neutral-800 p-3 rounded-lg text-xs">
                    <span className="font-semibold text-amber-400">B. Bicep Curl Momentum Bias</span>
                    <p className="text-neutral-400 mt-1">
                      Shoulder coordinate drift horizontally &gt; 5 cm during ascent. Flags momentum sway.
                    </p>
                  </div>
                </div>
              </div>

              <div className="p-4 bg-neutral-950/50 rounded-xl border border-neutral-800">
                <span className="text-xs font-mono text-neutral-400 block mb-1">DATA FLOW PIPELINE</span>
                <div className="flex flex-col md:flex-row items-center gap-2 justify-between">
                  <span className="bg-neutral-900 px-3 py-1.5 rounded text-xs border border-neutral-800">1. Raw Coordinate Vectors</span>
                  <span className="text-neutral-500 text-xs">→</span>
                  <span className="bg-neutral-900 px-3 py-1.5 rounded text-xs border border-neutral-800">2. Peak Velocity Estimator</span>
                  <span className="text-neutral-500 text-xs">→</span>
                  <span className="bg-neutral-900 px-3 py-1.5 rounded text-xs border border-neutral-800">3. Local Form Validator</span>
                  <span className="text-neutral-500 text-xs">→</span>
                  <span className="bg-neutral-900 px-3 py-1.5 rounded text-xs border border-neutral-800">4. Dynamic Audio Driver</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'audio' && (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold text-neutral-100 flex items-center gap-2">
                4. Bluetooth Earphone Audio Specification
              </h3>
              <p className="text-sm text-neutral-400 mt-2">
                This specification designs direct sound pulses so users receive continuous feedback without voice cues which can be distracting during heavy lifts:
              </p>
            </div>

            <table className="w-full text-left text-xs text-neutral-400 border border-neutral-800 rounded-lg overflow-hidden">
              <thead>
                <tr className="bg-neutral-950/80 text-neutral-200 border-b border-neutral-800">
                  <th className="p-3">User Outcome</th>
                  <th className="p-3">Tone Signature</th>
                  <th className="p-3">Primary Frequency</th>
                  <th className="p-3">Instructional Purpose</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-neutral-800/60">
                  <td className="p-3 font-semibold text-emerald-400">Perfect Form Rep</td>
                  <td className="p-3">Double High Pitch Chime</td>
                  <td className="p-3 font-mono">680 Hz ➔ 960 Hz</td>
                  <td className="p-3">Confirms execution inside parameters (tempo, range, spine line).</td>
                </tr>
                <tr className="border-b border-neutral-800/60">
                  <td className="p-3 font-semibold text-rose-400 font-mono">Form Offset / Fault</td>
                  <td className="p-3">Flat Long Warning Tone</td>
                  <td className="p-3 font-mono">180 Hz Wave</td>
                  <td className="p-3">Flags spinal bend, shallow depth, or uncontrolled momentum.</td>
                </tr>
                <tr className="border-b border-neutral-800/60">
                  <td className="p-3 text-amber-400">BLE Connected</td>
                  <td className="p-3">Tri-tone Ascending</td>
                  <td className="p-3 font-mono">440Hz ➔ 554Hz ➔ 659Hz</td>
                  <td className="p-3">Earphones connected to raw gyroscope stream.</td>
                </tr>
                <tr>
                  <td className="p-3 text-neutral-400">BLE Disconnected</td>
                  <td className="p-3">Tri-tone Descending</td>
                  <td className="p-3 font-mono">659Hz ➔ 554Hz ➔ 330Hz</td>
                  <td className="p-3">IMU sensor connection offline.</td>
                </tr>
              </tbody>
            </table>

            <div className="bg-neutral-950/50 p-4 border border-neutral-800 rounded-xl flex items-start gap-3">
              <span className="text-xs font-semibold px-2 py-1 bg-amber-400/20 text-amber-300 rounded font-mono mt-0.5">Note</span>
              <p className="text-xs text-neutral-400 leading-normal">
                Audio cues automatically duck any current background music by <strong>12dB</strong> with a fast decay of 120ms to ensure feedback is crystal clear without breaking the user's flow or starting a speech interruption block.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
