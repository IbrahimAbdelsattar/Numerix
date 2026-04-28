import { LinearResult, LinearStep, Matrix } from "./types";

const round = (n: number, p = 6) => (Number.isFinite(n) ? Number(n.toFixed(p)) : n);
const cloneMatrix = (m: Matrix): Matrix => m.map(r => [...r]);

function fmtMatrix(m: Matrix): Matrix {
  return m.map(r => r.map(v => round(v, 6)));
}

/* ---------- GAUSS ELIMINATION ---------- */
export function gaussElimination(augmented: Matrix, partialPivot = true): LinearResult {
  const A = cloneMatrix(augmented);
  const n = A.length;
  const steps: LinearStep[] = [];
  let stepN = 0;
  steps.push({ n: stepN++, description: "Initial augmented matrix [A|b]", matrix: fmtMatrix(A) });

  for (let k = 0; k < n; k++) {
    if (partialPivot) {
      let maxRow = k;
      for (let i = k + 1; i < n; i++) if (Math.abs(A[i][k]) > Math.abs(A[maxRow][k])) maxRow = i;
      if (maxRow !== k) {
        [A[k], A[maxRow]] = [A[maxRow], A[k]];
        steps.push({ n: stepN++, description: `Partial pivoting: swap R${k+1} ↔ R${maxRow+1}`, matrix: fmtMatrix(A), pivotRow: k });
      }
    }
    if (Math.abs(A[k][k]) < 1e-14) {
      return { method: "Gauss Elimination", solution: null, converged: false, status: "error", steps, errorMessage: "Singular matrix: zero pivot encountered." };
    }
    for (let i = k + 1; i < n; i++) {
      const m = A[i][k] / A[k][k];
      if (m === 0) continue;
      for (let j = k; j <= n; j++) A[i][j] -= m * A[k][j];
      steps.push({
        n: stepN++,
        description: `Eliminate x${k+1} from R${i+1}: R${i+1} ← R${i+1} − (${round(m,4)})·R${k+1}`,
        matrix: fmtMatrix(A), pivotRow: k, affectedRow: i, multiplier: round(m,6),
      });
    }
  }

  // Back-substitution
  const x = new Array(n).fill(0);
  for (let i = n - 1; i >= 0; i--) {
    let s = A[i][n];
    for (let j = i + 1; j < n; j++) s -= A[i][j] * x[j];
    x[i] = s / A[i][i];
    steps.push({
      n: stepN++,
      description: `Back-substitution: x${i+1} = ${round(x[i],6)}`,
      matrix: fmtMatrix(A),
    });
  }
  return { method: "Gauss Elimination", solution: x.map(v => round(v, 6)), converged: true, status: "converged", steps };
}

/* ---------- LU DECOMPOSITION (Doolittle) ---------- */
export function luDecomposition(augmented: Matrix, type: "doolittle" | "crout" = "doolittle"): LinearResult {
  const n = augmented.length;
  const A: Matrix = augmented.map(r => r.slice(0, n));
  const b = augmented.map(r => r[n]);
  const L: Matrix = Array.from({ length: n }, () => new Array(n).fill(0));
  const U: Matrix = Array.from({ length: n }, () => new Array(n).fill(0));
  const steps: LinearStep[] = [];

  if (type === "doolittle") {
    for (let i = 0; i < n; i++) L[i][i] = 1;
    for (let k = 0; k < n; k++) {
      for (let j = k; j < n; j++) {
        let s = 0;
        for (let p = 0; p < k; p++) s += L[k][p] * U[p][j];
        U[k][j] = A[k][j] - s;
      }
      if (Math.abs(U[k][k]) < 1e-14) {
        return { method: "LU Decomposition", solution: null, converged: false, status: "error", steps, errorMessage: "Zero pivot in U." };
      }
      for (let i = k + 1; i < n; i++) {
        let s = 0;
        for (let p = 0; p < k; p++) s += L[i][p] * U[p][k];
        L[i][k] = (A[i][k] - s) / U[k][k];
      }
      steps.push({ n: k, description: `Computed row ${k+1} of U and column ${k+1} of L`, matrix: A.map(r => r.map(v => round(v))), L: L.map(r => r.map(v => round(v))), U: U.map(r => r.map(v => round(v))) });
    }
  } else {
    for (let j = 0; j < n; j++) U[j][j] = 1;
    for (let k = 0; k < n; k++) {
      for (let i = k; i < n; i++) {
        let s = 0;
        for (let p = 0; p < k; p++) s += L[i][p] * U[p][k];
        L[i][k] = A[i][k] - s;
      }
      if (Math.abs(L[k][k]) < 1e-14) return { method: "LU Decomposition", solution: null, converged: false, status: "error", steps, errorMessage: "Zero pivot in L." };
      for (let j = k + 1; j < n; j++) {
        let s = 0;
        for (let p = 0; p < k; p++) s += L[k][p] * U[p][j];
        U[k][j] = (A[k][j] - s) / L[k][k];
      }
      steps.push({ n: k, description: `Crout: column ${k+1} of L, row ${k+1} of U`, matrix: A.map(r => r.map(v => round(v))), L: L.map(r => r.map(v => round(v))), U: U.map(r => r.map(v => round(v))) });
    }
  }

  // Solve Ly = b
  const y = new Array(n).fill(0);
  for (let i = 0; i < n; i++) {
    let s = 0;
    for (let j = 0; j < i; j++) s += L[i][j] * y[j];
    y[i] = (b[i] - s) / L[i][i];
  }
  steps.push({ n: steps.length, description: `Forward substitution Ly = b → y = [${y.map(v => round(v,4)).join(", ")}]`, matrix: A, L, U });

  // Solve Ux = y
  const x = new Array(n).fill(0);
  for (let i = n - 1; i >= 0; i--) {
    let s = 0;
    for (let j = i + 1; j < n; j++) s += U[i][j] * x[j];
    x[i] = (y[i] - s) / U[i][i];
  }
  steps.push({ n: steps.length, description: `Back substitution Ux = y → x = [${x.map(v => round(v,4)).join(", ")}]`, matrix: A, L, U });

  return { method: "LU Decomposition", solution: x.map(v => round(v, 6)), converged: true, status: "converged", steps, meta: { L, U, type } };
}

