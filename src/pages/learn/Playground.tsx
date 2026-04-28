import { useState, useMemo } from "react";
import { PageShell } from "@/components/layout/PageShell";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine } from "recharts";
import { tryCompile } from "@/lib/numerical/mathEngine";
import { Calculator, AlertTriangle } from "lucide-react";

export default function Playground() {
  const [fx, setFx] = useState("a * x^2 + b * x + c");
  const [a, setA] = useState(1);
  const [b, setB] = useState(-3);
  const [c, setC] = useState(2);
  const [zoom, setZoom] = useState(5); // +/- range

  const compiled = useMemo(() => tryCompile(fx), [fx]);

  const data = useMemo(() => {
    if (!compiled) return [];
    const pts = [];
    try {
      for (let x = -zoom; x <= zoom; x += zoom / 50) {
        // We inject a, b, c into the scope manually since math.js compileFn in the engine only expects x
        // For a true playground, we'd use a full math.js context, but we can fake it by string replacement for this demo
        const exprWithVars = fx
          .replace(/a/g, `(${a})`)
          .replace(/b/g, `(${b})`)
          .replace(/c/g, `(${c})`);
        
        const f = tryCompile(exprWithVars);
        if (f) pts.push({ x: Number(x.toFixed(2)), y: f(x) });
      }
    } catch (e) {
      // ignore
    }
    return pts;
  }, [fx, compiled, a, b, c, zoom]);

  // Very basic root finding for visualization overlay
  const roots = useMemo(() => {
    const rts = [];
    for (let i = 1; i < data.length; i++) {
      if (data[i - 1].y * data[i].y <= 0) {
        // Crossing x-axis
        rts.push(data[i].x);
      }
    }
    return rts;
  }, [data]);

  return (
    <PageShell>
      <div className="container py-10 max-w-6xl space-y-8">
        <div className="flex items-center gap-4 border-b border-white/10 pb-6">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-cyan-500 to-blue-500 flex items-center justify-center shadow-glow">
            <Calculator className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold gradient-text">Equation Playground</h1>
            <p className="text-sm text-muted-foreground mt-1">Experiment with polynomials and visualize roots in real-time.</p>
          </div>
        </div>

        <div className="grid lg:grid-cols-[300px_1fr] gap-8">
          {/* Controls */}
          <div className="space-y-6">
            <div className="space-y-3">
              <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Function</label>
              <input value={fx} onChange={e => setFx(e.target.value)}
                className="w-full px-3 py-2 rounded-lg bg-white/[0.04] border border-white/10 font-mono focus:border-primary focus:outline-none" />
              {!compiled && (
                <div className="text-xs text-red-400 flex items-center gap-1"><AlertTriangle className="w-3 h-3" /> Invalid expression</div>
              )}
            </div>

            <div className="space-y-4">
              <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Coefficients</label>
              
              <div className="space-y-2">
                <div className="flex justify-between text-xs font-mono"><span>a</span><span>{a}</span></div>
                <input type="range" min={-10} max={10} step={0.1} value={a} onChange={e => setA(Number(e.target.value))} className="w-full" />
              </div>
              <div className="space-y-2">
                <div className="flex justify-between text-xs font-mono"><span>b</span><span>{b}</span></div>
                <input type="range" min={-10} max={10} step={0.1} value={b} onChange={e => setB(Number(e.target.value))} className="w-full" />
              </div>
              <div className="space-y-2">
                <div className="flex justify-between text-xs font-mono"><span>c</span><span>{c}</span></div>
                <input type="range" min={-10} max={10} step={0.1} value={c} onChange={e => setC(Number(e.target.value))} className="w-full" />
              </div>
            </div>

            <div className="space-y-3">
              <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Zoom Range</label>
              <input type="range" min={1} max={20} step={1} value={zoom} onChange={e => setZoom(Number(e.target.value))} className="w-full" />
              <div className="text-center text-xs text-muted-foreground">[-{zoom}, {zoom}]</div>
            </div>

            {roots.length > 0 && (
              <div className="glass p-4">
                <div className="text-xs font-semibold text-muted-foreground mb-2">Detected Roots in Range:</div>
                <div className="flex flex-wrap gap-2">
                  {roots.map((r, i) => (
                    <span key={i} className="px-2 py-1 bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 rounded-md text-xs font-mono">
                      x ≈ {r}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Graph */}
          <div className="glass h-[500px] p-2 relative">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={data}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                <XAxis dataKey="x" type="number" domain={[-zoom, zoom]} tick={{ fill: "#94A3B8", fontSize: 10 }} />
                <YAxis domain={[-zoom * 2, zoom * 2]} tick={{ fill: "#94A3B8", fontSize: 10 }} />
                <Tooltip contentStyle={{ background: "rgba(13,21,38,0.95)", border: "1px solid rgba(255,255,255,0.1)" }} />
                <ReferenceLine x={0} stroke="rgba(255,255,255,0.2)" />
                <ReferenceLine y={0} stroke="rgba(255,255,255,0.2)" />
                <Line type="monotone" dataKey="y" stroke="#06B6D4" strokeWidth={2} dot={false} isAnimationActive={false} />
                
                {roots.map((r, i) => (
                  <ReferenceLine key={i} x={r} stroke="rgba(16,185,129,0.5)" strokeDasharray="3 3" />
                ))}
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </PageShell>
  );
}
