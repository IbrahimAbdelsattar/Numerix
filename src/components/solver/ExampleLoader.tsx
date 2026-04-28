import { EXAMPLE_PROBLEMS, type MethodId } from "@/lib/numerical/methods";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { BookOpen } from "lucide-react";

interface Props {
  methodId: MethodId;
  onLoad: (params: Record<string, any>) => void;
}

export function ExampleLoader({ methodId, onLoad }: Props) {
  const examples = EXAMPLE_PROBLEMS[methodId] || [];
  if (examples.length === 0) return null;

  return (
    <div className="flex items-center gap-2">
      <BookOpen className="w-4 h-4 text-muted-foreground shrink-0" />
      <Select
        onValueChange={(val) => {
          const ex = examples[parseInt(val)];
          if (ex) onLoad(ex.params);
        }}
      >
        <SelectTrigger className="h-8 text-xs bg-white/[0.03] border-white/10 text-muted-foreground hover:text-foreground">
          <SelectValue placeholder="Load example problem…" />
        </SelectTrigger>
        <SelectContent className="bg-card/95 backdrop-blur-xl border-white/10">
          {examples.map((ex, i) => (
            <SelectItem key={i} value={String(i)} className="text-xs">
              {ex.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
