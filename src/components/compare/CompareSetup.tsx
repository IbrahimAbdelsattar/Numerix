import { METHODS } from "@/lib/numerical/methods";
import type { CompareParams } from "./useCompare";
import { MathKeyboard } from "../solver/MathKeyboard";
import { Check } from "lucide-react";

interface Props {
  params: CompareParams;
  onChange: (p: Partial<CompareParams>) => void;
  selectedMethods: string[];
  onToggleMethod: (id: any) => void;
}

export function CompareSetup({ params, onChange, selectedMethods, onToggleMethod }: Props) {
  const rootMethods = METHODS.filter(m => m.category === "root-finding");

  return (
    <div className="space-y-6">
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Equations */}
        <div className="space-y-4">
          <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">1. Define Equations</label>
          <div className="space-y-3">
            <div>
              <label className="text-[10px] text-muted-foreground mb-1 block">Main Function f(x)</label>
              <div className="flex gap-2">
                <input value={params.fx} onChange={e => onChange({ fx: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg bg-white/[0.04] border border-white/10 text-sm font-mono focus:outline-none focus:border-primary" />
              </div>
            </div>
            {selectedMethods.includes("fixed-point") && (
              <div>
                <label className="text-[10px] text-muted-foreground mb-1 block">Fixed Point Form g(x)</label>
                <div className="flex gap-2">
                  <input value={params.gx} onChange={e => onChange({ gx: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg bg-white/[0.04] border border-white/10 text-sm font-mono focus:outline-none focus:border-primary" />
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Parameters */}
        <div className="space-y-4">
          <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">2. Set Parameters</label>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div>
              <label className="text-[10px] text-muted-foreground mb-1 block">x<sub>l</sub></label>
              <input type="number" value={params.xl} onChange={e => onChange({ xl: e.target.value === "" ? "" : Number(e.target.value) })}
                className="w-full px-2 py-1.5 rounded-lg bg-white/[0.04] border border-white/10 text-sm font-mono focus:outline-none focus:border-primary" />
            </div>
            <div>
              <label className="text-[10px] text-muted-foreground mb-1 block">x<sub>u</sub></label>
              <input type="number" value={params.xu} onChange={e => onChange({ xu: e.target.value === "" ? "" : Number(e.target.value) })}
                className="w-full px-2 py-1.5 rounded-lg bg-white/[0.04] border border-white/10 text-sm font-mono focus:outline-none focus:border-primary" />
            </div>
            <div>
              <label className="text-[10px] text-muted-foreground mb-1 block">x₀</label>
              <input type="number" value={params.x0} onChange={e => onChange({ x0: e.target.value === "" ? "" : Number(e.target.value) })}
                className="w-full px-2 py-1.5 rounded-lg bg-white/[0.04] border border-white/10 text-sm font-mono focus:outline-none focus:border-primary" />
            </div>
            <div>
              <label className="text-[10px] text-muted-foreground mb-1 block">x₁</label>
              <input type="number" value={params.x1} onChange={e => onChange({ x1: e.target.value === "" ? "" : Number(e.target.value) })}
                className="w-full px-2 py-1.5 rounded-lg bg-white/[0.04] border border-white/10 text-sm font-mono focus:outline-none focus:border-primary" />
            </div>
            <div className="col-span-2">
              <label className="text-[10px] text-muted-foreground mb-1 block">Tolerance ε</label>
              <select value={params.tol} onChange={e => onChange({ tol: Number(e.target.value) })}
                className="w-full px-2 py-1.5 rounded-lg bg-white/[0.04] border border-white/10 text-sm focus:outline-none focus:border-primary">
                <option value={1e-4}>10⁻⁴</option><option value={1e-6}>10⁻⁶</option><option value={1e-8}>10⁻⁸</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Methods Select */}
      <div className="space-y-3">
        <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">3. Select Competitors</label>
        <div className="flex flex-wrap gap-2">
          {rootMethods.map(m => {
            const active = selectedMethods.includes(m.id);
            return (
              <button key={m.id} onClick={() => onToggleMethod(m.id)}
                className={`flex items-center gap-2 px-3 py-2 rounded-xl border text-sm transition-all ${
                  active ? "bg-primary/10 border-primary/40 text-primary" : "bg-white/[0.03] border-white/10 text-muted-foreground hover:bg-white/[0.06] hover:text-foreground"
                }`}>
                <div className={`w-4 h-4 rounded-md border flex items-center justify-center ${active ? "bg-primary border-primary text-white" : "border-white/20"}`}>
                  {active && <Check className="w-3 h-3" />}
                </div>
                {m.name}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
