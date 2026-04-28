import { useState, useEffect, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { SkipBack, SkipForward, ChevronLeft, ChevronRight, Play, Pause, Gauge } from "lucide-react";
import type { SolverResult } from "../hooks/useSolver";

interface Props { result: SolverResult; }

export function StepPlayback({ result }: Props) {
  const steps = result.kind === "root" ? result.data.iterations : result.data.steps;
  const total = steps.length;
  const [idx, setIdx] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [speed, setSpeed] = useState(1);
  const [dir, setDir] = useState(1); // 1=fwd, -1=back
  const timer = useRef<number | null>(null);

  const go = useCallback((i: number) => {
    setDir(i > idx ? 1 : -1);
    setIdx(Math.max(0, Math.min(total - 1, i)));
  }, [idx, total]);

  useEffect(() => {
    if (playing && total > 0) {
      timer.current = window.setInterval(() => {
        setIdx(prev => {
          if (prev >= total - 1) { setPlaying(false); return prev; }
          setDir(1);
          return prev + 1;
        });
      }, 1200 / speed);
    }
    return () => { if (timer.current) clearInterval(timer.current); };
  }, [playing, speed, total]);

  if (total === 0) {
    return <div className="text-center text-muted-foreground py-12">No iterations to display.</div>;
  }

  const step = steps[idx];

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
      {/* Controls bar */}
      <div className="glass p-3">
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-1">
            <ControlBtn icon={SkipBack} onClick={() => go(0)} disabled={idx === 0} label="First" />
            <ControlBtn icon={ChevronLeft} onClick={() => go(idx - 1)} disabled={idx === 0} label="Prev" />
            <button onClick={() => setPlaying(p => !p)}
              className="w-10 h-10 rounded-xl bg-gradient-primary flex items-center justify-center text-white shadow-glow hover:shadow-glow-lg transition">
              {playing ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 ml-0.5" />}
            </button>
            <ControlBtn icon={ChevronRight} onClick={() => go(idx + 1)} disabled={idx >= total - 1} label="Next" />
            <ControlBtn icon={SkipForward} onClick={() => go(total - 1)} disabled={idx >= total - 1} label="Last" />
          </div>
          <div className="flex items-center gap-2">
            <Gauge className="w-3.5 h-3.5 text-muted-foreground" />
            {[0.5, 1, 2, 4].map(s => (
              <button key={s} onClick={() => setSpeed(s)}
                className={`px-2 py-1 rounded-md text-[10px] font-medium transition ${speed === s ? "bg-primary/20 text-primary" : "text-muted-foreground hover:text-foreground"}`}>
                {s}x
              </button>
            ))}
          </div>
        </div>
        {/* Timeline scrubber */}
        <div className="mt-3 flex items-center gap-3">
          <span className="text-[10px] text-muted-foreground w-12 shrink-0">Step {idx + 1}</span>
          <div className="flex-1 relative h-2 rounded-full bg-white/5">
            <div className="absolute inset-y-0 left-0 rounded-full bg-gradient-primary transition-all" style={{ width: `${((idx + 1) / total) * 100}%` }} />
            <input type="range" min={0} max={total - 1} value={idx} onChange={e => go(Number(e.target.value))}
              className="absolute inset-0 w-full opacity-0 cursor-pointer" />
          </div>
          <span className="text-[10px] text-muted-foreground w-12 shrink-0 text-right">of {total}</span>
        </div>
      </div>

      {/* Step card */}
      <AnimatePresence mode="wait">
        <motion.div
          key={idx}
          initial={{ opacity: 0, x: dir * 40 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: dir * -40 }}
          transition={{ duration: 0.2 }}
        >
          {result.kind === "root" ? <RootStepCard step={step as any} /> : <LinearStepCard step={step as any} />}
        </motion.div>
      </AnimatePresence>
    </motion.div>
  );
}

function ControlBtn({ icon: Icon, onClick, disabled, label }: { icon: any; onClick: () => void; disabled: boolean; label: string }) {
  return (
    <button onClick={onClick} disabled={disabled} title={label}
      className="w-9 h-9 rounded-lg border border-white/10 bg-white/[0.03] flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-white/[0.06] disabled:opacity-30 transition">
      <Icon className="w-4 h-4" />
    </button>
  );
}

function RootStepCard({ step }: { step: any }) {
  return (
    <div className="glow-card p-5 space-y-3">
      <div className="flex items-center gap-2">
        <span className="w-8 h-8 rounded-lg bg-gradient-primary flex items-center justify-center text-white text-xs font-bold">{step.n}</span>
        <span className="text-sm font-semibold">Iteration {step.n}</span>
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
        {step.xl !== undefined && <KV k="xl" v={step.xl} />}
        {step.xu !== undefined && <KV k="xu" v={step.xu} />}
        {step.xr !== undefined && <KV k="xr" v={step.xr} highlight />}
        {step.xold !== undefined && <KV k="xₙ" v={step.xold} />}
        {step.xnew !== undefined && <KV k="xₙ₊₁" v={step.xnew} highlight />}
        {step.fxl !== undefined && <KV k="f(xl)" v={step.fxl} />}
        {step.fxu !== undefined && <KV k="f(xu)" v={step.fxu} />}
        {step.fxr !== undefined && <KV k="f(xr)" v={step.fxr} />}
        {step.fxold !== undefined && <KV k="f(xₙ)" v={step.fxold} />}
        {step.dfxold !== undefined && <KV k="f'(xₙ)" v={step.dfxold} />}
        {step.gx !== undefined && <KV k="g(x)" v={step.gx} />}
        {step.fx0 !== undefined && <KV k="f(x₀)" v={step.fx0} />}
        {step.fx1 !== undefined && <KV k="f(x₁)" v={step.fx1} />}
      </div>
      <div className="grid grid-cols-2 gap-2">
        <KV k="|εₐ|" v={step.absError < 1e-10 ? step.absError.toExponential(2) : step.absError.toFixed(6)} />
        <KV k="|εᵣ|" v={step.relError < 1e-10 ? step.relError.toExponential(2) : step.relError.toFixed(6)} />
      </div>
      {step.decision && (
        <div className="px-3 py-2 rounded-lg bg-primary/[0.06] border border-primary/20 text-xs text-primary/90 font-mono">
          {step.decision}
        </div>
      )}
    </div>
  );
}

function LinearStepCard({ step }: { step: any }) {
  return (
    <div className="glow-card p-5 space-y-3">
      <div className="flex items-center gap-2">
        <span className="w-8 h-8 rounded-lg bg-gradient-primary flex items-center justify-center text-white text-xs font-bold">{step.n}</span>
        <span className="text-sm font-semibold">{step.description}</span>
      </div>
      {step.matrix && (
        <div className="overflow-x-auto">
          <table className="text-xs font-mono">
            <tbody>
              {step.matrix.map((row: number[], ri: number) => (
                <tr key={ri} className={ri === step.pivotRow ? "bg-primary/10" : ri === step.affectedRow ? "bg-red-500/10" : ""}>
                  {row.map((v: number, ci: number) => (
                    <td key={ci} className={`px-2 py-1 border border-white/5 text-center ${ci === row.length - 1 ? "border-l-2 border-l-primary/30" : ""}`}>
                      {v}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      {step.L && step.U && (
        <div className="grid grid-cols-2 gap-3">
          <div>
            <div className="text-[10px] text-muted-foreground mb-1">L matrix</div>
            <MiniMatrix m={step.L} />
          </div>
          <div>
            <div className="text-[10px] text-muted-foreground mb-1">U matrix</div>
            <MiniMatrix m={step.U} />
          </div>
        </div>
      )}
    </div>
  );
}

function MiniMatrix({ m }: { m: number[][] }) {
  return (
    <table className="text-[10px] font-mono">
      <tbody>
        {m.map((row, ri) => (
          <tr key={ri}>
            {row.map((v, ci) => (
              <td key={ci} className="px-1.5 py-0.5 border border-white/5 text-center">{v}</td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
}

function KV({ k, v, highlight }: { k: string; v: any; highlight?: boolean }) {
  return (
    <div className={`px-2.5 py-1.5 rounded-lg ${highlight ? "bg-primary/10 border border-primary/20" : "bg-white/[0.03] border border-white/5"}`}>
      <div className="text-[9px] text-muted-foreground">{k}</div>
      <div className={`text-xs font-mono font-semibold ${highlight ? "text-primary" : ""}`}>
        {typeof v === "number" ? (Math.abs(v) < 1e-10 && v !== 0 ? v.toExponential(3) : v) : v}
      </div>
    </div>
  );
}
