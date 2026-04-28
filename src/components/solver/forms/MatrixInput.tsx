import { Plus, Minus } from "lucide-react";

interface Props {
  matrix: number[][];
  onChange: (m: number[][]) => void;
  size: number;
  onSizeChange: (n: number) => void;
}

export function MatrixInput({ matrix, onChange, size, onSizeChange }: Props) {
  const setSize = (n: number) => {
    if (n < 2 || n > 6) return;
    const m: number[][] = [];
    for (let i = 0; i < n; i++) {
      const row: number[] = [];
      for (let j = 0; j <= n; j++) {
        row.push(matrix[i]?.[j] ?? 0);
      }
      m.push(row);
    }
    onSizeChange(n);
    onChange(m);
  };

  const setCell = (r: number, c: number, val: number) => {
    const m = matrix.map(row => [...row]);
    m[r][c] = val;
    onChange(m);
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-3">
        <label className="text-xs font-medium text-muted-foreground">Matrix size: {size}×{size}</label>
        <div className="flex items-center gap-1">
          <button type="button" onClick={() => setSize(size - 1)} disabled={size <= 2}
            className="w-7 h-7 rounded-md border border-white/10 bg-white/[0.03] flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-white/[0.06] disabled:opacity-30 transition">
            <Minus className="w-3 h-3" />
          </button>
          <button type="button" onClick={() => setSize(size + 1)} disabled={size >= 6}
            className="w-7 h-7 rounded-md border border-white/10 bg-white/[0.03] flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-white/[0.06] disabled:opacity-30 transition">
            <Plus className="w-3 h-3" />
          </button>
        </div>
      </div>

      <div className="overflow-x-auto">
        <div className="inline-block">
          {/* Column headers */}
          <div className="flex gap-1 mb-1 ml-8">
            {Array.from({ length: size }, (_, j) => (
              <div key={j} className="w-16 text-center text-[10px] font-medium text-muted-foreground">
                {j < size ? `x${j + 1}` : ""}
              </div>
            ))}
            <div className="w-1" />
            <div className="w-16 text-center text-[10px] font-medium text-primary">b</div>
          </div>
          {/* Matrix rows */}
          {Array.from({ length: size }, (_, i) => (
            <div key={i} className="flex items-center gap-1 mb-1">
              <div className="w-7 text-right text-[10px] font-medium text-muted-foreground mr-1">R{i + 1}</div>
              <div className="flex items-center gap-1">
                <span className="text-muted-foreground text-lg font-light">[</span>
                {Array.from({ length: size }, (_, j) => (
                  <input key={j} type="number" value={matrix[i]?.[j] ?? 0}
                    onChange={e => setCell(i, j, Number(e.target.value) || 0)}
                    className="w-16 px-1.5 py-1.5 rounded-md bg-white/[0.04] border border-white/10 text-xs font-mono text-center focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/30" />
                ))}
                <span className="text-muted-foreground text-lg font-light">|</span>
                <input type="number" value={matrix[i]?.[size] ?? 0}
                  onChange={e => setCell(i, size, Number(e.target.value) || 0)}
                  className="w-16 px-1.5 py-1.5 rounded-md bg-primary/[0.06] border border-primary/20 text-xs font-mono text-center focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/30" />
                <span className="text-muted-foreground text-lg font-light">]</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
