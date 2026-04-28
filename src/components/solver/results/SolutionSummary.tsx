import { motion } from "framer-motion";
import { CheckCircle2, XCircle, AlertTriangle, Target } from "lucide-react";
import type { SolverResult } from "../hooks/useSolver";
import type { RootResult, LinearResult } from "@/lib/numerical/types";

interface Props { result: SolverResult; }

export function SolutionSummary({ result }: Props) {
  if (result.kind === "root") return <RootSummary data={result.data} />;
  return <LinearSummary data={result.data} />;
}

function RootSummary({ data }: { data: RootResult }) {
  const statusConfig = {
    converged: { icon: CheckCircle2, color: "text-emerald-400", bg: "bg-emerald-500/10 border-emerald-500/30", label: "Converged" },
    diverged: { icon: XCircle, color: "text-red-400", bg: "bg-red-500/10 border-red-500/30", label: "Diverged" },
    "max-iter": { icon: AlertTriangle, color: "text-amber-400", bg: "bg-amber-500/10 border-amber-500/30", label: "Max iterations reached" },
    error: { icon: XCircle, color: "text-red-400", bg: "bg-red-500/10 border-red-500/30", label: data.errorMessage || "Error" },
  };
  const s = statusConfig[data.status];
  const Icon = s.icon;

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
      {/* Status badge */}
      <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium border ${s.bg} ${s.color}`}>
        <Icon className="w-3.5 h-3.5" /> {s.label}
      </div>

      {/* Main result card */}
      {data.root !== null && (
        <div className="glow-card p-6">
          <div className="text-xs text-muted-foreground mb-1">Root</div>
          <div className="text-3xl font-bold font-mono gradient-text">{data.root.toFixed(8)}</div>
          <div className="mt-2 text-xs text-muted-foreground">
            f(root) ≈ {data.iterations.length > 0 ? (("fxr" in data.iterations[data.iterations.length - 1]) ? (data.iterations[data.iterations.length - 1] as any).fxr : "—") : "—"}
          </div>
        </div>
      )}

      {/* KPI grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { label: "Method", value: data.method },
          { label: "Iterations", value: data.totalIterations.toString() },
          { label: "|εₐ|", value: data.finalAbsError < 1e-10 ? data.finalAbsError.toExponential(2) : data.finalAbsError.toFixed(6) },
          { label: "|εᵣ|", value: data.finalRelError < 1e-10 ? data.finalRelError.toExponential(2) : data.finalRelError.toFixed(6) },
        ].map(kpi => (
          <div key={kpi.label} className="glass p-3">
            <div className="text-[10px] text-muted-foreground">{kpi.label}</div>
            <div className="text-sm font-semibold font-mono mt-0.5">{kpi.value}</div>
          </div>
        ))}
      </div>
    </motion.div>
  );
}

function LinearSummary({ data }: { data: LinearResult }) {
  const isErr = data.status === "error";
  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
      <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium border ${isErr ? "bg-red-500/10 border-red-500/30 text-red-400" : "bg-emerald-500/10 border-emerald-500/30 text-emerald-400"}`}>
        {isErr ? <><XCircle className="w-3.5 h-3.5" /> {data.errorMessage}</> : <><CheckCircle2 className="w-3.5 h-3.5" /> Solution found</>}
      </div>
      {data.solution && (
        <div className="glow-card p-6">
          <div className="text-xs text-muted-foreground mb-3">Solution Vector</div>
          <div className="flex flex-wrap gap-3">
            {data.solution.map((v, i) => (
              <div key={i} className="glass px-4 py-3 text-center">
                <div className="text-[10px] text-muted-foreground">x{i + 1}</div>
                <div className="text-lg font-bold font-mono gradient-text">{v.toFixed(6)}</div>
              </div>
            ))}
          </div>
        </div>
      )}
      <div className="grid grid-cols-2 gap-3">
        <div className="glass p-3">
          <div className="text-[10px] text-muted-foreground">Method</div>
          <div className="text-sm font-semibold mt-0.5">{data.method}</div>
        </div>
        <div className="glass p-3">
          <div className="text-[10px] text-muted-foreground">Steps</div>
          <div className="text-sm font-semibold font-mono mt-0.5">{data.steps.length}</div>
        </div>
      </div>
    </motion.div>
  );
}
