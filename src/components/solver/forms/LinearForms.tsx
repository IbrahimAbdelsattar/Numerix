import { useState } from "react";
import { MatrixInput } from "./MatrixInput";
import { ExampleLoader } from "../ExampleLoader";
import { determinant } from "@/lib/numerical/linearSystems";

interface Props { params: Record<string, any>; onChange: (p: Record<string, any>) => void; }

function defaultMatrix(n: number): number[][] {
  return Array.from({ length: n }, () => new Array(n + 1).fill(0));
}

export function GaussForm({ params, onChange }: Props) {
  const [size, setSize] = useState(params.matrix?.length || 3);
  const matrix = params.matrix || defaultMatrix(size);
  const pivot = params.pivot !== false;

  return (
    <div className="space-y-4">
      <ExampleLoader methodId="gauss-elimination" onLoad={(p) => { if (p.matrix) setSize(p.matrix.length); onChange(p); }} />
      <MatrixInput matrix={matrix} onChange={m => onChange({ matrix: m })} size={size} onSizeChange={setSize} />
      <div className="flex items-center gap-3">
        <label className="text-xs font-medium text-muted-foreground">Partial Pivoting</label>
        <button type="button" onClick={() => onChange({ pivot: !pivot })}
          className={`relative w-10 h-5 rounded-full transition-colors ${pivot ? "bg-primary" : "bg-white/10"}`}>
          <span className={`absolute top-0.5 w-4 h-4 rounded-full bg-white shadow transition-transform ${pivot ? "left-[22px]" : "left-0.5"}`} />
        </button>
      </div>
    </div>
  );
}

export function LUForm({ params, onChange }: Props) {
  const [size, setSize] = useState(params.matrix?.length || 3);
  const matrix = params.matrix || defaultMatrix(size);
  const luType = params.luType || "doolittle";

  return (
    <div className="space-y-4">
      <ExampleLoader methodId="lu-decomposition" onLoad={(p) => { if (p.matrix) setSize(p.matrix.length); onChange(p); }} />
      <MatrixInput matrix={matrix} onChange={m => onChange({ matrix: m })} size={size} onSizeChange={setSize} />
      <div className="space-y-1.5">
        <label className="text-xs font-medium text-muted-foreground">Decomposition Type</label>
        <div className="flex gap-2">
          {(["doolittle", "crout"] as const).map(t => (
            <button key={t} type="button" onClick={() => onChange({ luType: t })}
              className={`flex-1 px-3 py-2 rounded-lg text-xs font-medium border capitalize transition ${luType === t ? "bg-primary/15 border-primary/40 text-primary" : "bg-white/[0.03] border-white/10 text-muted-foreground"}`}>
              {t}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

export function GaussJordanForm({ params, onChange }: Props) {
  const [size, setSize] = useState(params.matrix?.length || 3);
  const matrix = params.matrix || defaultMatrix(size);

  return (
    <div className="space-y-4">
      <ExampleLoader methodId="gauss-jordan" onLoad={(p) => { if (p.matrix) setSize(p.matrix.length); onChange(p); }} />
      <MatrixInput matrix={matrix} onChange={m => onChange({ matrix: m })} size={size} onSizeChange={setSize} />
    </div>
  );
}

export function CramerForm({ params, onChange }: Props) {
  const [size, setSize] = useState(params.matrix?.length || 3);
  const matrix = params.matrix || defaultMatrix(size);

  // Live determinant display
  let detVal: string | null = null;
  if (matrix.length >= 2) {
    try {
      const A = matrix.map((r: number[]) => r.slice(0, size));
      const d = determinant(A);
      detVal = d.toFixed(4);
    } catch { detVal = null; }
  }

  return (
    <div className="space-y-4">
      <ExampleLoader methodId="cramers-rule" onLoad={(p) => { if (p.matrix) setSize(p.matrix.length); onChange(p); }} />
      <MatrixInput matrix={matrix} onChange={m => onChange({ matrix: m })} size={size} onSizeChange={setSize} />
      {detVal !== null && (
        <div className={`flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-medium ${Number(detVal) !== 0 ? "bg-emerald-500/10 border border-emerald-500/30 text-emerald-400" : "bg-red-500/10 border border-red-500/30 text-red-400"}`}>
          det(A) = {detVal} {Number(detVal) === 0 ? "— no unique solution!" : "≠ 0 ✓"}
        </div>
      )}
    </div>
  );
}
