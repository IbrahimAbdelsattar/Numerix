import { useState } from "react";
import { motion } from "framer-motion";

export function AbsoluteErrorVisualizer() {
  const trueValue = 10;
  const [approx, setApprox] = useState(8.5);
  
  const error = Math.abs(trueValue - approx);
  const min = 5;
  const max = 15;
  
  // Calculate positions (percentages)
  const truePct = ((trueValue - min) / (max - min)) * 100;
  const approxPct = ((approx - min) / (max - min)) * 100;
  
  const leftPct = Math.min(truePct, approxPct);
  const widthPct = Math.abs(truePct - approxPct);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between text-sm">
        <span className="text-muted-foreground">True Value: <span className="font-mono text-emerald-400 font-bold">{trueValue.toFixed(2)}</span></span>
        <span className="text-muted-foreground">Approx Value: <span className="font-mono text-blue-400 font-bold">{approx.toFixed(2)}</span></span>
      </div>

      <div className="relative pt-6 pb-8">
        {/* Number line */}
        <div className="absolute top-1/2 left-0 right-0 h-1 bg-white/10 rounded-full -translate-y-1/2" />
        
        {/* Ticks */}
        {Array.from({ length: 11 }, (_, i) => min + i).map(tick => (
          <div key={tick} className="absolute top-1/2 w-0.5 h-3 bg-white/20 -translate-y-1/2 -translate-x-1/2"
            style={{ left: `${((tick - min) / (max - min)) * 100}%` }}>
            <span className="absolute top-full left-1/2 -translate-x-1/2 mt-2 text-[10px] text-muted-foreground">{tick}</span>
          </div>
        ))}

        {/* Error interval */}
        <div className="absolute top-1/2 h-2 bg-red-500/30 rounded-full -translate-y-1/2 transition-all"
          style={{ left: `${leftPct}%`, width: `${widthPct}%` }} />
        
        {/* True marker */}
        <div className="absolute top-1/2 w-4 h-4 bg-emerald-500 rounded-full -translate-y-1/2 -translate-x-1/2 shadow-[0_0_10px_#10B981]"
          style={{ left: `${truePct}%` }} />
        
        {/* Approx marker */}
        <div className="absolute top-1/2 w-4 h-4 bg-blue-500 rounded-full -translate-y-1/2 -translate-x-1/2 shadow-[0_0_10px_#3B82F6]"
          style={{ left: `${approxPct}%` }} />
      </div>

      <div>
        <input type="range" min={min} max={max} step={0.1} value={approx} onChange={e => setApprox(Number(e.target.value))}
          className="w-full" />
      </div>

      <div className="glass p-4 rounded-xl text-center">
        <div className="text-sm text-muted-foreground mb-2">Absolute Error = |True - Approx|</div>
        <div className="text-2xl font-bold font-mono text-red-400">|{trueValue.toFixed(2)} - {approx.toFixed(2)}| = {error.toFixed(2)}</div>
        <p className="text-xs text-muted-foreground mt-2">
          Absolute error measures the raw distance on the number line between the true value and the approximation.
        </p>
      </div>
    </div>
  );
}
