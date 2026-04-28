import {
  BracketIteration, FixedPointIteration, NewtonIteration, SecantIteration,
  RootResult, StoppingCriterion, Status,
} from "./types";
import { compileFn, deriveExpr, numDerivative, safe } from "./mathEngine";

export interface RootOptions {
  tol: number;
  maxIter: number;
  stop: StoppingCriterion;
}

const D = (n: number, places = 6) => {
  if (!Number.isFinite(n)) return n;
  return Number(n.toFixed(places));
};

function shouldStop(stop: StoppingCriterion, fxr: number, abs: number, rel: number, tol: number) {
  return stop === "f" ? safe.abs(fxr) < tol : rel < tol;
}

/* -------------------- BISECTION -------------------- */
export function bisection(expr: string, xl0: number, xu0: number, opts: RootOptions): RootResult<BracketIteration> {
  const f = compileFn(expr);
  const iters: BracketIteration[] = [];
  let xl = xl0, xu = xu0;
  let fxl = f(xl), fxu = f(xu);
  if (!Number.isFinite(fxl) || !Number.isFinite(fxu)) {
    return errorResult("Bisection", "f(x) is undefined at the initial bounds.");
  }
  if (fxl * fxu > 0) {
    return errorResult("Bisection", "Bracket invalid: f(xl)·f(xu) > 0. No sign change.");
  }
  let prevXr: number | null = null;
  let status: Status = "max-iter";
  for (let n = 1; n <= opts.maxIter; n++) {
    const xr = (xl + xu) / 2;
    const fxr = f(xr);
    const abs = prevXr === null ? safe.abs(xu - xl) : safe.abs(xr - prevXr);
    const rel = prevXr === null ? 1 : safe.abs((xr - prevXr) / xr);
    let kept: BracketIteration["keptInterval"] = "right";
    let decision = "";
    if (fxl * fxr < 0) {
      kept = "left"; decision = `f(xl)·f(xr) < 0 → root in [xl, xr]`;
    } else if (fxl * fxr > 0) {
      kept = "right"; decision = `f(xl)·f(xr) > 0 → root in [xr, xu]`;
    } else {
      kept = "exact"; decision = "f(xr) = 0 → exact root.";
    }
    iters.push({ n, xl: D(xl), xu: D(xu), xr: D(xr), fxl: D(fxl), fxu: D(fxu), fxr: D(fxr), absError: abs, relError: rel, keptInterval: kept, decision });
    if (kept === "exact" || shouldStop(opts.stop, fxr, abs, rel, opts.tol)) {
      status = "converged";
      prevXr = xr;
      break;
    }
    if (kept === "left") { xu = xr; fxu = fxr; }
    else { xl = xr; fxl = fxr; }
    prevXr = xr;
  }
  const last = iters[iters.length - 1];
  return {
    method: "Bisection",
    root: last ? last.xr : null,
    converged: status === "converged",
    status,
    iterations: iters,
    finalAbsError: last?.absError ?? Infinity,
    finalRelError: last?.relError ?? Infinity,
    totalIterations: iters.length,
  };
}

/* -------------------- FALSE POSITION -------------------- */
export function falsePosition(expr: string, xl0: number, xu0: number, opts: RootOptions): RootResult<BracketIteration> {
  const f = compileFn(expr);
  const iters: BracketIteration[] = [];
  let xl = xl0, xu = xu0;
  let fxl = f(xl), fxu = f(xu);
  if (fxl * fxu > 0) return errorResult("False Position", "Bracket invalid: f(xl)·f(xu) > 0.");
  let prevXr: number | null = null;
  let status: Status = "max-iter";
  for (let n = 1; n <= opts.maxIter; n++) {
    const denom = fxl - fxu;
    if (denom === 0) { status = "diverged"; break; }
    const xr = xu - (fxu * (xl - xu)) / denom;
    const fxr = f(xr);
    const abs = prevXr === null ? safe.abs(xu - xl) : safe.abs(xr - prevXr);
    const rel = prevXr === null ? 1 : safe.abs((xr - prevXr) / xr);
    let kept: BracketIteration["keptInterval"] = "right";
    let decision = "";
    if (fxl * fxr < 0) { kept = "left"; decision = "f(xl)·f(xr) < 0 → root in [xl, xr]"; }
    else if (fxl * fxr > 0) { kept = "right"; decision = "f(xl)·f(xr) > 0 → root in [xr, xu]"; }
    else { kept = "exact"; decision = "Exact root."; }
    iters.push({ n, xl: D(xl), xu: D(xu), xr: D(xr), fxl: D(fxl), fxu: D(fxu), fxr: D(fxr), absError: abs, relError: rel, keptInterval: kept, decision });
    if (kept === "exact" || shouldStop(opts.stop, fxr, abs, rel, opts.tol)) { status = "converged"; prevXr = xr; break; }
    if (kept === "left") { xu = xr; fxu = fxr; } else { xl = xr; fxl = fxr; }
    prevXr = xr;
  }
  const last = iters[iters.length - 1];
  return { method: "False Position", root: last ? last.xr : null, converged: status === "converged", status, iterations: iters, finalAbsError: last?.absError ?? Infinity, finalRelError: last?.relError ?? Infinity, totalIterations: iters.length };
}

