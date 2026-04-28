import { PageShell } from "@/components/layout/PageShell";
import { MethodCategorySelector } from "@/components/solver/MethodCategorySelector";
import { MethodPicker } from "@/components/solver/MethodPicker";
import { SolverForm } from "@/components/solver/SolverForm";
import { ResultsPanel } from "@/components/solver/results/ResultsPanel";
import { useSolver } from "@/components/solver/hooks/useSolver";
import { getMethod } from "@/lib/numerical/methods";
import { motion, AnimatePresence } from "framer-motion";
import { FlaskConical, AlertCircle } from "lucide-react";

export default function Solver() {
  const solver = useSolver();
  const method = solver.methodId ? getMethod(solver.methodId) : null;

  return (
    <PageShell noFooter>
      <div className="min-h-[calc(100vh-4rem)]">
        {/* Page header */}
        <div className="border-b border-white/5 bg-white/[0.01]">
          <div className="container py-5 flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-primary flex items-center justify-center">
              <FlaskConical className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold">Solver Lab</h1>
              <p className="text-xs text-muted-foreground">
                {method ? (
                  <span>
                    Solving with <span className="text-primary font-medium">{method.name}</span>
                    <span className="ml-1.5 text-[10px] px-1.5 py-0.5 rounded-full bg-white/5 border border-white/10">{method.convergence}</span>
                  </span>
                ) : (
                  "Choose a method and configure parameters to solve."
                )}
              </p>
            </div>
          </div>
        </div>

        {/* Main layout */}
        <div className="container py-6">
          <div className="grid grid-cols-1 lg:grid-cols-[380px_1fr] gap-6 items-start">
            {/* Left panel — Input */}
            <div className="space-y-5 lg:sticky lg:top-24 lg:max-h-[calc(100vh-7rem)] lg:overflow-y-auto lg:pr-2 scrollbar-thin">
              <MethodCategorySelector selected={solver.category} onSelect={solver.setCategory} />

              <AnimatePresence>
                {solver.category && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    className="overflow-hidden"
                  >
                    <MethodPicker
                      category={solver.category}
                      selected={solver.methodId}
                      onSelect={solver.setMethod}
                    />
                  </motion.div>
                )}
              </AnimatePresence>

              <AnimatePresence>
                {solver.methodId && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    className="overflow-hidden"
                  >
                    <SolverForm
                      methodId={solver.methodId}
                      params={solver.params}
                      onChange={solver.setParams}
                      onSolve={solver.solve}
                      onReset={solver.reset}
                      solving={solver.solving}
                    />
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Right panel — Results */}
            <div className="min-h-[400px]">
              {solver.error && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex items-start gap-3 p-4 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-sm"
                >
                  <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
                  <div>
                    <div className="font-semibold">Solver Error</div>
                    <p className="text-xs mt-1 opacity-80">{solver.error}</p>
                  </div>
                </motion.div>
              )}

              {solver.result && <ResultsPanel result={solver.result} />}

              {!solver.result && !solver.error && (
                <div className="flex flex-col items-center justify-center h-full min-h-[400px] text-center">
                  <div className="w-20 h-20 rounded-2xl bg-white/[0.03] border border-white/10 flex items-center justify-center mb-4">
                    <FlaskConical className="w-8 h-8 text-muted-foreground/40" />
                  </div>
                  <h3 className="text-lg font-semibold text-muted-foreground">Results will appear here</h3>
                  <p className="text-xs text-muted-foreground/60 mt-1 max-w-sm">
                    Select a method, configure parameters, and click Solve to see the step-by-step solution, visualizations, and analytics.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </PageShell>
  );
}
