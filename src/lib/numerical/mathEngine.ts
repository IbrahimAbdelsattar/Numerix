import { evaluate, parse, derivative } from "mathjs";
import { validateEquationInput } from "./security";

/** Compile an f(x) string into a fast evaluator. Throws if invalid. */
export function compileFn(expr: string): (x: number) => number {
  const safeExpr = validateEquationInput(expr);
  const node = parse(safeExpr);
  const code = node.compile();
  return (x: number) => {
    const v = code.evaluate({ x });
    if (typeof v !== "number" || Number.isNaN(v)) return NaN;
    return v;
  };
}

/** Try to compile, return null on error. */
export function tryCompile(expr: string): ((x: number) => number) | null {
  try { return compileFn(expr); } catch { return null; }
}

/** Symbolic derivative as string. */
export function deriveExpr(expr: string): string {
  return derivative(validateEquationInput(expr), "x").toString();
}

export function evalAt(expr: string, x: number): number {
  try { return evaluate(validateEquationInput(expr), { x }); } catch { return NaN; }
}

export const safe = {
  abs: (n: number) => (Number.isFinite(n) ? Math.abs(n) : Infinity),
  div: (a: number, b: number) => (b === 0 ? NaN : a / b),
};

/** Numerical derivative fallback (5-point stencil). */
export function numDerivative(f: (x: number) => number, x: number, h = 1e-5): number {
  const f1 = f(x - 2 * h);
  const f2 = f(x - h);
  const f3 = f(x + h);
  const f4 = f(x + 2 * h);
  return (-f4 + 8 * f3 - 8 * f2 + f1) / (12 * h);
}