/* -------------------- FIXED POINT -------------------- */
export function fixedPoint(gExpr: string, x0: number, opts: RootOptions): RootResult<FixedPointIteration> {
  const g = compileFn(gExpr);
  let gPrime: ((x: number) => number) | null = null;
  try { gPrime = compileFn(deriveExpr(gExpr)); } catch { gPrime = null; }
  const iters: FixedPointIteration[] = [];
  let xold = x0;
  let status: Status = "max-iter";
  for (let n = 1; n <= opts.maxIter; n++) {
    const gx = g(xold);
    if (!Number.isFinite(gx)) { status = "diverged"; break; }
    const xnew = gx;
    const abs = safe.abs(xnew - xold);
    const rel = xnew !== 0 ? safe.abs((xnew - xold) / xnew) : abs;
    const dv = gPrime ? gPrime(xold) : numDerivative(g, xold);
    iters.push({
      n, xold: D(xold), xnew: D(xnew), gx: D(gx), absError: abs, relError: rel,
      derivAtX: D(dv, 4),
      converging: safe.abs(dv) < 1,
      decision: safe.abs(dv) < 1 ? `|g'(x)|=${D(safe.abs(dv),3)} < 1 → converging` : `|g'(x)|=${D(safe.abs(dv),3)} ≥ 1 → may diverge`,
    });
    if (rel < opts.tol || abs < opts.tol) { status = "converged"; break; }
    xold = xnew;
    if (!Number.isFinite(xold) || safe.abs(xold) > 1e15) { status = "diverged"; break; }
  }
  const last = iters[iters.length - 1];
  return { method: "Fixed Point", root: last ? last.xnew : null, converged: status === "converged", status, iterations: iters, finalAbsError: last?.absError ?? Infinity, finalRelError: last?.relError ?? Infinity, totalIterations: iters.length };
}

/* -------------------- NEWTON-RAPHSON -------------------- */
export function newtonRaphson(expr: string, x0: number, opts: RootOptions, dfExpr?: string): RootResult<NewtonIteration> {
  const f = compileFn(expr);
  let df: (x: number) => number;
  try { df = dfExpr ? compileFn(dfExpr) : compileFn(deriveExpr(expr)); }
  catch { df = (x: number) => numDerivative(f, x); }
  const iters: NewtonIteration[] = [];
  let xold = x0;
  let status: Status = "max-iter";
  for (let n = 1; n <= opts.maxIter; n++) {
    const fxold = f(xold);
    const dfxold = df(xold);
    if (dfxold === 0 || !Number.isFinite(dfxold)) { status = "diverged"; break; }
    const step = fxold / dfxold;
    const xnew = xold - step;
    const abs = safe.abs(xnew - xold);
    const rel = xnew !== 0 ? safe.abs((xnew - xold) / xnew) : abs;
    iters.push({
      n, xold: D(xold), fxold: D(fxold), dfxold: D(dfxold), step: D(step), xnew: D(xnew),
      absError: abs, relError: rel,
      decision: `xₙ₊₁ = xₙ - f(xₙ)/f'(xₙ) = ${D(xold)} - (${D(fxold)})/(${D(dfxold)}) = ${D(xnew)}`,
    });
    if (shouldStop(opts.stop, f(xnew), abs, rel, opts.tol)) { status = "converged"; break; }
    xold = xnew;
    if (!Number.isFinite(xold) || safe.abs(xold) > 1e15) { status = "diverged"; break; }
  }
  const last = iters[iters.length - 1];
  return { method: "Newton-Raphson", root: last ? last.xnew : null, converged: status === "converged", status, iterations: iters, finalAbsError: last?.absError ?? Infinity, finalRelError: last?.relError ?? Infinity, totalIterations: iters.length };
}

/* -------------------- SECANT -------------------- */
export function secant(expr: string, x0_: number, x1_: number, opts: RootOptions): RootResult<SecantIteration> {
  const f = compileFn(expr);
  const iters: SecantIteration[] = [];
  let x0 = x0_, x1 = x1_;
  let status: Status = "max-iter";
  for (let n = 1; n <= opts.maxIter; n++) {
    const fx0 = f(x0), fx1 = f(x1);
    if (fx1 - fx0 === 0) { status = "diverged"; break; }
    const xnew = x1 - (fx1 * (x0 - x1)) / (fx0 - fx1);
    const abs = safe.abs(xnew - x1);
    const rel = xnew !== 0 ? safe.abs((xnew - x1) / xnew) : abs;
    iters.push({
      n, x0: D(x0), x1: D(x1), fx0: D(fx0), fx1: D(fx1), xnew: D(xnew),
      absError: abs, relError: rel,
      decision: `xₙ₊₁ = x₁ - f(x₁)(x₀-x₁)/(f(x₀)-f(x₁)) = ${D(xnew)}`,
    });
    if (shouldStop(opts.stop, f(xnew), abs, rel, opts.tol)) { status = "converged"; break; }
    x0 = x1; x1 = xnew;
    if (!Number.isFinite(x1) || safe.abs(x1) > 1e15) { status = "diverged"; break; }
  }
  const last = iters[iters.length - 1];
  return { method: "Secant", root: last ? last.xnew : null, converged: status === "converged", status, iterations: iters, finalAbsError: last?.absError ?? Infinity, finalRelError: last?.relError ?? Infinity, totalIterations: iters.length };
}

function errorResult(method: string, msg: string): RootResult<any> {
  return { method, root: null, converged: false, status: "error", iterations: [], finalAbsError: Infinity, finalRelError: Infinity, totalIterations: 0, errorMessage: msg };
}
