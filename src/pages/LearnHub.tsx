import { PageShell } from "@/components/layout/PageShell";
import { METHODS } from "@/lib/numerical/methods";
import { BookOpen, ChevronRight } from "lucide-react";
import { Link } from "react-router-dom";

export default function LearnHub() {
  return (
    <PageShell>
      <div className="container py-10 max-w-5xl space-y-12">
        <div className="flex items-center gap-4 border-b border-white/10 pb-6">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center shadow-glow">
            <BookOpen className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold gradient-text">Learn Hub</h1>
            <p className="text-sm text-muted-foreground mt-1">Interactive textbook chapters for every numerical method.</p>
          </div>
        </div>

        {/* Specialized Labs */}
        <div className="space-y-4">
          <h2 className="text-sm font-bold uppercase tracking-wider text-muted-foreground">Interactive Concepts</h2>
          <div className="grid md:grid-cols-2 gap-4">
            <Link to="/learn/error-geometry" className="glow-card p-6 group hover:border-primary/50 transition">
              <h3 className="text-lg font-bold text-foreground group-hover:text-primary transition flex items-center justify-between">
                Error Geometry Lab <ChevronRight className="w-5 h-5 opacity-50 group-hover:opacity-100" />
              </h3>
              <p className="text-sm text-muted-foreground mt-2">Visually explore Absolute, Relative, and Truncation errors with interactive number lines and Taylor series.</p>
            </Link>
            <Link to="/learn/playground" className="glow-card p-6 group hover:border-primary/50 transition">
              <h3 className="text-lg font-bold text-foreground group-hover:text-primary transition flex items-center justify-between">
                Equation Playground <ChevronRight className="w-5 h-5 opacity-50 group-hover:opacity-100" />
              </h3>
              <p className="text-sm text-muted-foreground mt-2">A sandbox graphing calculator to build intuition for polynomial roots and derivatives.</p>
            </Link>
          </div>
        </div>

        {/* Methods Grid */}
        <div className="space-y-6">
          <h2 className="text-sm font-bold uppercase tracking-wider text-muted-foreground">Method Deep Dives</h2>
          
          <div className="space-y-4">
            <h3 className="text-lg font-semibold border-b border-white/10 pb-2">Root-Finding Methods</h3>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {METHODS.filter(m => m.category === "root-finding").map(m => (
                <MethodCard key={m.id} method={m} />
              ))}
            </div>
          </div>

          <div className="space-y-4 pt-6">
            <h3 className="text-lg font-semibold border-b border-white/10 pb-2">Linear System Methods</h3>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {METHODS.filter(m => m.category === "linear-systems").map(m => (
                <MethodCard key={m.id} method={m} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </PageShell>
  );
}

function MethodCard({ method }: { method: any }) {
  return (
    <Link to={`/learn/${method.id}`} className="glow-card p-5 group hover:border-primary/50 transition-all hover:-translate-y-1">
      <div className="flex items-start justify-between mb-4">
        <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${method.color} flex items-center justify-center`}>
          <method.icon className="w-5 h-5 text-white" />
        </div>
        <div className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-white/5 border border-white/10">
          {method.convergence}
        </div>
      </div>
      <h4 className="font-bold text-foreground group-hover:text-primary transition">{method.name}</h4>
      <p className="text-xs text-muted-foreground mt-2 line-clamp-2">{method.description}</p>
    </Link>
  );
}
