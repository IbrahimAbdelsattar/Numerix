import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight, ChevronDown, Sparkles, Zap, Layers, BarChart3, GraduationCap, Crosshair, BookOpen, FileText, Sliders, Trophy } from "lucide-react";
import { HeroScene } from "@/components/three/HeroScene";
import { PageShell } from "@/components/layout/PageShell";
import { LINEAR_METHODS, ROOT_METHODS } from "@/lib/numerical/methods";
import { useState } from "react";

const features = [
  { icon: Sliders, title: "Step Playback Engine", desc: "Watch every iteration execute. Forward. Backward. Pause." },
  { icon: Trophy, title: "Root-Finding Race Mode", desc: "Run all methods simultaneously. Watch who wins." },
  { icon: Layers, title: "3D Convergence Visualizer", desc: "See convergence as an animated 3D trajectory." },
  { icon: BarChart3, title: "Analytics Dashboard", desc: "MATLAB-grade metrics: error decay, stability, convergence order." },
  { icon: GraduationCap, title: "Interactive Quizzes", desc: "Test your knowledge with adaptive quiz questions and instant feedback." },
  { icon: Crosshair, title: "Error Geometry Lab", desc: "Visualize absolute, relative, and truncation error interactively." },
  { icon: BookOpen, title: "Interactive Deep Dives", desc: "Per-method textbook pages with live sliders and animations." },
  { icon: FileText, title: "PDF Export", desc: "Generate professional solution sheets in one click." },
  { icon: Zap, title: "Equation Playground", desc: "Live graphing with coefficient sliders — like Desmos, but smarter." },
];

const stats = [
  { v: "9", label: "Methods Covered" },
  { v: "Step", label: "Playback Engine" },
  { v: "Quiz", label: "Knowledge Test" },
  { v: "3D", label: "Convergence Viz" },
];

