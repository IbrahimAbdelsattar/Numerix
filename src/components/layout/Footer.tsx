import { Sigma } from "lucide-react";

export function Footer() {
  return (
    <footer className="border-t border-white/5 bg-background/50">
      <div className="container py-1 px-4 flex items-center justify-between text-[10px] text-muted-foreground">
        <div className="flex items-center gap-1">
          <Sigma className="w-3 h-3 text-primary" />
          <span className="font-medium">NumeriX</span>
        </div>
        <span>© {new Date().getFullYear()}</span>
      </div>
    </footer>
  );
}
