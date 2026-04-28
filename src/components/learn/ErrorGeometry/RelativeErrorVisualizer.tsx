import { useState } from "react";

export function RelativeErrorVisualizer() {
  const [errorMagnitude, setErrorMagnitude] = useState(2);
  
  const scenarios = [
    { title: "Small Magnitude (Measuring a table)", trueVal: 10, label: "cm" },
    { title: "Large Magnitude (Measuring a highway)", trueVal: 10000, label: "cm" }
  ];

  return (
    <div className="space-y-8">
      <div className="space-y-4">
        <label className="text-xs font-semibold text-muted-foreground block">Set Absolute Error (off by {errorMagnitude} units):</label>
        <input type="range" min={1} max={5} step={0.5} value={errorMagnitude} onChange={e => setErrorMagnitude(Number(e.target.value))} className="w-full" />
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {scenarios.map((s, i) => {
          const approx = s.trueVal + errorMagnitude;
          const absError = Math.abs(s.trueVal - approx);
          const relError = absError / s.trueVal;
          const pctError = relError * 100;
          
          return (
            <div key={i} className="glass p-5 space-y-4 relative overflow-hidden">
              <h4 className="text-sm font-bold text-foreground">{s.title}</h4>
              
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="text-muted-foreground">True: <span className="font-mono text-emerald-400">{s.trueVal} {s.label}</span></div>
                <div className="text-muted-foreground">Approx: <span className="font-mono text-blue-400">{approx} {s.label}</span></div>
              </div>

              <div className="space-y-1">
                <div className="text-[10px] text-muted-foreground">Absolute Error</div>
                <div className="text-sm font-mono text-red-400 font-bold">{absError} {s.label}</div>
              </div>

              <div className="space-y-1">
                <div className="text-[10px] text-muted-foreground">Relative Error = |Abs| / |True|</div>
                <div className={`text-xl font-mono font-bold ${pctError > 10 ? "text-red-500" : pctError > 1 ? "text-amber-500" : "text-emerald-500"}`}>
                  {pctError.toFixed(2)}%
                </div>
              </div>
              
              {/* Visual pie chart representing error percentage */}
              <div className="absolute right-[-20px] bottom-[-20px] w-32 h-32 rounded-full border-4 border-white/5 flex items-center justify-center opacity-30">
                <div className="w-full h-full rounded-full" 
                  style={{ background: `conic-gradient(#ef4444 ${pctError}%, transparent ${pctError}%)` }} />
              </div>
            </div>
          );
        })}
      </div>

      <div className="text-xs text-muted-foreground bg-white/[0.03] p-4 rounded-xl border border-white/10">
        <strong className="text-foreground">Why it matters:</strong> Both measurements are off by exactly the same amount ({errorMagnitude} cm). 
        However, being off by {errorMagnitude} cm when measuring a 10 cm object is a huge mistake ({((errorMagnitude/10)*100).toFixed(1)}% error). 
        Being off by {errorMagnitude} cm when measuring a 10,000 cm highway is completely negligible ({((errorMagnitude/10000)*100).toFixed(3)}% error). 
        Relative error captures this significance!
      </div>
    </div>
  );
}
