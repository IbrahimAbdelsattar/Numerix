import { motion } from "framer-motion";
import type { RaceState } from "./useCompare";
import { getMethod } from "@/lib/numerical/methods";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, Cell } from "recharts";

interface Props { state: RaceState; }

export function PostRaceResults({ state }: Props) {
  if (state.status !== "finished") return null;

  const validResults = Object.entries(state.results)
    .filter(([_, r]) => !("error" in r))
    .map(([id, r]) => ({
      id,
      method: getMethod(id as any)!,
      res: r as any,
    }));

  if (validResults.length === 0) return null;

  // Prepare Iterations Bar Chart Data
  const barData = validResults.map(vr => ({
    name: vr.method.name,
    iterations: vr.res.iterations.length,
    color: vr.method.color.split(" ")[0].replace("from-", ""), // Best guess at a hex
    fill: getComputedStyle(document.documentElement).getPropertyValue(`--${vr.method.color.split("-")[1]}-500`) || "#3B82F6",
  })).sort((a, b) => a.iterations - b.iterations);

  // Prepare Overlay Chart Data (X: iter, Y: absError log)
  const maxIters = Math.max(...validResults.map(vr => vr.res.iterations.length));
  const overlayData = [];
  for (let i = 0; i < maxIters; i++) {
    const pt: any = { iter: i };
    validResults.forEach(vr => {
      const iters = vr.res.iterations;
      const step = iters[Math.min(i, iters.length - 1)];
      pt[vr.method.name] = Math.max(step.absError, 1e-16);
    });
    overlayData.push(pt);
  }

  const colors = ["#3B82F6", "#8B5CF6", "#EC4899", "#10B981", "#F59E0B"];

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6 mt-6">
      <h3 className="text-lg font-bold gradient-text">Post-Race Analysis</h3>
      
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Iterations Bar Chart */}
        <div className="glass p-5">
          <h4 className="text-xs font-semibold mb-4 text-muted-foreground">Iterations to Converge (Lower is Better)</h4>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={barData} layout="vertical" margin={{ left: 20 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" horizontal={false} />
              <XAxis type="number" tick={{ fill: "#94A3B8", fontSize: 10 }} stroke="rgba(255,255,255,0.1)" />
              <YAxis type="category" dataKey="name" tick={{ fill: "#94A3B8", fontSize: 10 }} stroke="none" />
              <Tooltip contentStyle={{ background: "rgba(13,21,38,0.95)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 8, fontSize: 11 }} />
              <Bar dataKey="iterations" radius={[0, 4, 4, 0]}>
                {barData.map((entry, i) => (
                  <Cell key={`cell-${i}`} fill={colors[i % colors.length]} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Convergence Overlay */}
        <div className="glass p-5">
          <h4 className="text-xs font-semibold mb-4 text-muted-foreground">Error Convergence Comparison</h4>
          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={overlayData}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
              <XAxis dataKey="iter" tick={{ fill: "#94A3B8", fontSize: 10 }} stroke="rgba(255,255,255,0.1)" />
              <YAxis scale="log" domain={["auto", "auto"]} tick={{ fill: "#94A3B8", fontSize: 10 }} stroke="rgba(255,255,255,0.1)" tickFormatter={v => v.toExponential(0)} />
              <Tooltip contentStyle={{ background: "rgba(13,21,38,0.95)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 8, fontSize: 11 }} />
              {validResults.map((vr, i) => (
                <Line key={vr.id} type="monotone" dataKey={vr.method.name} stroke={colors[i % colors.length]} strokeWidth={2} dot={false} />
              ))}
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </motion.div>
  );
}
