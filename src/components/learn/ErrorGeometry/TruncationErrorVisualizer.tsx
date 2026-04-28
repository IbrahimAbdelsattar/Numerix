import { useState } from "react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine } from "recharts";

export function TruncationErrorVisualizer() {
  const [terms, setTerms] = useState(1);
  const [evalX, setEvalX] = useState(2); // evaluate at x = 2
  
  // Taylor series for cos(x) around a=0
  // cos(x) = 1 - x^2/2! + x^4/4! - x^6/6! + ...
  const fact = (n: number): number => n <= 1 ? 1 : n * fact(n - 1);
  
  const approxCos = (x: number, n: number) => {
    let sum = 0;
    for (let i = 0; i < n; i++) {
      const sign = i % 2 === 0 ? 1 : -1;
      sum += sign * (Math.pow(x, 2 * i) / fact(2 * i));
    }
    return sum;
  };

  // Generate plot data
  const data = [];
  for (let x = -5; x <= 5; x += 0.2) {
    data.push({
      x: x.toFixed(1),
      trueCos: Math.cos(x),
      approxCos: approxCos(x, terms)
    });
  }

  const trueVal = Math.cos(evalX);
  const approxVal = approxCos(evalX, terms);
  const truncError = Math.abs(trueVal - approxVal);

  return (
    <div className="space-y-6">
      <div className="grid md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <label className="text-xs font-semibold text-muted-foreground block">Number of Taylor Series Terms (n): {terms}</label>
          <input type="range" min={1} max={10} step={1} value={terms} onChange={e => setTerms(Number(e.target.value))} className="w-full" />
          
          <label className="text-xs font-semibold text-muted-foreground block mt-6">Evaluate at x = {evalX}</label>
          <input type="range" min={-4} max={4} step={0.5} value={evalX} onChange={e => setEvalX(Number(e.target.value))} className="w-full" />
        </div>

        <div className="glass p-4 space-y-3">
          <div className="text-sm font-semibold">Taylor Series for cos(x)</div>
          <div className="font-mono text-xs text-primary/80 h-8">
            {Array.from({ length: terms }).map((_, i) => {
              if (i === 0) return "1";
              const sign = i % 2 === 0 ? "+" : "-";
              return ` ${sign} x^${2*i}/${2*i}!`;
            }).join("")}
          </div>
          
          <div className="grid grid-cols-2 gap-2 mt-4 pt-4 border-t border-white/10">
            <div>
              <div className="text-[10px] text-muted-foreground">True cos({evalX})</div>
              <div className="text-sm font-mono text-emerald-400">{trueVal.toFixed(6)}</div>
            </div>
            <div>
              <div className="text-[10px] text-muted-foreground">Approximate</div>
              <div className="text-sm font-mono text-blue-400">{approxVal.toFixed(6)}</div>
            </div>
          </div>
          <div className="bg-red-500/10 border border-red-500/20 p-2 rounded-lg mt-2">
            <div className="text-[10px] text-red-400/80">Truncation Error |True - Approx|</div>
            <div className="text-sm font-mono font-bold text-red-400">{truncError.toExponential(4)}</div>
          </div>
        </div>
      </div>

      <div className="h-[300px] w-full glass p-4">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
            <XAxis dataKey="x" tick={{ fill: "#94A3B8", fontSize: 10 }} />
            <YAxis domain={[-2, 2]} tick={{ fill: "#94A3B8", fontSize: 10 }} />
            <Tooltip contentStyle={{ background: "rgba(13,21,38,0.95)", border: "1px solid rgba(255,255,255,0.1)" }} />
            <ReferenceLine x={evalX.toFixed(1)} stroke="rgba(239,68,68,0.5)" strokeDasharray="3 3" />
            <Line type="monotone" dataKey="trueCos" name="True cos(x)" stroke="#10B981" strokeWidth={2} dot={false} />
            <Line type="monotone" dataKey="approxCos" name={`Taylor (n=${terms})`} stroke="#3B82F6" strokeWidth={2} dot={false} />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
