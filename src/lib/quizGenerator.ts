// A dynamic procedural quiz generator for numerical analysis.
// By combining random numbers with conceptual templates, this easily covers >1000 unique questions.

export interface Question {
  id: string;
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
}

// Random helpers
const randInt = (min: number, max: number) => Math.floor(Math.random() * (max - min + 1)) + min;
const randFloat = (min: number, max: number, dec = 2) => Number((Math.random() * (max - min) + min).toFixed(dec));
const shuffle = <T>(arr: T[]): T[] => arr.map(a => ({sort: Math.random(), value: a})).sort((a, b) => a.sort - b.sort).map(a => a.value);

// Question generators
const generators = [
  // 1. Conceptual - Bisection
  () => {
    return {
      question: "Which of the following methods guarantees convergence for finding a root, provided the initial guesses bracket the root?",
      options: ["Newton-Raphson Method", "Secant Method", "Bisection Method", "Fixed-Point Iteration"],
      correctAnswer: 2,
      explanation: "The Bisection method always converges because it repeatedly halves the interval containing the root."
    };
  },
  // 2. Conceptual - Newton
  () => {
    return {
      question: "What is the theoretical convergence order of the Newton-Raphson method?",
      options: ["Linear (Order 1)", "Superlinear (Order 1.618)", "Quadratic (Order 2)", "Cubic (Order 3)"],
      correctAnswer: 2,
      explanation: "Newton-Raphson has quadratic convergence (Order 2), meaning correct decimal places roughly double each iteration."
    };
  },
  // 3. Conceptual - Error
  () => {
    return {
      question: "Which type of error is caused by approximating an infinite mathematical process (like a Taylor series) with a finite number of steps?",
      options: ["Round-off Error", "Truncation Error", "Absolute Error", "Syntax Error"],
      correctAnswer: 1,
      explanation: "Truncation error occurs when an infinite mathematical procedure is truncated."
    };
  },
  // 4. Math - Bisection Midpoint
  () => {
    const a = randFloat(-10, 0);
    const b = randFloat(1, 10);
    const mid = (a + b) / 2;
    const wrong1 = mid + 1;
    const wrong2 = mid - 0.5;
    const wrong3 = (a * b) / 2;
    
    const opts = shuffle([
      { text: mid.toFixed(2), isCorrect: true },
      { text: wrong1.toFixed(2), isCorrect: false },
      { text: wrong2.toFixed(2), isCorrect: false },
      { text: wrong3.toFixed(2), isCorrect: false }
    ]);

    return {
      question: `Calculate the first midpoint (x_r) for the Bisection method given the interval [${a}, ${b}].`,
      options: opts.map(o => o.text),
      correctAnswer: opts.findIndex(o => o.isCorrect),
      explanation: `The midpoint is simply (x_l + x_u) / 2 = (${a} + ${b}) / 2 = ${mid.toFixed(2)}.`
    };
  },
  // 5. Math - Absolute Error
  () => {
    const trueVal = randFloat(10, 100);
    const approxVal = trueVal + randFloat(0.1, 5) * (Math.random() > 0.5 ? 1 : -1);
    const err = Math.abs(trueVal - approxVal);
    
    const opts = shuffle([
      { text: err.toFixed(2), isCorrect: true },
      { text: (trueVal + approxVal).toFixed(2), isCorrect: false },
      { text: (err / trueVal).toFixed(4), isCorrect: false },
      { text: (-err).toFixed(2), isCorrect: false }
    ]);

    return {
      question: `If the true value is ${trueVal.toFixed(2)} and the approximate value is ${approxVal.toFixed(2)}, what is the Absolute Error?`,
      options: opts.map(o => o.text),
      correctAnswer: opts.findIndex(o => o.isCorrect),
      explanation: `Absolute Error = |True - Approx| = |${trueVal.toFixed(2)} - ${approxVal.toFixed(2)}| = ${err.toFixed(2)}.`
    };
  },
  // 6. Math - Relative Error
  () => {
    const trueVal = randInt(50, 500);
    const absErr = randInt(1, 10);
    const approxVal = trueVal + absErr;
    const relErr = (absErr / trueVal) * 100;
    
    const opts = shuffle([
      { text: relErr.toFixed(2) + "%", isCorrect: true },
      { text: absErr.toFixed(2) + "%", isCorrect: false },
      { text: (relErr / 100).toFixed(4) + "%", isCorrect: false },
      { text: ((absErr / approxVal) * 100).toFixed(2) + "%", isCorrect: false }
    ]);

    return {
      question: `If the true value is ${trueVal} and the approximation is ${approxVal}, what is the True Percentage Relative Error?`,
      options: opts.map(o => o.text),
      correctAnswer: opts.findIndex(o => o.isCorrect),
      explanation: `Relative Error = (|True - Approx| / True) * 100 = (${absErr} / ${trueVal}) * 100 = ${relErr.toFixed(2)}%.`
    };
  },
  // 7. Conceptual - Secant
  () => {
    const iters = randInt(3, 8);
    return {
      question: `In the Secant method, how many initial guesses are required to start the algorithm?`,
      options: ["Zero", "One", "Two", "Three"],
      correctAnswer: 2,
      explanation: "The Secant method approximates the derivative by drawing a secant line through two recent points, so it strictly requires two initial guesses."
    };
  },
  // 8. Math - Determinant 2x2
  () => {
    const a = randInt(-5, 5); const b = randInt(-5, 5);
    const c = randInt(-5, 5); const d = randInt(-5, 5);
    const det = a*d - b*c;
    
    const opts = shuffle([
      { text: det.toString(), isCorrect: true },
      { text: (a*c - b*d).toString(), isCorrect: false },
      { text: (a*b - c*d).toString(), isCorrect: false },
      { text: (Math.abs(det) + 1).toString(), isCorrect: false }
    ]);

    return {
      question: `Calculate the determinant of the matrix: [[${a}, ${b}], [${c}, ${d}]].`,
      options: opts.map(o => o.text),
      correctAnswer: opts.findIndex(o => o.isCorrect),
      explanation: `The determinant of a 2x2 matrix is (ad - bc). Here: (${a})(${d}) - (${b})(${c}) = ${det}.`
    };
  },
  // 9. Conceptual - Gauss
  () => {
    return {
      question: "In numerical linear algebra, what is the primary purpose of Partial Pivoting in Gauss Elimination?",
      options: ["To speed up calculation", "To reduce round-off errors and avoid division by zero", "To make the matrix symmetric", "To calculate the determinant faster"],
      correctAnswer: 1,
      explanation: "Partial pivoting (swapping rows so the largest element is the pivot) avoids division by zero and minimizes the amplification of round-off errors."
    };
  },
  // 10. Math - Newton next step
  () => {
    // Let f(x) = x^2 - C. f'(x) = 2x.
    // x_{n+1} = x_n - (x_n^2 - C)/(2x_n)
    const C = randInt(2, 20);
    const x0 = randInt(1, 10);
    const fx = x0*x0 - C;
    const dfx = 2*x0;
    const x1 = x0 - fx/dfx;
    
    const opts = shuffle([
      { text: x1.toFixed(3), isCorrect: true },
      { text: (x0 - dfx/fx).toFixed(3), isCorrect: false },
      { text: (x0 + fx/dfx).toFixed(3), isCorrect: false },
      { text: (fx/dfx).toFixed(3), isCorrect: false }
    ]);

    return {
      question: `Use one step of the Newton-Raphson method for f(x) = x^2 - ${C} with an initial guess x_0 = ${x0}. What is x_1?`,
      options: opts.map(o => o.text),
      correctAnswer: opts.findIndex(o => o.isCorrect),
      explanation: `x_1 = x_0 - f(x_0)/f'(x_0). f(${x0}) = ${fx}, f'(${x0}) = ${dfx}. So x_1 = ${x0} - (${fx}/${dfx}) = ${x1.toFixed(3)}.`
    };
  },
  // 11. Math - Fixed Point Next Step
  () => {
    const a = randInt(2, 5);
    const b = randInt(1, 10);
    const x0 = randInt(1, 5);
    const x1 = a * x0 + b;

    const opts = shuffle([
      { text: x1.toString(), isCorrect: true },
      { text: (x1 + a).toString(), isCorrect: false },
      { text: (x1 - b).toString(), isCorrect: false },
      { text: (x0 * x0).toString(), isCorrect: false }
    ]);

    return {
      question: `Consider the fixed-point iteration function g(x) = ${a}x + ${b}. If x_0 = ${x0}, what is x_1?`,
      options: opts.map(o => o.text),
      correctAnswer: opts.findIndex(o => o.isCorrect),
      explanation: `x_1 is simply g(x_0). g(${x0}) = ${a}(${x0}) + ${b} = ${x1}.`
    };
  },
  // 12. Conceptual - Cramer
  () => {
    return {
      question: "Why is Cramer's Rule generally not used for very large systems of linear equations (e.g., 100x100)?",
      options: ["It requires computing O(N!) determinants, which is computationally explosive.", "It is less accurate than bisection.", "It only works for symmetric matrices.", "It cannot handle negative numbers."],
      correctAnswer: 0,
      explanation: "Cramer's Rule requires calculating N+1 determinants of size N. Since standard determinant calculation scales with N!, it is completely unfeasible for large systems compared to O(N^3) Gaussian elimination."
    };
  }
];

export function generateQuiz(count = 10): Question[] {
  // We want to generate 'count' questions. 
  // We shuffle the generators and execute them. Since some are mathematical, they produce unique outputs every time.
  const selected = [];
  for (let i = 0; i < count; i++) {
    // Pick a random generator
    const gen = generators[randInt(0, generators.length - 1)];
    const q = gen();
    selected.push({
      id: `q_${Date.now()}_${i}_${Math.random().toString(36).substring(7)}`,
      ...q
    });
  }
  return selected;
}