export default function Landing() {
  const [tab, setTab] = useState<"root" | "linear">("root");
  const list = tab === "root" ? ROOT_METHODS : LINEAR_METHODS;

  return (
    <PageShell>
      {/* HERO */}
      <section className="relative min-h-[92vh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 -z-10">
          <HeroScene className="!absolute inset-0" />
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-background/30 to-background pointer-events-none" />
        </div>

        <div className="container relative z-10 text-center py-24">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-primary/30 bg-primary/10 text-primary text-xs font-medium mb-6">
            <Sparkles className="w-3.5 h-3.5" /> Numerical Analysis
          </motion.div>


          <motion.h1 initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.1 }}
            className="text-7xl md:text-9xl font-extrabold tracking-tight gradient-text leading-none">
            NumeriX
          </motion.h1>

          <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }}
            className="mt-4 text-2xl md:text-3xl font-semibold text-foreground/90">
            Numerical Analysis Virtual Lab
          </motion.p>

          <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.55 }}
            className="mt-6 max-w-2xl mx-auto text-base md:text-lg text-muted-foreground text-balance">
            Solve, visualize, and master every numerical method. From root-finding races to 3D convergence trajectories — this is numerical analysis reimagined.
          </motion.p>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.7 }}
            className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link to="/solver" className="btn-gradient pulse-glow group">
              Launch Solver Lab <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link to="/learn" className="btn-ghost-glow">
              Explore Methods <ArrowRight className="w-4 h-4" />
            </Link>
          </motion.div>

          <motion.div initial="hidden" animate="show"
            variants={{ hidden: {}, show: { transition: { staggerChildren: 0.1, delayChildren: 0.9 } } }}
            className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-3 max-w-3xl mx-auto">
            {stats.map(s => (
              <motion.div key={s.label} variants={{ hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0 } }}
                className="glass px-4 py-4">
                <div className="text-2xl font-bold gradient-text">{s.v}</div>
                <div className="text-xs text-muted-foreground mt-0.5">{s.label}</div>
              </motion.div>
            ))}
          </motion.div>
        </div>

        <motion.div animate={{ y: [0, 10, 0] }} transition={{ duration: 2, repeat: Infinity }}
          className="absolute bottom-6 left-1/2 -translate-x-1/2 text-muted-foreground">
          <ChevronDown className="w-6 h-6" />
        </motion.div>
      </section>

      {/* FEATURES */}
      <section className="py-24 relative">
        <div className="container">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
            className="text-center max-w-3xl mx-auto mb-14">
            <h2 className="text-4xl md:text-5xl font-extrabold tracking-tight">
              Everything you need to <span className="gradient-text">master numerical analysis</span>
            </h2>
            <p className="mt-4 text-muted-foreground">A complete toolkit for solving, visualizing, learning, and teaching.</p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {features.map((f, i) => (
              <motion.div key={f.title}
                initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
                transition={{ delay: (i % 3) * 0.08 }}
                className="glow-card p-6 group">
                <div className="w-11 h-11 rounded-xl bg-gradient-primary flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <f.icon className="w-5 h-5 text-white" />
                </div>
                <h3 className="font-bold text-lg">{f.title}</h3>
                <p className="text-sm text-muted-foreground mt-1.5">{f.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* METHOD PREVIEW */}
      <section className="py-24 relative">
        <div className="absolute inset-0 neon-grid opacity-30 pointer-events-none" />
        <div className="container relative">
          <motion.h2 initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
            className="text-4xl md:text-5xl font-extrabold text-center tracking-tight">
            9 methods. <span className="gradient-text">One unified platform.</span>
          </motion.h2>

          <div className="mt-8 flex justify-center">
            <div className="glass p-1 inline-flex rounded-xl">
              <button onClick={() => setTab("root")}
                className={`px-4 py-2 text-sm font-medium rounded-lg transition ${tab === "root" ? "bg-gradient-primary text-white" : "text-muted-foreground"}`}>
                Root-Finding Methods
              </button>
              <button onClick={() => setTab("linear")}
                className={`px-4 py-2 text-sm font-medium rounded-lg transition ${tab === "linear" ? "bg-gradient-primary text-white" : "text-muted-foreground"}`}>
                Linear System Methods
              </button>
            </div>
          </div>

          <div className="mt-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
            {list.map((m, i) => (
              <motion.div key={m.id}
                initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
                className="glow-card p-5">
                <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${m.color} flex items-center justify-center mb-3`}>
                  <m.icon className="w-5 h-5 text-white" />
                </div>
                <h3 className="font-bold">{m.name}</h3>
                <p className="text-xs text-muted-foreground mt-1">{m.description}</p>
                <div className="mt-3 inline-flex items-center gap-1.5 text-[10px] font-medium px-2 py-0.5 rounded-full bg-white/5 border border-white/10">
                  <span className="w-1.5 h-1.5 rounded-full bg-gradient-primary" />
                  {m.convergence}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* RACE TEASER */}
      <section className="py-24">
        <div className="container">
          <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
            className="relative overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-br from-card to-background p-10 md:p-16">
            <div className="absolute inset-0 neon-grid opacity-40 pointer-events-none" />
            <div className="absolute -top-20 -right-20 w-80 h-80 rounded-full bg-primary/20 blur-3xl" />
            <div className="absolute -bottom-20 -left-20 w-80 h-80 rounded-full bg-secondary/20 blur-3xl" />

            <div className="relative grid md:grid-cols-2 gap-10 items-center">
              <div>
                <h2 className="text-4xl md:text-5xl font-extrabold tracking-tight text-balance">
                  Watch the race <span className="gradient-text">unfold in real time.</span>
                </h2>
                <p className="mt-4 text-muted-foreground">
                  Run Bisection, False Position, Newton-Raphson, and Secant side-by-side. See exactly how convergence rates compare on the same problem.
                </p>
                <Link to="/compare" className="btn-gradient mt-6 inline-flex">
                  Try Race Mode <ArrowRight className="w-4 h-4" />
                </Link>
              </div>

              <div className="space-y-3">
                {[{ n: "Newton-Raphson", p: 92, c: "from-violet-500 to-fuchsia-500" },
                  { n: "Secant", p: 78, c: "from-fuchsia-500 to-pink-500" },
                  { n: "False Position", p: 55, c: "from-cyan-500 to-emerald-500" },
                  { n: "Bisection", p: 38, c: "from-blue-500 to-cyan-500" },
                ].map((b, i) => (
                  <motion.div key={b.n} initial={{ opacity: 0, x: 30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}
                    transition={{ delay: i * 0.1 }} className="glass p-3">
                    <div className="flex justify-between text-xs mb-1.5">
                      <span className="font-semibold">{b.n}</span>
                      <span className="text-muted-foreground">{b.p}%</span>
                    </div>
                    <div className="h-2 rounded-full bg-white/5 overflow-hidden">
                      <motion.div initial={{ width: 0 }} whileInView={{ width: `${b.p}%` }} viewport={{ once: true }}
                        transition={{ duration: 1.4, delay: i * 0.1 + 0.2 }}
                        className={`h-full bg-gradient-to-r ${b.c}`} />
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </section>
    </PageShell>
  );
}
