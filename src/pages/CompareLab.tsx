import { PageShell } from "@/components/layout/PageShell";
import { useCompare } from "@/components/compare/useCompare";
import { CompareSetup } from "@/components/compare/CompareSetup";
import { RaceDashboard } from "@/components/compare/RaceDashboard";
import { PostRaceResults } from "@/components/compare/PostRaceResults";
import { Gauge, Play } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function CompareLab() {
  const race = useCompare();

  return (
    <PageShell>
      <div className="container py-10 max-w-5xl space-y-8">
        <div className="flex items-center gap-4 border-b border-white/10 pb-6">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-orange-500 to-rose-500 flex items-center justify-center shadow-glow">
            <Gauge className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold gradient-text">Compare Lab: Race Mode</h1>
            <p className="text-sm text-muted-foreground mt-1">Pit numerical methods against each other to see which converges fastest.</p>
          </div>
        </div>

        {race.status === "idle" ? (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
            <div className="glass p-6">
              <CompareSetup
                params={race.params}
                onChange={race.setParams}
                selectedMethods={race.selectedMethods}
                onToggleMethod={race.toggleMethod}
              />
            </div>
            <div className="flex justify-end">
              <button
                onClick={race.prepareRace}
                disabled={race.selectedMethods.length < 2}
                className="btn-gradient px-8 py-3 rounded-xl font-bold text-lg flex items-center gap-2 shadow-glow hover:shadow-glow-lg transition disabled:opacity-50"
              >
                <Play className="w-5 h-5" fill="currentColor" />
                Start Race
              </button>
            </div>
          </motion.div>
        ) : (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
            <RaceDashboard state={race} onTick={race.tick} onReset={race.reset} />
            <PostRaceResults state={race} />
          </motion.div>
        )}
      </div>
    </PageShell>
  );
}
