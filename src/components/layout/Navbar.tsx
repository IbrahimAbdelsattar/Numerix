import { Link, NavLink, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, Sigma, BookOpen, FlaskConical, Trophy, Beaker, BrainCircuit, Pencil, User } from "lucide-react";
import { useState, useEffect } from "react";
import { useAppMode } from "@/state/AppContext";
import { Switch } from "@/components/ui/switch";

const links = [
  { to: "/solver", label: "Solver", icon: FlaskConical },
  { to: "/learn", label: "Learn", icon: BookOpen },
  { to: "/compare", label: "Compare", icon: Trophy },
  { to: "/quiz", label: "Quiz", icon: BrainCircuit },
  { to: "/whiteboard", label: "Whiteboard", icon: Pencil },
  { to: "/labs", label: "Labs", icon: Beaker },
  { to: "/developer", label: "Developer", icon: User },
];

export function Navbar() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { mode, toggleMode } = useAppMode();
  const loc = useLocation();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const isHome = loc.pathname === '/';
  
  // For home page, we use a fully transparent header unless scrolled.
  // For other pages, we use a glass header.
  const headerClass = isHome
    ? `fixed top-0 inset-x-0 z-50 transition-all duration-300 bg-transparent border-transparent ${scrolled ? "py-1" : "py-3"}`
    : `fixed top-0 inset-x-0 z-50 transition-all duration-300 backdrop-blur-xl bg-background/60 border-b border-white/5 py-3`;

  return (
    <header className={headerClass}>
      <div className="container flex items-center justify-between h-14">
        <Link to="/" className="flex items-center gap-2 group">
          <div className="relative">
            <Sigma className="w-7 h-7 text-primary group-hover:rotate-12 transition-transform" />
            <div className="absolute inset-0 blur-md bg-primary/40 -z-10 group-hover:bg-primary/60 transition" />
          </div>
          <span className="font-extrabold text-xl tracking-tight gradient-text">NumeriX</span>
        </Link>

        <nav className="hidden md:flex items-center gap-1">
          {links.map(l => (
            <NavLink key={l.to} to={l.to}
              className={({ isActive }) =>
                `relative px-4 py-2 text-sm font-medium rounded-lg transition-colors ${isActive ? "text-primary" : "text-muted-foreground hover:text-foreground"}`
              }>
              {({ isActive }) => (
                <>
                  <span className="flex items-center gap-1.5"><l.icon className="w-4 h-4" />{l.label}</span>
                  {isActive && (
                    <motion.div layoutId="nav-underline" className="absolute -bottom-px left-2 right-2 h-0.5 bg-gradient-primary rounded-full" />
                  )}
                </>
              )}
            </NavLink>
          ))}
        </nav>

        <div className="hidden md:flex items-center gap-3">
          {/* Removed Toggle and GitHub as requested */}
        </div>

        <button className="md:hidden p-2 rounded-lg hover:bg-white/5" onClick={() => setOpen(o => !o)}>
          {open ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      <AnimatePresence>
        {open && (
          <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }}
            className="md:hidden overflow-hidden border-t border-white/5 bg-background/95 backdrop-blur-xl">
            <div className="container py-4 flex flex-col gap-1">
              {links.map(l => (
                <NavLink key={l.to} to={l.to} onClick={() => setOpen(false)}
                  className={({ isActive }) => `flex items-center gap-2 px-3 py-3 rounded-lg ${isActive ? "bg-primary/10 text-primary" : "text-muted-foreground"}`}>
                  <l.icon className="w-4 h-4" />{l.label}
                </NavLink>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
