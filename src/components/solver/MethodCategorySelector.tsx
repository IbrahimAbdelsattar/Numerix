import { motion } from "framer-motion";
import { FunctionSquare, Grid3X3 } from "lucide-react";
import type { MethodCategory } from "@/lib/numerical/methods";

interface Props {
  selected: MethodCategory | null;
  onSelect: (cat: MethodCategory) => void;
}

const categories = [
  {
    id: "root-finding" as MethodCategory,
    title: "Root-Finding Methods",
    desc: "Find roots of f(x) = 0 using iterative approximation.",
    icon: FunctionSquare,
    gradient: "from-blue-500 to-cyan-500",
  },
  {
    id: "linear-systems" as MethodCategory,
    title: "Linear System Methods",
    desc: "Solve [A|b] systems using direct matrix methods.",
    icon: Grid3X3,
    gradient: "from-violet-500 to-fuchsia-500",
  },
];

export function MethodCategorySelector({ selected, onSelect }: Props) {
  return (
    <div className="space-y-2">
      <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
        Step 1 — Choose Category
      </label>
      <div className="grid grid-cols-1 gap-3">
        {categories.map((cat) => {
          const active = selected === cat.id;
          return (
            <motion.button
              key={cat.id}
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.99 }}
              onClick={() => onSelect(cat.id)}
              className={`relative flex items-start gap-4 p-4 rounded-2xl border text-left transition-all duration-300 ${
                active
                  ? "border-primary/50 bg-primary/[0.08] shadow-glow"
                  : "border-white/10 bg-white/[0.03] hover:border-white/20 hover:bg-white/[0.05]"
              }`}
            >
              {active && (
                <motion.div
                  layoutId="cat-indicator"
                  className="absolute inset-0 rounded-2xl border-2 border-primary/40 pointer-events-none"
                  transition={{ type: "spring", damping: 25, stiffness: 300 }}
                />
              )}
              <div
                className={`shrink-0 w-11 h-11 rounded-xl bg-gradient-to-br ${cat.gradient} flex items-center justify-center transition-transform ${
                  active ? "scale-110" : ""
                }`}
              >
                <cat.icon className="w-5 h-5 text-white" />
              </div>
              <div>
                <h3 className={`font-bold text-sm ${active ? "text-primary" : "text-foreground"}`}>
                  {cat.title}
                </h3>
                <p className="text-xs text-muted-foreground mt-0.5">{cat.desc}</p>
              </div>
            </motion.button>
          );
        })}
      </div>
    </div>
  );
}
