import type { MethodId } from "@/lib/numerical/methods";
import { BisectionForm } from "./forms/BisectionForm";
import { FalsePositionForm } from "./forms/FalsePositionForm";
import { FixedPointForm } from "./forms/FixedPointForm";
import { NewtonRaphsonForm } from "./forms/NewtonRaphsonForm";
import { SecantForm } from "./forms/SecantForm";
import { GaussForm, LUForm, GaussJordanForm, CramerForm } from "./forms/LinearForms";
import { Loader2, RotateCcw, Play } from "lucide-react";
import { motion } from "framer-motion";

interface Props {
  methodId: MethodId;
  params: Record<string, any>;
  onChange: (p: Record<string, any>) => void;
  onSolve: () => void;
  onReset: () => void;
  solving: boolean;
}

const FORM_MAP: Record<MethodId, React.FC<{ params: Record<string, any>; onChange: (p: Record<string, any>) => void }>> = {
  "bisection": BisectionForm,
  "false-position": FalsePositionForm,
  "fixed-point": FixedPointForm,
  "newton-raphson": NewtonRaphsonForm,
  "secant": SecantForm,
  "gauss-elimination": GaussForm,
  "lu-decomposition": LUForm,
  "gauss-jordan": GaussJordanForm,
  "cramers-rule": CramerForm,
};

export function SolverForm({ methodId, params, onChange, onSolve, onReset, solving }: Props) {
  const Form = FORM_MAP[methodId];
  if (!Form) return null;

  return (
    <motion.div
      key={methodId}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-4"
    >
      <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
        Step 3 — Configure Parameters
      </label>

      <Form params={params} onChange={onChange} />

      <div className="flex gap-2 pt-2">
        <button
          onClick={onSolve}
          disabled={solving}
          className="flex-1 btn-gradient h-11 text-sm disabled:opacity-50"
        >
          {solving ? (
            <><Loader2 className="w-4 h-4 animate-spin" /> Solving…</>
          ) : (
            <><Play className="w-4 h-4" /> Solve</>
          )}
        </button>
        <button onClick={onReset}
          className="px-4 h-11 rounded-xl border border-white/10 bg-white/[0.03] text-sm text-muted-foreground hover:text-foreground hover:bg-white/[0.06] transition flex items-center gap-2">
          <RotateCcw className="w-4 h-4" /> Reset
        </button>
      </div>
    </motion.div>
  );
}
