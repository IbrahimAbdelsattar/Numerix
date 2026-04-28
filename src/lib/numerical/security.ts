const ALLOWED_EQUATION = /^[0-9xX+\-*/^().,\s_a-zA-Z]+$/;
const ALLOWED_NAMES = new Set([
  "x", "a", "b", "c", "pi", "e", "sin", "cos", "tan", "asin", "acos", "atan", "sqrt", "log",
  "ln", "exp", "abs", "pow", "floor", "ceil", "round", "min", "max",
]);

export function validateEquationInput(expr: string) {
  const value = (expr || "").trim();
  if (!value) throw new Error("Equation is required.");
  if (value.length > 240) throw new Error("Equation is too long for the Solver Lab limit.");
  if (!ALLOWED_EQUATION.test(value)) throw new Error("Equation contains unsupported characters.");
  if (value.includes(";") || value.includes("==") || value.includes("=>")) throw new Error("Equation contains unsupported operators.");

  const names = value.match(/[A-Za-z_]+/g) || [];
  const unknown = names.filter(name => !ALLOWED_NAMES.has(name));
  if (unknown.length > 0) {
    throw new Error(`Unsupported symbol/function: ${Array.from(new Set(unknown)).join(", ")}`);
  }
  return value;
}

export function validateNumericValue(value: unknown, label: string, limit = 1e9) {
  const numberValue = Number(value);
  if (!Number.isFinite(numberValue)) throw new Error(`${label} must be a finite number.`);
  if (Math.abs(numberValue) > limit) throw new Error(`${label} is outside the allowed numeric range.`);
  return numberValue;
}

export function validateSolverOptions(params: Record<string, unknown>) {
  const tol = validateNumericValue(params.tol ?? 1e-6, "Tolerance", 1);
  const maxIter = Math.trunc(validateNumericValue(params.maxIter ?? 100, "Max iterations", 5000));
  if (tol <= 0 || tol < 1e-14) throw new Error("Tolerance must be between 1e-14 and 1.");
  if (maxIter < 1 || maxIter > 1000) throw new Error("Max iterations must be between 1 and 1000.");
  return { tol, maxIter };
}

export function validateMatrixInput(matrix: unknown) {
  if (!Array.isArray(matrix) || matrix.length === 0 || matrix.length > 10) {
    throw new Error("Matrix must have 1 to 10 rows.");
  }
  const width = Array.isArray(matrix[0]) ? matrix[0].length : 0;
  if (width < 2 || width > 11) throw new Error("Augmented matrix must have 2 to 11 columns.");
  return matrix.map((row, rowIndex) => {
    if (!Array.isArray(row) || row.length !== width) {
      throw new Error("Matrix rows must all have the same width.");
    }
    return row.map((cell, colIndex) => validateNumericValue(cell, `Matrix value R${rowIndex + 1}C${colIndex + 1}`));
  });
}
