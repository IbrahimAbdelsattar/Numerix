import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Area, AreaChart, RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis } from "recharts";
import type { SolverResult } from "../hooks/useSolver";

interface Props { result: SolverResult; }

export function PerformanceAnalytics({ result }: Props) {
  if (result.kind !== "root") {
    return (
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center text-muted-foreground py-12">
        Analytics available for root-finding methods.
      </motion.div>
    );
  }

  const data = result.data;
  const iters = data.iterations;

  // Compute convergence order
  let convOrder = 1;
  if (iters.length >= 3) {
    const errs = iters.map((it: any) => Math.max(it.absError, 1e-16));
    const ratios: number[] = [];
    for (let i = 2; i < errs.length; i++) {
      if (errs[i - 1] > 0 && errs[i - 2] > 0 && errs[i] > 0) {
        const logRatio = Math.log(errs[i] / errs[i - 1]) / Math.log(errs[i - 1] / errs[i - 2]);
        if (Number.isFinite(logRatio) && logRatio > 0) ratios.push(logRatio);
      }
    }
    if (ratios.length > 0) convOrder = ratios.reduce((a, b) => a + b, 0) / ratios.length;
  }

  // Stability score (error monotonicity)
  let monotonicCount = 0;
  for (let i = 1; i < iters.length; i++) {
    if ((iters[i] as any).absError <= (iters[i - 1] as any).absError) monotonicCount++;
  }
  const stabilityScore = iters.length > 1 ? Math.round((monotonicCount / (iters.length - 1)) * 100) : 100;

  // Efficiency (lower iterations = better, relative to 100)
  const efficiency = Math.max(0, Math.round(100 - (data.totalIterations / 100) * 100));

  const kpis = [
    { label: "Root Estimate", value: data.root?.toFixed(6) ?? "—", gradient: true },
    { label: "Iterations", value: data.totalIterations.toString() },
    { label: "Final |Error|", value: data.finalAbsError < 1e-10 ? data.finalAbsError.toExponential(2) : data.finalAbsError.toFixed(6) },
    { label: "Conv. Order", value: convOrder.toFixed(2) },
    { label: "Stability", value: `${stabilityScore}%` },
    { label: "Efficiency", value: `${efficiency}%` },
  ];

  // Error chart data
  const errData = iters.map((it: any) => ({
    n: it.n,
    error: Math.max(it.absError, 1e-16),
  }));

  // Convergence rate data: log|eₙ₊₁| vs log|eₙ|
  const rateData: { logEn: number; logEn1: number }[] = [];
  for (let i = 0; i < iters.length - 1; i++) {
    const en = Math.max((iters[i] as any).absError, 1e-16);
    const en1 = Math.max((iters[i + 1] as any).absError, 1e-16);
    rateData.push({ logEn: Math.log10(en), logEn1: Math.log10(en1) });
  }

  // Radar data
  const radarData = [
    { metric: "Speed", value: Math.max(0, 100 - data.totalIterations * 3) },
    { metric: "Accuracy", value: data.finalAbsError < 1e-8 ? 95 : data.finalAbsError < 1e-4 ? 70 : 40 },
    { metric: "Stability", value: stabilityScore },
    { metric: "Reliability", value: data.converged ? 90 : 20 },
    { metric: "Ease of Use", value: 75 },
  ];

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
      {/* KPI Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        {kpis.map((kpi, i) => (
          <motion.div key={kpi.label} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
            className="glass p-3 text-center">
            <div className="text-[10px] text-muted-foreground">{kpi.label}</div>
            <CountUp value={kpi.value} gradient={kpi.gradient} />
          </motion.div>
        ))}
      </div>

      {/* Charts row */}
      <div className="grid lg:grid-cols-2 gap-4">
        {/* Error vs Iteration */}
        <div className="glass p-4">
          <p className="text-xs font-semibold mb-3">Error vs Iteration</p>
          <ResponsiveContainer width="100%" height={220}>
            <AreaChart data={errData}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
              <XAxis dataKey="n" tick={{ fill: "#94A3B8", fontSize: 10 }} stroke="rgba(255,255,255,0.1)" />
              <YAxis scale="log" domain={["auto", "auto"]} tick={{ fill: "#94A3B8", fontSize: 10 }} stroke="rgba(255,255,255,0.1)"
                tickFormatter={(v: number) => v.toExponential(0)} />
              <Tooltip contentStyle={{ background: "rgba(13,21,38,0.95)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 8, fontSize: 11 }} />
              <defs>
                <linearGradient id="aGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.4} />
                  <stop offset="95%" stopColor="#3B82F6" stopOpacity={0} />
                </linearGradient>
              </defs>
              <Area type="monotone" dataKey="error" stroke="#3B82F6" strokeWidth={2} fill="url(#aGrad)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Convergence Rate */}
        <div className="glass p-4">
          <p className="text-xs font-semibold mb-3">Convergence Rate (slope ≈ order)</p>
          <ResponsiveContainer width="100%" height={220}>
            <LineChart data={rateData}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
              <XAxis dataKey="logEn" tick={{ fill: "#94A3B8", fontSize: 10 }} stroke="rgba(255,255,255,0.1)" label={{ value: "log|eₙ|", position: "bottom", style: { fill: "#94A3B8", fontSize: 9 } }} />
              <YAxis tick={{ fill: "#94A3B8", fontSize: 10 }} stroke="rgba(255,255,255,0.1)" label={{ value: "log|eₙ₊₁|", angle: -90, position: "insideLeft", style: { fill: "#94A3B8", fontSize: 9 } }} />
              <Tooltip contentStyle={{ background: "rgba(13,21,38,0.95)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 8, fontSize: 11 }} />
              <Line type="monotone" dataKey="logEn1" stroke="#8B5CF6" strokeWidth={2} dot={{ r: 3, fill: "#8B5CF6" }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Radar Chart */}
      <div className="glass p-4">
        <p className="text-xs font-semibold mb-3">Method Performance Radar</p>
        <ResponsiveContainer width="100%" height={280}>
          <RadarChart data={radarData}>
            <PolarGrid stroke="rgba(255,255,255,0.1)" />
            <PolarAngleAxis dataKey="metric" tick={{ fill: "#94A3B8", fontSize: 10 }} />
            <PolarRadiusAxis tick={{ fill: "#475569", fontSize: 9 }} domain={[0, 100]} />
            <Radar name="Score" dataKey="value" stroke="#3B82F6" fill="#3B82F6" fillOpacity={0.2} strokeWidth={2} />
          </RadarChart>
        </ResponsiveContainer>
      </div>
    </motion.div>
  );
}

function CountUp({ value, gradient }: { value: string; gradient?: boolean }) {
  const [display, setDisplay] = useState(value);
  useEffect(() => { setDisplay(value); }, [value]);
  return <div className={`text-sm font-bold font-mono mt-1 ${gradient ? "gradient-text" : ""}`}>{display}</div>;
}
