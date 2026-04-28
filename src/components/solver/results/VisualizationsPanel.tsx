import { useState } from "react";
import { motion } from "framer-motion";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Area, AreaChart, ReferenceLine } from "recharts";
import type { SolverResult } from "../hooks/useSolver";
import { compileFn } from "@/lib/numerical/mathEngine";
import { Convergence3D } from "./Convergence3D";

interface Props { result: SolverResult; }

export function VisualizationsPanel({ result }: Props) {
  const [sub, setSub] = useState<"func" | "error" | "trajectory" | "3d">("func");

  if (result.kind !== "root") {
    return (
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center text-muted-foreground py-12">
        Visualizations are available for root-finding methods.
      </motion.div>
    );
  }

  const tabs = [
    { id: "func" as const, label: "Function Graph" },
    { id: "error" as const, label: "Error Convergence" },
    { id: "trajectory" as const, label: "Root Trajectory" },
    { id: "3d" as const, label: "3D Convergence" },
  ];

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
      <div className="flex gap-1 p-1 rounded-xl bg-white/[0.03] border border-white/10">
        {tabs.map(t => (
          <button key={t.id} onClick={() => setSub(t.id)}
            className={`flex-1 px-3 py-1.5 rounded-lg text-xs font-medium transition ${sub === t.id ? "bg-primary/15 text-primary" : "text-muted-foreground hover:text-foreground"}`}>
            {t.label}
          </button>
        ))}
      </div>
      {sub === "func" && <FunctionGraph result={result} />}
      {sub === "error" && <ErrorConvergenceChart result={result} />}
      {sub === "trajectory" && <RootTrajectoryChart result={result} />}
      {sub === "3d" && <Convergence3D result={result} />}
    </motion.div>
  );
}

function FunctionGraph({ result }: { result: SolverResult }) {
  if (result.kind !== "root") return null;
  const data = result.data;
  const iters = data.iterations;

  // Try to get the f(x) expression from the method name or params
  let fExpr = "";
  const first = iters[0] as any;
  // Determine range from iteration data
  let xMin = Infinity, xMax = -Infinity;
  for (const it of iters) {
    const vals = [
      (it as any).xl, (it as any).xu, (it as any).xr,
      (it as any).xold, (it as any).xnew,
      (it as any).x0, (it as any).x1,
    ].filter(v => v !== undefined && Number.isFinite(v));
    for (const v of vals) { xMin = Math.min(xMin, v); xMax = Math.max(xMax, v); }
  }
  if (!Number.isFinite(xMin)) { xMin = -5; xMax = 5; }
  const pad = (xMax - xMin) * 0.3 || 1;
  xMin -= pad; xMax += pad;

  // Plot the root location
  const root = data.root;

  // Generate chart data points
  const points: { x: number; y: number }[] = [];
  const N = 200;
  // Use the last iteration fxr to infer we have some function
  // For now, show iteration convergence path instead
  const iterPoints = iters.map((it: any, i: number) => ({
    x: it.xr ?? it.xnew ?? 0,
    iter: it.n,
    fx: it.fxr ?? it.fxold ?? 0,
  }));

  return (
    <div className="glass p-4">
      <p className="text-[10px] text-muted-foreground mb-3">Root approximations plotted against f(x) values</p>
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={iterPoints}>
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
          <XAxis dataKey="iter" label={{ value: "Iteration", position: "bottom", style: { fill: "#94A3B8", fontSize: 10 } }}
            tick={{ fill: "#94A3B8", fontSize: 10 }} stroke="rgba(255,255,255,0.1)" />
          <YAxis tick={{ fill: "#94A3B8", fontSize: 10 }} stroke="rgba(255,255,255,0.1)"
            label={{ value: "f(xr)", angle: -90, position: "insideLeft", style: { fill: "#94A3B8", fontSize: 10 } }} />
          <Tooltip contentStyle={{ background: "rgba(13,21,38,0.95)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 8, fontSize: 11 }} />
          <ReferenceLine y={0} stroke="rgba(59,130,246,0.5)" strokeDasharray="5 3" />
          <Line type="monotone" dataKey="fx" stroke="#3B82F6" strokeWidth={2} dot={{ r: 3, fill: "#3B82F6" }} activeDot={{ r: 5 }} />
          <Line type="monotone" dataKey="x" stroke="#8B5CF6" strokeWidth={2} dot={{ r: 3, fill: "#8B5CF6" }} activeDot={{ r: 5 }} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}

function ErrorConvergenceChart({ result }: { result: SolverResult }) {
  if (result.kind !== "root") return null;
  const iters = result.data.iterations;
  const data = iters.map((it: any) => ({
    n: it.n,
    absError: Math.max(it.absError, 1e-16),
    relError: Math.max(it.relError, 1e-16),
  }));

  return (
    <div className="glass p-4">
      <p className="text-[10px] text-muted-foreground mb-3">Error magnitude (log scale) vs iteration</p>
      <ResponsiveContainer width="100%" height={300}>
        <AreaChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
          <XAxis dataKey="n" tick={{ fill: "#94A3B8", fontSize: 10 }} stroke="rgba(255,255,255,0.1)" />
          <YAxis scale="log" domain={["auto", "auto"]} tick={{ fill: "#94A3B8", fontSize: 10 }} stroke="rgba(255,255,255,0.1)"
            tickFormatter={(v: number) => v.toExponential(0)} />
          <Tooltip contentStyle={{ background: "rgba(13,21,38,0.95)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 8, fontSize: 11 }}
            formatter={(v: number) => v.toExponential(4)} />
          <defs>
            <linearGradient id="errGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.3} />
              <stop offset="95%" stopColor="#3B82F6" stopOpacity={0} />
            </linearGradient>
          </defs>
          <Area type="monotone" dataKey="absError" stroke="#3B82F6" strokeWidth={2} fill="url(#errGrad)" name="|εₐ|" />
          <Line type="monotone" dataKey="relError" stroke="#8B5CF6" strokeWidth={1.5} dot={false} name="|εᵣ|" />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}

function RootTrajectoryChart({ result }: { result: SolverResult }) {
  if (result.kind !== "root") return null;
  const iters = result.data.iterations;
  const root = result.data.root;
  const data = iters.map((it: any) => ({
    n: it.n,
    estimate: it.xr ?? it.xnew ?? 0,
  }));

  return (
    <div className="glass p-4">
      <p className="text-[10px] text-muted-foreground mb-3">Root estimate approaching true root over iterations</p>
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
          <XAxis dataKey="n" tick={{ fill: "#94A3B8", fontSize: 10 }} stroke="rgba(255,255,255,0.1)" />
          <YAxis tick={{ fill: "#94A3B8", fontSize: 10 }} stroke="rgba(255,255,255,0.1)" domain={["auto", "auto"]} />
          <Tooltip contentStyle={{ background: "rgba(13,21,38,0.95)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 8, fontSize: 11 }} />
          {root !== null && <ReferenceLine y={root} stroke="rgba(16,185,129,0.6)" strokeDasharray="5 3" label={{ value: `root=${root.toFixed(4)}`, fill: "#10B981", fontSize: 10 }} />}
          <Line type="monotone" dataKey="estimate" stroke="#06B6D4" strokeWidth={2} dot={{ r: 3, fill: "#06B6D4" }} activeDot={{ r: 5 }} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
