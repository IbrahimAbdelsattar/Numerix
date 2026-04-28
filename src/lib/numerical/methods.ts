// Method registry: shared metadata used across the app.
import {
  Calculator, Crosshair, Repeat, Zap, Activity,
  Grid3x3, Layers, Square, Sigma,
} from "lucide-react";

export type MethodId =
  | "bisection" | "false-position" | "fixed-point" | "newton-raphson" | "secant"
  | "gauss-elimination" | "lu-decomposition" | "gauss-jordan" | "cramers-rule";

export type MethodCategory = "root-finding" | "linear-systems";

export interface MethodMeta {
  id: MethodId;
  name: string;
  category: MethodCategory;
  convergence: "Linear" | "Quadratic" | "Superlinear" | "Direct";
  difficulty: "Easy" | "Medium" | "Hard";
  description: string;
  icon: any;
  color: string; // tailwind color
  speed: number; // 0-100 relative speed
}

export const METHODS: MethodMeta[] = [
  { id: "bisection", name: "Bisection", category: "root-finding", convergence: "Linear", difficulty: "Easy",
    description: "Reliably halves the interval until the root is squeezed out.", icon: Crosshair, color: "from-blue-500 to-cyan-500", speed: 35 },
  { id: "false-position", name: "False Position", category: "root-finding", convergence: "Linear", difficulty: "Easy",
    description: "Linear interpolation between bracket endpoints — faster than bisection.", icon: Activity, color: "from-cyan-500 to-emerald-500", speed: 50 },
  { id: "fixed-point", name: "Fixed Point", category: "root-finding", convergence: "Linear", difficulty: "Medium",
    description: "Iterate x = g(x). Convergence requires |g'(x)| < 1.", icon: Repeat, color: "from-emerald-500 to-teal-500", speed: 45 },
  { id: "newton-raphson", name: "Newton-Raphson", category: "root-finding", convergence: "Quadratic", difficulty: "Medium",
    description: "Tangent-line method. Fastest when started near the root.", icon: Zap, color: "from-violet-500 to-fuchsia-500", speed: 95 },
  { id: "secant", name: "Secant", category: "root-finding", convergence: "Superlinear", difficulty: "Medium",
    description: "Newton without the derivative — uses two prior points.", icon: Calculator, color: "from-fuchsia-500 to-pink-500", speed: 80 },
  { id: "gauss-elimination", name: "Gauss Elimination", category: "linear-systems", convergence: "Direct", difficulty: "Easy",
    description: "Forward elimination + back-substitution on [A|b].", icon: Grid3x3, color: "from-blue-500 to-violet-500", speed: 100 },
  { id: "lu-decomposition", name: "LU Decomposition", category: "linear-systems", convergence: "Direct", difficulty: "Medium",
    description: "Factor A = LU, then solve Ly=b and Ux=y.", icon: Layers, color: "from-indigo-500 to-purple-500", speed: 100 },
  { id: "gauss-jordan", name: "Gauss-Jordan", category: "linear-systems", convergence: "Direct", difficulty: "Easy",
    description: "Reduce to identity via row operations to read solution directly.", icon: Square, color: "from-cyan-500 to-blue-500", speed: 100 },
  { id: "cramers-rule", name: "Cramer's Rule", category: "linear-systems", convergence: "Direct", difficulty: "Easy",
    description: "Determinant ratios for each unknown — small systems only.", icon: Sigma, color: "from-amber-500 to-orange-500", speed: 100 },
];

export const getMethod = (id: MethodId) => METHODS.find(m => m.id === id)!;

export const ROOT_METHODS = METHODS.filter(m => m.category === "root-finding");
export const LINEAR_METHODS = METHODS.filter(m => m.category === "linear-systems");

