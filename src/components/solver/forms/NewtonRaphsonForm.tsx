import { useRef, useState } from "react";
import { MathKeyboard } from "../MathKeyboard";
import { ExampleLoader } from "../ExampleLoader";
import { tryCompile, deriveExpr } from "@/lib/numerical/mathEngine";
import { AlertCircle, CheckCircle2, Wand2 } from "lucide-react";

interface Props { params: Record<string, any>; onChange: (p: Record<string, any>) => void; }

export function NewtonRaphsonForm({ params, onChange }: Props) {
  const { fx = "", dfx = "", x0 = "", tol = 1e-6, maxIter = 100, stop = "rel", autoDerive = true } = params;
  const fValid = fx ? tryCompile(fx) !== null : null;
  const fxRef = useRef<HTMLInputElement>(null);

  let derivedExpr = "";
  if (autoDerive && fValid && fx) {
    try { derivedExpr = deriveExpr(fx); } catch { derivedExpr = ""; }
  }

  return (
    <div className="space-y-4">
      <ExampleLoader methodId="newton-raphson" onLoad={onChange} />
      <div className="space-y-1.5">
        <label className="text-xs font-medium text-muted-foreground">f(x)</label>
        <div className="flex gap-2">
          <div className="relative flex-1">
            <input ref={fxRef} value={fx} onChange={e => onChange({ fx: e.target.value })} placeholder="e.g. x^3 - x - 1"
              className="w-full px-3 py-2 rounded-lg bg-white/[0.04] border border-white/10 text-sm font-mono focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/30" />
            {fValid !== null && (
              <div className="absolute right-2 top-1/2 -translate-y-1/2">
                {fValid ? <CheckCircle2 className="w-4 h-4 text-emerald-500" /> : <AlertCircle className="w-4 h-4 text-red-500" />}
              </div>
            )}
          </div>
          <MathKeyboard onInsert={(t) => { if (fxRef.current) { const el = fxRef.current; const s = el.selectionStart ?? el.value.length; onChange({ fx: el.value.slice(0, s) + t + el.value.slice(s) }); }}} />
        </div>
      </div>

      <div className="space-y-1.5">
        <div className="flex items-center justify-between">
          <label className="text-xs font-medium text-muted-foreground">f'(x)</label>
          <button type="button" onClick={() => onChange({ autoDerive: !autoDerive })}
            className={`flex items-center gap-1 px-2 py-1 rounded-md text-[10px] font-medium border transition ${autoDerive ? "bg-primary/15 border-primary/40 text-primary" : "border-white/10 text-muted-foreground"}`}>
            <Wand2 className="w-3 h-3" /> Auto-differentiate
          </button>
        </div>
        {autoDerive ? (
          <div className="px-3 py-2 rounded-lg bg-white/[0.04] border border-white/10 text-sm font-mono text-muted-foreground">
            {derivedExpr || "Enter a valid f(x) above"}
          </div>
        ) : (
          <input value={dfx} onChange={e => onChange({ dfx: e.target.value })} placeholder="e.g. 3*x^2 - 1"
            className="w-full px-3 py-2 rounded-lg bg-white/[0.04] border border-white/10 text-sm font-mono focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/30" />
        )}
      </div>

      <div className="space-y-1.5">
        <label className="text-xs font-medium text-muted-foreground">x₀ (initial guess)</label>
        <input type="number" value={x0} onChange={e => onChange({ x0: e.target.value === "" ? "" : Number(e.target.value) })}
          className="w-full px-3 py-2 rounded-lg bg-white/[0.04] border border-white/10 text-sm font-mono focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/30" />
      </div>

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

      <div className="space-y-1.5">
        <label className="text-xs font-medium text-muted-foreground">Stopping Criterion</label>
        <div className="flex gap-2">
          {[{ val: "f", label: "|f(xr)| < ε" }, { val: "rel", label: "|(xₙ−xₙ₋₁)/xₙ| < ε" }].map(opt => (
            <button key={opt.val} type="button" onClick={() => onChange({ stop: opt.val })}
              className={`flex-1 px-3 py-2 rounded-lg text-xs font-medium border transition ${stop === opt.val ? "bg-primary/15 border-primary/40 text-primary" : "bg-white/[0.03] border-white/10 text-muted-foreground"}`}>
              {opt.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
