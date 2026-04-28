// Shared types for numerical method outputs.
// Every iteration record stores the full state needed by the Step Playback engine.

export type ConvergenceClass = "Linear" | "Quadratic" | "Superlinear";
export type StoppingCriterion = "f" | "rel"; // |f(xr)|<eps  OR  |(xnew-xold)/xnew|<eps

export interface BaseIteration {
  n: number;
  absError: number;
  relError: number;
  decision?: string;
}

export interface BracketIteration extends BaseIteration {
  xl: number;
  xu: number;
  xr: number;
  fxl: number;
  fxu: number;
  fxr: number;
  keptInterval: "left" | "right" | "exact";
}

export interface FixedPointIteration extends BaseIteration {
  xold: number;
  xnew: number;
  gx: number;
  derivAtX?: number;
  converging?: boolean;
}

export interface NewtonIteration extends BaseIteration {
  xold: number;
  fxold: number;
  dfxold: number;
  step: number;
  xnew: number;
}

export interface SecantIteration extends BaseIteration {
  x0: number;
  x1: number;
  fx0: number;
  fx1: number;
  xnew: number;
}

export type RootIteration =
  | BracketIteration
  | FixedPointIteration
  | NewtonIteration
  | SecantIteration;

export type Status = "converged" | "diverged" | "max-iter" | "error";

export interface RootResult<T extends BaseIteration = BaseIteration> {
  method: string;
  root: number | null;
  converged: boolean;
  status: Status;
  iterations: T[];
  finalAbsError: number;
  finalRelError: number;
  totalIterations: number;
  errorMessage?: string;
  meta?: Record<string, unknown>;
}

// Linear systems
export type Matrix = number[][];

export interface LinearStep {
  n: number;
  description: string;
  matrix: Matrix; // snapshot after this step
  pivotRow?: number;
  pivotCol?: number;
  affectedRow?: number;
  multiplier?: number;
  L?: Matrix;
  U?: Matrix;
}

export interface LinearResult {
  method: string;
  solution: number[] | null;
  converged: boolean;
  status: Status;
  steps: LinearStep[];
  errorMessage?: string;
  meta?: Record<string, unknown>;
}