export const EXAMPLE_PROBLEMS: Record<MethodId, Array<{ label: string; params: Record<string, any> }>> = {
  "bisection": [
    { label: "x³ − x − 1 on [1, 2]", params: { fx: "x^3 - x - 1", xl: 1, xu: 2 } },
    { label: "cos(x) − x on [0, 1]", params: { fx: "cos(x) - x", xl: 0, xu: 1 } },
    { label: "eˣ − 3x on [0, 1]", params: { fx: "exp(x) - 3*x", xl: 0, xu: 1 } },
    { label: "x² − 4 on [1, 3]", params: { fx: "x^2 - 4", xl: 1, xu: 3 } },
    { label: "ln(x) − 1 on [2, 4]", params: { fx: "log(x) - 1", xl: 2, xu: 4 } },
  ],
  "false-position": [
    { label: "x³ − x − 1 on [1, 2]", params: { fx: "x^3 - x - 1", xl: 1, xu: 2 } },
    { label: "cos(x) − x on [0, 1]", params: { fx: "cos(x) - x", xl: 0, xu: 1 } },
    { label: "x − 2sin(x) on [1.5, 2]", params: { fx: "x - 2*sin(x)", xl: 1.5, xu: 2 } },
    { label: "x² − 5 on [2, 3]", params: { fx: "x^2 - 5", xl: 2, xu: 3 } },
    { label: "eˣ − 4 on [1, 2]", params: { fx: "exp(x) - 4", xl: 1, xu: 2 } },
  ],
  "fixed-point": [
    { label: "g(x) = (x+2)/3 (for x = (x+2)/3)", params: { gx: "(x + 2) / 3", x0: 1 } },
    { label: "g(x) = cos(x)", params: { gx: "cos(x)", x0: 1 } },
    { label: "g(x) = √(x+1)", params: { gx: "sqrt(x + 1)", x0: 1 } },
    { label: "g(x) = (10 − x³)^(1/2) / 4", params: { gx: "sqrt(10 - x^3)/4", x0: 1.5 } },
    { label: "g(x) = (x² + 2)/3", params: { gx: "(x^2 + 2)/3", x0: 0.5 } },
  ],
  "newton-raphson": [
    { label: "x³ − x − 1, x₀ = 1.5", params: { fx: "x^3 - x - 1", x0: 1.5 } },
    { label: "cos(x) − x, x₀ = 0.5", params: { fx: "cos(x) - x", x0: 0.5 } },
    { label: "x² − 5, x₀ = 2", params: { fx: "x^2 - 5", x0: 2 } },
    { label: "eˣ − 3x, x₀ = 0.5", params: { fx: "exp(x) - 3*x", x0: 0.5 } },
    { label: "ln(x) + x − 2, x₀ = 1.5", params: { fx: "log(x) + x - 2", x0: 1.5 } },
  ],
  "secant": [
    { label: "x³ − x − 1, x₀=1, x₁=2", params: { fx: "x^3 - x - 1", x0: 1, x1: 2 } },
    { label: "cos(x) − x, x₀=0, x₁=1", params: { fx: "cos(x) - x", x0: 0, x1: 1 } },
    { label: "x² − 7, x₀=2, x₁=3", params: { fx: "x^2 - 7", x0: 2, x1: 3 } },
    { label: "eˣ − 4x, x₀=0, x₁=1", params: { fx: "exp(x) - 4*x", x0: 0, x1: 1 } },
    { label: "x·sin(x) − 1, x₀=1, x₁=2", params: { fx: "x*sin(x) - 1", x0: 1, x1: 2 } },
  ],
  "gauss-elimination": [
    { label: "3×3 system", params: { matrix: [[2,1,-1,8],[-3,-1,2,-11],[-2,1,2,-3]] } },
    { label: "2×2 system", params: { matrix: [[2,1,5],[1,-1,1]] } },
    { label: "Ill-conditioned 3×3", params: { matrix: [[1,1,1,6],[2,5,1,15],[1,2,4,-2]] } },
  ],
  "lu-decomposition": [
    { label: "3×3 system", params: { matrix: [[2,1,-1,8],[-3,-1,2,-11],[-2,1,2,-3]] } },
    { label: "Doolittle 3×3", params: { matrix: [[4,3,0,1],[3,4,-1,1],[0,-1,4,1]] } },
  ],
  "gauss-jordan": [
    { label: "3×3 system", params: { matrix: [[2,1,-1,8],[-3,-1,2,-11],[-2,1,2,-3]] } },
    { label: "2×2 system", params: { matrix: [[1,2,5],[3,-1,1]] } },
  ],
  "cramers-rule": [
    { label: "2×2 system", params: { matrix: [[2,1,5],[1,-1,1]] } },
    { label: "3×3 system", params: { matrix: [[2,1,-1,8],[-3,-1,2,-11],[-2,1,2,-3]] } },
  ],
};
