import { motion, AnimatePresence } from "framer-motion";
import { METHODS, type MethodId, type MethodCategory } from "@/lib/numerical/methods";
import { Check } from "lucide-react";

interface Props {
  category: MethodCategory;
  selected: MethodId | null;
  onSelect: (id: MethodId) => void;
}

export function MethodPicker({ category, selected, onSelect }: Props) {
  const methods = METHODS.filter(m => m.category === category);

  return (
    <div className="space-y-2">
      <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
        Step 2 — Select Method
      </label>
      <AnimatePresence mode="wait">
        <motion.div
          key={category}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.25 }}
          className="grid grid-cols-1 gap-2"
        >
          {methods.map((m, i) => {
            const active = selected === m.id;
            return (
              <motion.button
                key={m.id}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.04 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => onSelect(m.id)}
                className={`relative flex items-center gap-3 p-3 rounded-xl border text-left transition-all duration-200 ${
                  active
                    ? "border-primary/50 bg-primary/[0.08]"
                    : "border-white/10 bg-white/[0.02] hover:border-white/20 hover:bg-white/[0.04]"
                }`}
              >
                <div
                  className={`shrink-0 w-9 h-9 rounded-lg bg-gradient-to-br ${m.color} flex items-center justify-center`}
                >
                  <m.icon className="w-4 h-4 text-white" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className={`font-semibold text-sm ${active ? "text-primary" : "text-foreground"}`}>
                      {m.name}
                    </span>
                    <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-full text-[9px] font-medium bg-white/5 border border-white/10 text-muted-foreground">
                      {m.convergence}
                    </span>
                  </div>
                  <p className="text-[11px] text-muted-foreground truncate">{m.description}</p>
                </div>
                {active && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="shrink-0 w-6 h-6 rounded-full bg-primary flex items-center justify-center"
                  >
                    <Check className="w-3.5 h-3.5 text-white" />
                  </motion.div>
                )}
              </motion.button>
            );
          })}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
