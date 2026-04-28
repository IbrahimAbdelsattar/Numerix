import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import type { SolverResult } from "../hooks/useSolver";
import { SolutionSummary } from "./SolutionSummary";
import { StepPlayback } from "./StepPlayback";
import { IterationTable } from "./IterationTable";
import { VisualizationsPanel } from "./VisualizationsPanel";
import { PerformanceAnalytics } from "./PerformanceAnalytics";
import { PdfExport } from "./PdfExport";
import { FileBarChart, ListOrdered, Play, LineChart, BarChart3 } from "lucide-react";

interface Props { result: SolverResult; }

const TABS = [
  { id: "summary", label: "Summary", icon: FileBarChart },
  { id: "steps", label: "Steps", icon: Play },
  { id: "table", label: "Table", icon: ListOrdered },
  { id: "visuals", label: "Visuals", icon: LineChart },
  { id: "analytics", label: "Analytics", icon: BarChart3 },
] as const;

type TabId = typeof TABS[number]["id"];

export function ResultsPanel({ result }: Props) {
  const [tab, setTab] = useState<TabId>("summary");

  return (
    <motion.div
      initial={{ opacity: 0, x: 40 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ type: "spring", damping: 22, stiffness: 200 }}
      className="space-y-4"
    >
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-bold gradient-text">Results</h2>
        <PdfExport result={result} />
      </div>

      {/* Tabs */}
      <div className="relative flex gap-0.5 p-1 rounded-xl bg-white/[0.03] border border-white/10">
        {TABS.map(t => {
          const active = tab === t.id;
          return (
            <button key={t.id} onClick={() => setTab(t.id)}
              className={`relative flex-1 flex items-center justify-center gap-1.5 px-2 py-2 rounded-lg text-xs font-medium transition-colors z-10 ${
                active ? "text-primary" : "text-muted-foreground hover:text-foreground"
              }`}>
              <t.icon className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">{t.label}</span>
              {active && (
                <motion.div layoutId="result-tab" className="absolute inset-0 bg-primary/10 rounded-lg -z-10"
                  transition={{ type: "spring", damping: 25, stiffness: 300 }} />
              )}
            </button>
          );
        })}
      </div>

      {/* Tab content */}
      <AnimatePresence mode="wait">
        <motion.div
          key={tab}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.2 }}
        >
          {tab === "summary" && <SolutionSummary result={result} />}
          {tab === "steps" && <StepPlayback result={result} />}
          {tab === "table" && <IterationTable result={result} />}
          {tab === "visuals" && <VisualizationsPanel result={result} />}
          {tab === "analytics" && <PerformanceAnalytics result={result} />}
        </motion.div>
      </AnimatePresence>
    </motion.div>
  );
}
