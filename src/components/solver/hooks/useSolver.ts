import { useState, useCallback } from "react";
import type { MethodId, MethodCategory } from "@/lib/numerical/methods";
import type { RootResult, LinearResult } from "@/lib/numerical/types";
import { bisection, falsePosition, fixedPoint, newtonRaphson, secant } from "@/lib/numerical/rootFinding";
import { gaussElimination, luDecomposition, gaussJordan, cramersRule } from "@/lib/numerical/linearSystems";
import { validateEquationInput, validateMatrixInput, validateNumericValue, validateSolverOptions } from "@/lib/numerical/security";

export type SolverResult = { kind: "root"; data: RootResult } | { kind: "linear"; data: LinearResult };

export interface SolverState {
  category: MethodCategory | null;
  methodId: MethodId | null;
  params: Record<string, unknown>;
  result: SolverResult | null;
  solving: boolean;
  error: string | null;
}

const INITIAL: SolverState = {
  category: null,
  methodId: null,
  params: {},
  result: null,
  solving: false,
  error: null,
};

export function useSolver() {
  const [state, setState] = useState<SolverState>(INITIAL);

  const setCategory = useCallback((cat: MethodCategory) => {
    setState(s => ({ ...s, category: cat, methodId: null, params: {}, result: null, error: null }));
  }, []);

  const setMethod = useCallback((id: MethodId) => {
    setState(s => ({ ...s, methodId: id, params: {}, result: null, error: null }));
  }, []);

  const setParams = useCallback((p: Record<string, unknown>) => {
    setState(s => ({ ...s, params: { ...s.params, ...p } }));
  }, []);

  const reset = useCallback(() => {
    setState(s => ({ ...s, params: {}, result: null, error: null }));
  }, []);

  const resetAll = useCallback(() => {
    setState(INITIAL);
  }, []);

  const solve = useCallback(() => {
    setState(s => {
      if (!s.methodId) return s;
      const next = { ...s, solving: true, error: null, result: null };
      return next;
    });

    // Use setTimeout to allow UI to show loading state
    setTimeout(() => {
      setState(s => {
        if (!s.methodId) return { ...s, solving: false };
        try {
          const result = runSolver(s.methodId, s.params);
          return { ...s, solving: false, result, error: null };
        } catch (e: unknown) {
          return { ...s, solving: false, error: e instanceof Error ? e.message : "Solver failed." };
        }
      });
    }, 80);
  }, []);

  return { ...state, setCategory, setMethod, setParams, reset, resetAll, solve };
}

function runSolver(method: MethodId, params: Record<string, unknown>): SolverResult {
  const validatedOptions = validateSolverOptions(params);
  const opts = {
    tol: validatedOptions.tol,
    maxIter: validatedOptions.maxIter,
    stop: (params.stop === "abs" ? "abs" : "rel") as "abs" | "rel",
  };

  switch (method) {
    case "bisection":
      return { kind: "root", data: bisection(validateEquationInput(String(params.fx ?? "")), validateNumericValue(params.xl, "Lower bound"), validateNumericValue(params.xu, "Upper bound"), opts) };
    case "false-position":
      return { kind: "root", data: falsePosition(validateEquationInput(String(params.fx ?? "")), validateNumericValue(params.xl, "Lower bound"), validateNumericValue(params.xu, "Upper bound"), opts) };
    case "fixed-point":
      return { kind: "root", data: fixedPoint(validateEquationInput(String(params.gx ?? "")), validateNumericValue(params.x0, "Initial guess"), opts) };
    case "newton-raphson":
      return { kind: "root", data: newtonRaphson(validateEquationInput(String(params.fx ?? "")), validateNumericValue(params.x0, "Initial guess"), opts, params.dfx ? validateEquationInput(String(params.dfx)) : undefined) };
    case "secant":
      return { kind: "root", data: secant(validateEquationInput(String(params.fx ?? "")), validateNumericValue(params.x0, "First guess"), validateNumericValue(params.x1, "Second guess"), opts) };
    case "gauss-elimination":
      return { kind: "linear", data: gaussElimination(validateMatrixInput(params.matrix), params.pivot !== false) };
    case "lu-decomposition":
      return { kind: "linear", data: luDecomposition(validateMatrixInput(params.matrix), params.luType === "crout" ? "crout" : "doolittle") };
    case "gauss-jordan":
      return { kind: "linear", data: gaussJordan(validateMatrixInput(params.matrix)) };
    case "cramers-rule":
      return { kind: "linear", data: cramersRule(validateMatrixInput(params.matrix)) };
    default:
      throw new Error(`Unknown method: ${method}`);
  }
}
