import { motion } from "framer-motion";
import { Copy, Download } from "lucide-react";
import { toast } from "sonner";
import type { SolverResult } from "../hooks/useSolver";

interface Props { result: SolverResult; }

export function IterationTable({ result }: Props) {
  if (result.kind === "root") return <RootTable data={result.data} />;
  return <LinearTable data={result.data} />;
}

function RootTable({ data }: { data: any }) {
  const iters = data.iterations;
  if (iters.length === 0) return <div className="text-center text-muted-foreground py-8">No iterations.</div>;

  // Determine columns based on first iteration
  const first = iters[0];
  const isBracket = "xl" in first;
  const isNewton = "fxold" in first;
  const isSecant = "fx0" in first;
  const isFixed = "gx" in first;

  const cols = isBracket
    ? ["n", "xl", "xu", "xr", "f(xl)", "f(xu)", "f(xr)", "|εₐ|", "|εᵣ|", "Decision"]
    : isNewton
    ? ["n", "xₙ", "f(xₙ)", "f'(xₙ)", "xₙ₊₁", "|εₐ|", "|εᵣ|"]
    : isSecant
    ? ["n", "x₀", "x₁", "f(x₀)", "f(x₁)", "xₙ₊₁", "|εₐ|", "|εᵣ|"]
    : ["n", "xₙ", "g(x)", "xₙ₊₁", "|εₐ|", "|εᵣ|"];

  const getRow = (it: any): string[] => {
    const fmt = (v: number) => v < 1e-10 && v !== 0 ? v.toExponential(3) : v.toFixed(6);
    if (isBracket) return [it.n, it.xl, it.xu, it.xr, it.fxl, it.fxu, it.fxr, fmt(it.absError), fmt(it.relError), it.decision || ""].map(String);
    if (isNewton) return [it.n, it.xold, it.fxold, it.dfxold, it.xnew, fmt(it.absError), fmt(it.relError)].map(String);
    if (isSecant) return [it.n, it.x0, it.x1, it.fx0, it.fx1, it.xnew, fmt(it.absError), fmt(it.relError)].map(String);
    return [it.n, it.xold, it.gx, it.xnew, fmt(it.absError), fmt(it.relError)].map(String);
  };

  const errorColor = (err: number) => {
    if (err < 1e-8) return "text-emerald-400";
    if (err < 1e-4) return "text-green-400";
    if (err < 1e-2) return "text-yellow-400";
    if (err < 1) return "text-orange-400";
    return "text-red-400";
  };

  const csvData = [cols.join(","), ...iters.map((it: any) => getRow(it).join(","))].join("\n");

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-3">
      <div className="flex gap-2 justify-end">
        <button onClick={() => { navigator.clipboard.writeText(csvData); toast.success("Copied to clipboard"); }}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-white/10 text-xs text-muted-foreground hover:text-foreground hover:bg-white/[0.04] transition">
          <Copy className="w-3 h-3" /> Copy
        </button>
        <button onClick={() => {
          const blob = new Blob([csvData], { type: "text/csv" });
          const url = URL.createObjectURL(blob);
          const a = document.createElement("a"); a.href = url; a.download = `numerix_${data.method}.csv`; a.click();
          URL.revokeObjectURL(url);
        }}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-white/10 text-xs text-muted-foreground hover:text-foreground hover:bg-white/[0.04] transition">
          <Download className="w-3 h-3" /> CSV
        </button>
      </div>
      <div className="overflow-x-auto rounded-xl border border-white/10">
        <table className="w-full text-xs">
          <thead>
            <tr className="bg-white/[0.04]">
              {cols.map(c => <th key={c} className="px-3 py-2.5 text-left font-semibold text-muted-foreground whitespace-nowrap">{c}</th>)}
            </tr>
          </thead>
          <tbody>
            {iters.map((it: any, i: number) => {
              const row = getRow(it);
              const isLast = i === iters.length - 1 && data.converged;
              return (
                <tr key={i} className={`border-t border-white/5 hover:bg-white/[0.03] transition ${isLast ? "bg-emerald-500/5 border-l-2 border-l-emerald-500" : i % 2 === 0 ? "bg-white/[0.01]" : ""}`}>
                  {row.map((v, ci) => {
                    const isErrCol = cols[ci]?.startsWith("|ε");
                    return (
                      <td key={ci} className={`px-3 py-2 font-mono whitespace-nowrap ${isErrCol ? errorColor(it.absError) : ""}`}>
                        {v}
                      </td>
                    );
                  })}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </motion.div>
  );
}

function LinearTable({ data }: { data: any }) {
  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-3">
      <div className="overflow-x-auto rounded-xl border border-white/10">
        <table className="w-full text-xs">
          <thead>
            <tr className="bg-white/[0.04]">
              <th className="px-3 py-2.5 text-left font-semibold text-muted-foreground">Step</th>
              <th className="px-3 py-2.5 text-left font-semibold text-muted-foreground">Operation</th>
              <th className="px-3 py-2.5 text-left font-semibold text-muted-foreground">Multiplier</th>
            </tr>
          </thead>
          <tbody>
            {data.steps.map((step: any, i: number) => (
              <tr key={i} className={`border-t border-white/5 hover:bg-white/[0.03] ${i % 2 === 0 ? "bg-white/[0.01]" : ""}`}>
                <td className="px-3 py-2 font-mono">{step.n}</td>
                <td className="px-3 py-2">{step.description}</td>
                <td className="px-3 py-2 font-mono">{step.multiplier ?? "—"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </motion.div>
  );
}
