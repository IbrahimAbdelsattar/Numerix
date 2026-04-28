import { createContext, useContext, useEffect, useState, ReactNode } from "react";

type Mode = "beginner" | "professor";

interface AppCtx {
  mode: Mode;
  setMode: (m: Mode) => void;
  toggleMode: () => void;
}

const Ctx = createContext<AppCtx | null>(null);

export function AppProvider({ children }: { children: ReactNode }) {
  const [mode, setMode] = useState<Mode>(() => (localStorage.getItem("numerix.mode") as Mode) || "beginner");
  useEffect(() => { localStorage.setItem("numerix.mode", mode); }, [mode]);
  return (
    <Ctx.Provider value={{ mode, setMode, toggleMode: () => setMode(m => (m === "beginner" ? "professor" : "beginner")) }}>
      {children}
    </Ctx.Provider>
  );
}

export const useAppMode = () => {
  const v = useContext(Ctx);
  if (!v) throw new Error("useAppMode must be used inside AppProvider");
  return v;
};