/* ---------- GAUSS-JORDAN ---------- */
export function gaussJordan(augmented: Matrix): LinearResult {
  const A = cloneMatrix(augmented);
  const n = A.length;
  const steps: LinearStep[] = [];
  let stepN = 0;
  steps.push({ n: stepN++, description: "Initial augmented matrix", matrix: fmtMatrix(A) });

  for (let k = 0; k < n; k++) {
    let maxRow = k;
    for (let i = k + 1; i < n; i++) if (Math.abs(A[i][k]) > Math.abs(A[maxRow][k])) maxRow = i;
    if (maxRow !== k) {
      [A[k], A[maxRow]] = [A[maxRow], A[k]];
      steps.push({ n: stepN++, description: `Swap R${k+1} ↔ R${maxRow+1}`, matrix: fmtMatrix(A) });
    }
    const piv = A[k][k];
    if (Math.abs(piv) < 1e-14) return { method: "Gauss-Jordan", solution: null, converged: false, status: "error", steps, errorMessage: "Singular matrix." };
    for (let j = k; j <= n; j++) A[k][j] /= piv;
    steps.push({ n: stepN++, description: `Normalize R${k+1} ← R${k+1} / ${round(piv,4)}`, matrix: fmtMatrix(A), pivotRow: k });
    for (let i = 0; i < n; i++) {
      if (i === k) continue;
      const factor = A[i][k];
      if (factor === 0) continue;
      for (let j = k; j <= n; j++) A[i][j] -= factor * A[k][j];
      steps.push({ n: stepN++, description: `R${i+1} ← R${i+1} − (${round(factor,4)})·R${k+1}`, matrix: fmtMatrix(A), pivotRow: k, affectedRow: i, multiplier: round(factor,6) });
    }
  }
  const x = A.map(r => round(r[n], 6));
  return { method: "Gauss-Jordan", solution: x, converged: true, status: "converged", steps };
}

/* ---------- CRAMER'S RULE ---------- */
function det(m: Matrix): number {
  const n = m.length;
  if (n === 1) return m[0][0];
  if (n === 2) return m[0][0]*m[1][1] - m[0][1]*m[1][0];
  // LU-based determinant
  const a = cloneMatrix(m);
  let sign = 1;
  for (let k = 0; k < n; k++) {
    let maxRow = k;
    for (let i = k+1; i < n; i++) if (Math.abs(a[i][k]) > Math.abs(a[maxRow][k])) maxRow = i;
    if (maxRow !== k) { [a[k], a[maxRow]] = [a[maxRow], a[k]]; sign = -sign; }
    if (Math.abs(a[k][k]) < 1e-14) return 0;
    for (let i = k+1; i < n; i++) {
      const f = a[i][k] / a[k][k];
      for (let j = k; j < n; j++) a[i][j] -= f * a[k][j];
    }
  }
  let d = sign;
  for (let i = 0; i < n; i++) d *= a[i][i];
  return d;
}

export function cramersRule(augmented: Matrix): LinearResult {
  const n = augmented.length;
  const A: Matrix = augmented.map(r => r.slice(0, n));
  const b = augmented.map(r => r[n]);
  const steps: LinearStep[] = [];
  const D = det(A);
  steps.push({ n: 0, description: `det(A) = ${round(D, 6)}`, matrix: A.map(r => r.map(v => round(v))) });
  if (Math.abs(D) < 1e-14) {
    return { method: "Cramer's Rule", solution: null, converged: false, status: "error", steps, errorMessage: "det(A) = 0 → no unique solution." };
  }
  const x: number[] = [];
  for (let i = 0; i < n; i++) {
    const Ai = A.map((r, ri) => r.map((v, ci) => (ci === i ? b[ri] : v)));
    const di = det(Ai);
    x.push(di / D);
    steps.push({ n: i + 1, description: `D${i+1} = ${round(di,6)} → x${i+1} = D${i+1}/D = ${round(di/D, 6)}`, matrix: Ai.map(r => r.map(v => round(v))) });
  }
  return { method: "Cramer's Rule", solution: x.map(v => round(v, 6)), converged: true, status: "converged", steps, meta: { detA: D } };
}

export { det as determinant };
