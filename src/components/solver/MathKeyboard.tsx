import { useState, useRef } from "react";
import { Keyboard } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";

const SYMBOLS = [
  { label: "sin", insert: "sin(" },
  { label: "cos", insert: "cos(" },
  { label: "tan", insert: "tan(" },
  { label: "log", insert: "log(" },
  { label: "ln", insert: "log(" },
  { label: "exp", insert: "exp(" },
  { label: "√", insert: "sqrt(" },
  { label: "π", insert: "pi" },
  { label: "e", insert: "e" },
  { label: "^", insert: "^" },
  { label: "x²", insert: "^2" },
  { label: "x³", insert: "^3" },
  { label: "(", insert: "(" },
  { label: ")", insert: ")" },
  { label: "×", insert: "*" },
  { label: "÷", insert: "/" },
  { label: "+", insert: "+" },
  { label: "−", insert: "-" },
  { label: "abs", insert: "abs(" },
  { label: "1/x", insert: "1/" },
];

interface Props {
  onInsert: (text: string) => void;
}

export function MathKeyboard({ onInsert }: Props) {
  const [open, setOpen] = useState(false);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <button
          type="button"
          className="p-2 rounded-lg border border-white/10 bg-white/[0.03] hover:bg-white/[0.06] hover:border-primary/40 transition text-muted-foreground hover:text-primary"
          title="Math symbols"
        >
          <Keyboard className="w-4 h-4" />
        </button>
      </PopoverTrigger>
      <PopoverContent
        className="w-64 p-2 bg-card/95 backdrop-blur-xl border border-white/10"
        align="start"
        sideOffset={8}
      >
        <p className="text-[10px] text-muted-foreground mb-2 px-1">Click to insert</p>
        <div className="grid grid-cols-5 gap-1">
          {SYMBOLS.map(s => (
            <button
              key={s.label}
              type="button"
              onClick={() => {
                onInsert(s.insert);
                setOpen(false);
              }}
              className="px-2 py-1.5 rounded-md text-sm font-mono bg-white/[0.04] border border-white/10 hover:bg-primary/20 hover:border-primary/40 hover:text-primary transition text-foreground"
            >
              {s.label}
            </button>
          ))}
        </div>
      </PopoverContent>
    </Popover>
  );
}
