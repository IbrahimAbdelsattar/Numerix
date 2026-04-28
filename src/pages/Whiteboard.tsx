import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { PageShell } from "@/components/layout/PageShell";
import { 
  Pencil, 
  Square, 
  Circle, 
  Eraser, 
  Trash2, 
  Download, 
  Undo2, 
  Type,
  MousePointer2,
  ChevronRight
} from "lucide-react";
import { toast } from "sonner";

type Tool = "pencil" | "rect" | "circle" | "eraser" | "text" | "select";

export default function Whiteboard() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const contextRef = useRef<CanvasRenderingContext2D | null>(null);
  
  const [isDrawing, setIsDrawing] = useState(false);
  const [tool, setTool] = useState<Tool>("pencil");
  const [color, setColor] = useState("#3B82F6");
  const [lineWidth, setLineWidth] = useState(3);
  
  const [startPos, setStartPos] = useState({ x: 0, y: 0 });
  const [history, setHistory] = useState<ImageData[]>([]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    // Set display size
    const rect = canvas.getBoundingClientRect();
    canvas.width = rect.width * 2;
    canvas.height = rect.height * 2;
    canvas.style.width = `${rect.width}px`;
    canvas.style.height = `${rect.height}px`;

    const context = canvas.getContext("2d");
    if (context) {
      context.scale(2, 2);
      context.lineCap = "round";
      context.lineJoin = "round";
      context.strokeStyle = color;
      context.lineWidth = lineWidth;
      contextRef.current = context;
      
      // Fill background
      context.fillStyle = "#050A14";
      context.fillRect(0, 0, canvas.width, canvas.height);
      
      // Save initial state
      setHistory([context.getImageData(0, 0, canvas.width, canvas.height)]);
    }
    
    const handleResize = () => {
      // Basic resize handling - would ideally save/restore content
      const newRect = canvas.getBoundingClientRect();
      const tempContent = context?.getImageData(0, 0, canvas.width, canvas.height);
      canvas.width = newRect.width * 2;
      canvas.height = newRect.height * 2;
      canvas.style.width = `${newRect.width}px`;
      canvas.style.height = `${newRect.height}px`;
      context?.scale(2, 2);
      if (tempContent) context?.putImageData(tempContent, 0, 0);
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    if (contextRef.current) {
      contextRef.current.strokeStyle = tool === "eraser" ? "#050A14" : color;
      contextRef.current.lineWidth = lineWidth;
    }
  }, [color, lineWidth, tool]);

  const saveToHistory = () => {
    const canvas = canvasRef.current;
    const ctx = contextRef.current;
    if (canvas && ctx) {
      const data = ctx.getImageData(0, 0, canvas.width, canvas.height);
      setHistory(prev => [...prev.slice(-19), data]);
    }
  };

  const startDrawing = ({ nativeEvent }: React.MouseEvent | React.TouchEvent) => {
    const { offsetX, offsetY } = getCoordinates(nativeEvent);
    
    if (tool === "text") {
      const text = prompt("Enter text:");
      if (text && contextRef.current) {
        contextRef.current.fillStyle = color;
        contextRef.current.font = `${lineWidth * 5}px Inter`;
        contextRef.current.fillText(text, offsetX, offsetY);
        saveToHistory();
      }
      return;
    }

    setStartPos({ x: offsetX, y: offsetY });
    setIsDrawing(true);
    
    if (tool === "pencil" || tool === "eraser") {
      contextRef.current?.beginPath();
      contextRef.current?.moveTo(offsetX, offsetY);
    }
  };

  const draw = ({ nativeEvent }: React.MouseEvent | React.TouchEvent) => {
    if (!isDrawing || !contextRef.current) return;
    const { offsetX, offsetY } = getCoordinates(nativeEvent);

    if (tool === "pencil" || tool === "eraser") {
      contextRef.current.lineTo(offsetX, offsetY);
      contextRef.current.stroke();
    } else if (tool === "rect" || tool === "circle") {
      // Preview logic would require a separate layer or re-drawing from history
      // For simplicity in this lab, we'll draw on mouseUp for shapes
    }
  };

  const stopDrawing = ({ nativeEvent }: React.MouseEvent | React.TouchEvent) => {
    if (!isDrawing || !contextRef.current) return;
    const { offsetX, offsetY } = getCoordinates(nativeEvent);

    if (tool === "rect") {
      contextRef.current.strokeRect(startPos.x, startPos.y, offsetX - startPos.x, offsetY - startPos.y);
    } else if (tool === "circle") {
      const radius = Math.sqrt(Math.pow(offsetX - startPos.x, 2) + Math.pow(offsetY - startPos.y, 2));
      contextRef.current.beginPath();
      contextRef.current.arc(startPos.x, startPos.y, radius, 0, 2 * Math.PI);
      contextRef.current.stroke();
    }

    contextRef.current.closePath();
    setIsDrawing(false);
    saveToHistory();
  };

  const getCoordinates = (event: any) => {
    if (event.touches) {
      const rect = canvasRef.current?.getBoundingClientRect();
      return {
        offsetX: event.touches[0].clientX - (rect?.left || 0),
        offsetY: event.touches[0].clientY - (rect?.top || 0)
      };
    }
    return { offsetX: event.offsetX, offsetY: event.offsetY };
  };

  const clear = () => {
    const canvas = canvasRef.current;
    const ctx = contextRef.current;
    if (canvas && ctx) {
      ctx.fillStyle = "#050A14";
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      saveToHistory();
      toast.success("Canvas cleared");
    }
  };

  const undo = () => {
    if (history.length <= 1) return;
    const newHistory = [...history];
    newHistory.pop(); // Remove current
    const lastState = newHistory[newHistory.length - 1];
    contextRef.current?.putImageData(lastState, 0, 0);
    setHistory(newHistory);
  };

  const download = () => {
    const canvas = canvasRef.current;
    if (canvas) {
      const link = document.createElement("a");
      link.download = "numerix-whiteboard.png";
      link.href = canvas.toDataURL();
      link.click();
    }
  };

  return (
    <PageShell noFooter>
      <div className="container pt-24 pb-6 flex flex-col h-[calc(100vh-2rem)]">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-primary flex items-center justify-center shadow-glow">
              <Pencil className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold">Interactive Whiteboard</h1>
              <p className="text-xs text-muted-foreground">Draft your numerical proofs and sketches</p>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <button onClick={undo} className="btn-ghost-glow p-2 rounded-lg" title="Undo"><Undo2 className="w-4 h-4" /></button>
            <button onClick={clear} className="btn-ghost-glow p-2 rounded-lg text-destructive hover:text-destructive" title="Clear All"><Trash2 className="w-4 h-4" /></button>
            <button onClick={download} className="btn-gradient px-4 py-2 rounded-lg text-sm flex items-center gap-2">
              <Download className="w-4 h-4" /> Save
            </button>
          </div>
        </div>

        <div className="flex-1 flex gap-4 overflow-hidden">
          {/* Toolbar */}
          <aside className="glass w-16 p-3 flex flex-col gap-4 items-center">
            {[
              { id: "pencil", icon: Pencil },
              { id: "rect", icon: Square },
              { id: "circle", icon: Circle },
              { id: "text", icon: Type },
              { id: "eraser", icon: Eraser },
              { id: "select", icon: MousePointer2 },
            ].map(t => (
              <button
                key={t.id}
                onClick={() => setTool(t.id as Tool)}
                className={`w-10 h-10 rounded-lg flex items-center justify-center transition-all ${tool === t.id ? "bg-primary text-white shadow-glow" : "text-muted-foreground hover:bg-white/5"}`}
              >
                <t.icon className="w-5 h-5" />
              </button>
            ))}
            
            <div className="mt-auto flex flex-col gap-3 items-center">
              <div className="w-8 h-8 rounded-full border border-white/20 overflow-hidden relative cursor-pointer group">
                <input 
                  type="color" 
                  value={color} 
                  onChange={e => setColor(e.target.value)}
                  className="absolute inset-0 opacity-0 cursor-pointer"
                />
                <div className="absolute inset-0" style={{ backgroundColor: color }} />
              </div>
              <input 
                type="range" 
                min="1" max="20" 
                value={lineWidth} 
                onChange={e => setLineWidth(parseInt(e.target.value))}
                className="w-12 h-1 bg-white/10 rounded-full appearance-none cursor-pointer accent-primary"
              />
            </div>
          </aside>

          {/* Canvas Area */}
          <div className="flex-1 glass relative rounded-2xl border border-white/10 overflow-hidden cursor-crosshair">
            <canvas
              ref={canvasRef}
              onMouseDown={startDrawing}
              onMouseMove={draw}
              onMouseUp={stopDrawing}
              onMouseOut={stopDrawing}
              onTouchStart={startDrawing}
              onTouchMove={draw}
              onTouchEnd={stopDrawing}
              className="w-full h-full"
            />
          </div>
        </div>
      </div>
    </PageShell>
  );
}
