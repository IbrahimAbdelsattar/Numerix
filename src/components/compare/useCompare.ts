import { useState, useCallback } from "react";
import { type MethodId } from "@/lib/numerical/methods";
import { bisection, falsePosition, fixedPoint, newtonRaphson, secant } from "@/lib/numerical/rootFinding";
import type { RootResult } from "@/lib/numerical/types";
import { deriveExpr } from "@/lib/numerical/mathEngine";

export interface CompareParams {
  fx: string;
  xl: number | "";
  xu: number | "";
  x0: number | "";
  x1: number | "";
  gx: string;
  tol: number;
  maxIter: number;
}

export interface RaceState {
  params: CompareParams;
  selectedMethods: MethodId[];
  results: Partial<Record<MethodId, RootResult | { error: string }>>;
  status: "idle" | "racing" | "finished";
  currentIter: number;
  maxIterTotal: number;
}

const INITIAL_PARAMS: CompareParams = {
  fx: "x^3 - x - 1",
  xl: 1,
  xu: 2,
  x0: 1.5,
  x1: 2,
  gx: "x^3 - 1",
  tol: 1e-6,
  maxIter: 100,
};

export function useCompare() {
  const [state, setState] = useState<RaceState>({
    params: INITIAL_PARAMS,
    selectedMethods: ["bisection", "false-position", "newton-raphson", "secant"],
    results: {},
    status: "idle",
    currentIter: 0,
    maxIterTotal: 0,
  });

  const setParams = useCallback((p: Partial<CompareParams>) => {
    setState(s => ({ ...s, params: { ...s.params, ...p }, status: "idle", results: {} }));
  }, []);

  const toggleMethod = useCallback((id: MethodId) => {
    setState(s => {
      const isSelected = s.selectedMethods.includes(id);
      const next = isSelected ? s.selectedMethods.filter(m => m !== id) : [...s.selectedMethods, id];
      return { ...s, selectedMethods: next, status: "idle", results: {} };
    });
  }, []);

  const prepareRace = useCallback(() => {
    const { params, selectedMethods } = state;
    const res: Partial<Record<MethodId, RootResult | { error: string }>> = {};
    const opts = { tol: params.tol, maxIter: params.maxIter, stop: "rel" as const };

    for (const m of selectedMethods) {
      try {
        switch (m) {
          case "bisection":
            res[m] = bisection(params.fx, Number(params.xl), Number(params.xu), opts);
            break;
          case "false-position":
            res[m] = falsePosition(params.fx, Number(params.xl), Number(params.xu), opts);
            break;
          case "fixed-point":
            res[m] = fixedPoint(params.gx, Number(params.x0), opts);
            break;
          case "newton-raphson":
            let dfx = undefined;
            try { dfx = deriveExpr(params.fx); } catch {}
            res[m] = newtonRaphson(params.fx, Number(params.x0), opts, dfx);
            break;
          case "secant":
            res[m] = secant(params.fx, Number(params.x0), Number(params.x1), opts);
            break;
        }
      } catch (e: any) {
        res[m] = { error: e.message || "Failed" };
      }
    }

    let maxIters = 0;
    Object.values(res).forEach(r => {
      if ("iterations" in r) maxIters = Math.max(maxIters, r.iterations.length);
    });

    setState(s => ({ ...s, results: res, maxIterTotal: maxIters, status: "racing", currentIter: 0 }));
  }, [state]);

  const tick = useCallback(() => {
    setState(s => {
      if (s.status !== "racing") return s;
      const nextIter = s.currentIter + 1;
      if (nextIter >= s.maxIterTotal) {
        return { ...s, currentIter: s.maxIterTotal, status: "finished" };
      }
      return { ...s, currentIter: nextIter };
    });
  }, []);

  const reset = useCallback(() => {
    setState(s => ({ ...s, status: "idle", results: {}, currentIter: 0, maxIterTotal: 0 }));
  }, []);

  return { ...state, setParams, toggleMethod, prepareRace, tick, reset };
}
