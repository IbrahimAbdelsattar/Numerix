import { useRef } from "react";
import { MathKeyboard } from "../MathKeyboard";
import { ExampleLoader } from "../ExampleLoader";
import { tryCompile, numDerivative } from "@/lib/numerical/mathEngine";
import { AlertCircle, CheckCircle2 } from "lucide-react";

interface Props {
  params: Record<string, any>;
  onChange: (p: Record<string, any>) => void;
}

export function FixedPointForm({ params, onChange }: Props) {
  const { gx = "", x0 = "", tol = 1e-6, maxIter = 100 } = params;
  const gValid = gx ? tryCompile(gx) !== null : null;
  const gxRef = useRef<HTMLInputElement>(null);

  let convergenceOk: boolean | null = null;
  let derivVal: number | null = null;
  if (gValid && gx && x0 !== "") {
    try {
      const g = tryCompile(gx)!;
      derivVal = numDerivative(g, Number(x0));
      convergenceOk = Math.abs(derivVal) < 1;
    } catch { convergenceOk = null; }
  }

  return (
    <div className="space-y-4">
      <ExampleLoader methodId="fixed-point" onLoad={onChange} />
      <div className="space-y-1.5">
        <label className="text-xs font-medium text-muted-foreground">g(x) where x = g(x)</label>
        <div className="flex gap-2">
          <div className="relative flex-1">
            <input ref={gxRef} value={gx} onChange={e => onChange({ gx: e.target.value })}
              placeholder="e.g. cos(x)"
              className="w-full px-3 py-2 rounded-lg bg-white/[0.04] border border-white/10 text-sm font-mono focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/30" />
            {gValid !== null && (
              <div className="absolute right-2 top-1/2 -translate-y-1/2">
                {gValid ? <CheckCircle2 className="w-4 h-4 text-emerald-500" /> : <AlertCircle className="w-4 h-4 text-red-500" />}
              </div>
            )}
          </div>
          <MathKeyboard onInsert={(t) => {
            if (gxRef.current) {
              const el = gxRef.current;
              const s = el.selectionStart ?? el.value.length;
              onChange({ gx: el.value.slice(0, s) + t + el.value.slice(s) });
            }
          }} />
        </div>
      </div>
      <div className="space-y-1.5">
        <label className="text-xs font-medium text-muted-foreground">x₀ (initial guess)</label>
        <input type="number" value={x0} onChange={e => onChange({ x0: e.target.value === "" ? "" : Number(e.target.value) })}
          className="w-full px-3 py-2 rounded-lg bg-white/[0.04] border border-white/10 text-sm font-mono focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/30" />
      </div>
      {convergenceOk !== null && (
        <div className={`flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-medium ${convergenceOk ? "bg-emerald-500/10 border border-emerald-500/30 text-emerald-400" : "bg-amber-500/10 border border-amber-500/30 text-amber-400"}`}>
          {convergenceOk
            ? <><CheckCircle2 className="w-3.5 h-3.5" /> |g'(x₀)| = {Math.abs(derivVal!).toFixed(4)} &lt; 1 ✓</>
            : <><AlertCircle className="w-3.5 h-3.5" /> |g'(x₀)| = {Math.abs(derivVal!).toFixed(4)} ≥ 1 — may diverge</>}
        </div>
      )}
      <div className="grid grid-cols-2 gap-3">
        <div className="space-y-1.5">
          <label className="text-xs font-medium text-muted-foreground">Tolerance ε</label>
          <select value={tol} onChange={e => onChange({ tol: Number(e.target.value) })}
            className="w-full px-3 py-2 rounded-lg bg-white/[0.04] border border-white/10 text-sm focus:outline-none focus:border-primary">
            <option value={1e-4}>10⁻⁴</option><option value={1e-6}>10⁻⁶</option><option value={1e-8}>10⁻⁸</option>
          </select>
        </div>
        <div className="space-y-1.5">
          <label className="text-xs font-medium text-muted-foreground">Max Iterations</label>
          <input type="number" value={maxIter} onChange={e => onChange({ maxIter: Number(e.target.value) })} min={1} max={1000}
            className="w-full px-3 py-2 rounded-lg bg-white/[0.04] border border-white/10 text-sm font-mono focus:outline-none focus:border-primary" />
        </div>
      </div>
    </div>
  );
}
