import { motion } from "framer-motion";
import type { RaceState } from "./useCompare";
import { getMethod } from "@/lib/numerical/methods";
import { Play, Pause, RotateCcw, FastForward, Trophy, AlertTriangle } from "lucide-react";
import { useEffect, useRef, useState } from "react";

interface Props {
  state: RaceState;
  onTick: () => void;
  onReset: () => void;
}

export function RaceDashboard({ state, onTick, onReset }: Props) {
  const [playing, setPlaying] = useState(false);
  const [speed, setSpeed] = useState(200); // ms per step
  const timer = useRef<number | null>(null);

  useEffect(() => {
    if (playing && state.status === "racing") {
      timer.current = window.setInterval(onTick, speed);
    }
    return () => { if (timer.current) clearInterval(timer.current); };
  }, [playing, speed, state.status, onTick]);

  useEffect(() => {
    if (state.status === "finished") setPlaying(false);
  }, [state.status]);

  if (state.status === "idle") return null;

  return (
    <div className="space-y-6">
      {/* Controls */}
      <div className="glass p-3 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <button onClick={() => setPlaying(p => !p)} disabled={state.status === "finished"}
            className="w-12 h-12 rounded-xl bg-gradient-primary flex items-center justify-center text-white shadow-glow hover:shadow-glow-lg transition disabled:opacity-50">
            {playing ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5 ml-1" />}
          </button>
          <button onClick={onReset}
            className="w-10 h-10 rounded-lg border border-white/10 bg-white/[0.03] flex items-center justify-center text-muted-foreground hover:text-foreground transition">
            <RotateCcw className="w-4 h-4" />
          </button>
          <div className="text-sm font-medium ml-2">
            Global Iteration: <span className="font-mono text-primary">{state.currentIter}</span> / {state.maxIterTotal}
          </div>
        </div>
        <div className="flex items-center gap-2">
          <FastForward className="w-4 h-4 text-muted-foreground" />
          {[500, 200, 50, 10].map(s => (
            <button key={s} onClick={() => setSpeed(s)}
              className={`px-2 py-1 rounded-md text-[10px] font-medium transition ${speed === s ? "bg-primary/20 text-primary" : "text-muted-foreground hover:text-foreground"}`}>
              {s}ms
            </button>
          ))}
        </div>
      </div>

      {/* Track Lanes */}
      <div className="space-y-3">
        {state.selectedMethods.map(mid => {
          const m = getMethod(mid);
          const res = state.results[mid];
          if (!m || !res) return null;

          if ("error" in res) {
            return (
              <div key={mid} className="glow-card p-4 border-red-500/30 bg-red-500/5">
                <div className="flex items-center gap-3 text-red-400">
                  <AlertTriangle className="w-5 h-5" />
                  <span className="font-semibold">{m.name} failed:</span>
                  <span className="text-sm">{res.error}</span>
                </div>
              </div>
            );
          }

          const iters = res.iterations;
          // Calculate current progress for this specific method based on global iter
          const activeIterIndex = Math.min(state.currentIter, iters.length - 1);
          const activeStep = iters[activeIterIndex] as any;
          const isDone = state.currentIter >= iters.length - 1;
          const isWinner = isDone && iters.length - 1 < state.maxIterTotal && res.converged;

          const progressPct = Math.min(100, ((activeIterIndex + 1) / iters.length) * 100);

          return (
            <div key={mid} className={`glow-card p-4 transition-all duration-300 ${isWinner ? "border-emerald-500/50 shadow-[0_0_20px_rgba(16,185,129,0.15)]" : ""}`}>
              <div className="flex justify-between items-center mb-3">
                <div className="flex items-center gap-3">
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center bg-gradient-to-br ${m.color}`}>
                    <m.icon className="w-4 h-4 text-white" />
                  </div>
                  <div>
                    <div className="font-bold text-sm flex items-center gap-2">
                      {m.name}
                      {isWinner && <Trophy className="w-4 h-4 text-emerald-400" />}
                    </div>
                    <div className="text-[10px] text-muted-foreground">
                      Estimate: <span className="font-mono text-foreground">{activeStep?.xnew?.toFixed(6) ?? activeStep?.xr?.toFixed(6) ?? "..."}</span>
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-sm font-mono font-semibold">
                    {activeIterIndex + 1} <span className="text-muted-foreground text-[10px]">/ {iters.length}</span>
                  </div>
                  <div className="text-[10px] text-muted-foreground">
                    |ε|: {(activeStep?.absError || 0).toExponential(2)}
                  </div>
                </div>
              </div>
              
              {/* Progress Bar */}
              <div className="relative h-2 rounded-full bg-white/5 overflow-hidden">
                <motion.div
                  className={`absolute inset-y-0 left-0 bg-gradient-to-r ${m.color}`}
                  initial={{ width: 0 }}
                  animate={{ width: `${progressPct}%` }}
                  transition={{ ease: "linear", duration: speed / 1000 }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
