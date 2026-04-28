import { useParams, Navigate, Link } from "react-router-dom";
import { PageShell } from "@/components/layout/PageShell";
import { getMethod } from "@/lib/numerical/methods";
import { ChevronLeft, Terminal, AlertTriangle, Lightbulb } from "lucide-react";
import ReactMarkdown from "react-markdown";
import remarkMath from "remark-math";
import rehypeKatex from "rehype-katex";

// A mock database of textbook content for the methods
const TEXTBOOK_DB: Record<string, any> = {
  "bisection": {
    intuition: "Imagine looking for a word in a physical dictionary. You open it to the middle. If the word you want comes alphabetically *before* the page you opened to, you know it must be in the first half of the book. You can completely ignore the second half. You then open the first half to *its* middle, and repeat the process. This is exactly what the Bisection method does to find a root.",
    theory: "By the **Intermediate Value Theorem**, if a continuous function $f(x)$ has values of opposite signs at the endpoints of an interval $[a, b]$ (i.e., $f(a) \\cdot f(b) < 0$), then there must be at least one root $c$ in $(a, b)$ such that $f(c) = 0$. The method repeatedly cuts the interval in half: $$x_r = \\frac{x_l + x_u}{2}$$",
    pseudoCode: `function bisection(f, xl, xu, tol):
  if f(xl) * f(xu) >= 0:
    return ERROR "No bracket"
    
  while (xu - xl) / 2 > tol:
    xr = (xl + xu) / 2
    
    if f(xr) == 0:
      return xr
    else if f(xl) * f(xr) < 0:
      xu = xr
    else:
      xl = xr
      
  return (xl + xu) / 2`,
    mistakes: "The most common mistake is choosing initial guesses $x_l$ and $x_u$ that do not bracket a root, meaning $f(x_l) \\cdot f(x_u) > 0$. The method cannot start without a valid bracket.",
  },
  "newton-raphson": {
    intuition: "Imagine you are sliding down a hill blindfolded, trying to find the bottom. At your current position, you feel the slope of the ground beneath your feet. You assume the hill is a straight line following that exact slope, and you walk down that imaginary line until you hit the bottom. You then check your true position on the hill and repeat. Because curves are locally straight, this works extremely well.",
    theory: "Newton's method is derived from the first-order Taylor series expansion. The tangent line at $(x_n, f(x_n))$ has the equation $y - f(x_n) = f'(x_n)(x - x_n)$. To find the root of this tangent line, we set $y = 0$ and solve for $x_{n+1}$: $$x_{n+1} = x_n - \\frac{f(x_n)}{f'(x_n)}$$",
    pseudoCode: `function newtonRaphson(f, df, x0, tol):
  xn = x0
  
  for i = 1 to maxIter:
    fx = f(xn)
    dfx = df(xn)
    
    if dfx == 0:
      return ERROR "Derivative is zero"
      
    xn_new = xn - (fx / dfx)
    
    if abs(xn_new - xn) < tol:
      return xn_new
      
    xn = xn_new
    
  return ERROR "Did not converge"`,
    mistakes: "Newton's method can fail spectacularly if $f'(x_n) \\approx 0$ (a horizontal tangent, throwing the next guess to infinity), or if it gets caught in an infinite cycle between two points. It is highly sensitive to the initial guess $x_0$.",
  }
};

export default function MethodPage() {
  const { id } = useParams<{ id: string }>();
  const method = id ? getMethod(id as any) : null;
  const content = id ? TEXTBOOK_DB[id] || TEXTBOOK_DB["bisection"] : null; // Fallback for demo

  if (!method) return <Navigate to="/learn" />;

  return (
    <PageShell>
      <div className="container py-8 max-w-4xl space-y-12">
        {/* Header */}
        <div className="space-y-6">
          <Link to="/learn" className="inline-flex items-center gap-1 text-xs text-muted-foreground hover:text-primary transition">
            <ChevronLeft className="w-3 h-3" /> Back to Learn Hub
          </Link>
          
          <div className="flex items-center gap-5">
            <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${method.color} flex items-center justify-center shadow-glow-lg`}>
              <method.icon className="w-8 h-8 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-3 mb-1">
                <h1 className="text-3xl font-bold">{method.name}</h1>
                <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-primary/10 text-primary border border-primary/20">
                  {method.convergence}
                </span>
              </div>
              <p className="text-muted-foreground">{method.description}</p>
            </div>
          </div>
        </div>

        {/* Content Sections */}
        <div className="space-y-16">
          
          <section className="space-y-4">
            <h2 className="text-xl font-bold flex items-center gap-2 border-b border-white/10 pb-2">
              <Lightbulb className="w-5 h-5 text-yellow-400" /> 1. Intuition
            </h2>
            <div className="prose prose-invert max-w-none text-muted-foreground leading-relaxed">
              <ReactMarkdown>{content.intuition}</ReactMarkdown>
            </div>
          </section>

          <section className="space-y-4">
            <h2 className="text-xl font-bold flex items-center gap-2 border-b border-white/10 pb-2">
              <span className="font-serif italic text-blue-400">f(x)</span> 2. Theory & Derivation
            </h2>
            <div className="glass p-6 prose prose-invert max-w-none prose-p:text-muted-foreground text-sm">
              <ReactMarkdown remarkPlugins={[remarkMath]} rehypePlugins={[rehypeKatex]}>
                {content.theory}
              </ReactMarkdown>
            </div>
          </section>

          <section className="space-y-4">
            <h2 className="text-xl font-bold flex items-center gap-2 border-b border-white/10 pb-2">
              <Terminal className="w-5 h-5 text-emerald-400" /> 3. Algorithm & Pseudo-code
            </h2>
            <div className="rounded-xl overflow-hidden border border-white/10">
              <div className="bg-white/[0.02] px-4 py-2 border-b border-white/10 text-xs font-mono text-muted-foreground">
                algorithm.pseudo
              </div>
              <pre className="p-4 overflow-x-auto text-sm font-mono text-blue-300">
                <code>{content.pseudoCode}</code>
              </pre>
            </div>
          </section>

          <section className="space-y-4">
            <h2 className="text-xl font-bold flex items-center gap-2 border-b border-white/10 pb-2 text-red-400">
              <AlertTriangle className="w-5 h-5" /> 4. Common Mistakes & Failure Cases
            </h2>
            <div className="bg-red-500/10 border border-red-500/20 p-5 rounded-xl text-red-400/90 text-sm leading-relaxed">
              <ReactMarkdown remarkPlugins={[remarkMath]} rehypePlugins={[rehypeKatex]}>
                {content.mistakes}
              </ReactMarkdown>
            </div>
          </section>

          <div className="flex justify-center pt-8">
            <Link to="/solver" className="btn-gradient px-8 py-3 rounded-xl font-bold text-lg shadow-glow hover:shadow-glow-lg transition">
              Try {method.name} in Solver Lab →
            </Link>
          </div>

        </div>
      </div>
    </PageShell>
  );
}
