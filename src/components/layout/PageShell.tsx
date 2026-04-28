import { ReactNode } from "react";
import { Navbar } from "./Navbar";
import { Footer } from "./Footer";
import { motion } from "framer-motion";
import { useLocation } from "react-router-dom";

export function PageShell({ children, noFooter = false }: { children: ReactNode; noFooter?: boolean }) {
  const loc = useLocation();
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className={`flex-1 ${loc.pathname === '/' ? '' : 'pt-16'}`}>
        <motion.div
          key={loc.pathname}
          initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease: "easeOut" }}>
          {children}
        </motion.div>
      </main>
      {!noFooter && <Footer />}
    </div>
  );
}
