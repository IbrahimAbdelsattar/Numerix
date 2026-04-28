import { PageShell } from "@/components/layout/PageShell";
import { AbsoluteErrorVisualizer } from "@/components/learn/ErrorGeometry/AbsoluteErrorVisualizer";
import { RelativeErrorVisualizer } from "@/components/learn/ErrorGeometry/RelativeErrorVisualizer";
import { TruncationErrorVisualizer } from "@/components/learn/ErrorGeometry/TruncationErrorVisualizer";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { TriangleRight, Compass, Scissors } from "lucide-react";

export default function ErrorGeometry() {
  return (
    <PageShell>
      <div className="container py-10 max-w-4xl space-y-8">
        <div className="flex items-center gap-4 border-b border-white/10 pb-6">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center shadow-glow">
            <TriangleRight className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold gradient-text">Error Geometry Lab</h1>
            <p className="text-sm text-muted-foreground mt-1">Interactive visualizations to build intuition for absolute, relative, and truncation errors.</p>
          </div>
        </div>

        <Tabs defaultValue="absolute" className="w-full">
          <TabsList className="w-full justify-start border-b border-white/10 rounded-none bg-transparent h-auto p-0 space-x-6">
            <TabsTrigger value="absolute" className="data-[state=active]:bg-transparent data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none px-0 pb-3 text-muted-foreground data-[state=active]:text-foreground">
              <Compass className="w-4 h-4 mr-2" />
              Absolute Error
            </TabsTrigger>
            <TabsTrigger value="relative" className="data-[state=active]:bg-transparent data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none px-0 pb-3 text-muted-foreground data-[state=active]:text-foreground">
              <Compass className="w-4 h-4 mr-2" />
              Relative Error
            </TabsTrigger>
            <TabsTrigger value="truncation" className="data-[state=active]:bg-transparent data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none px-0 pb-3 text-muted-foreground data-[state=active]:text-foreground">
              <Scissors className="w-4 h-4 mr-2" />
              Truncation Error
            </TabsTrigger>
          </TabsList>
          
          <div className="mt-8">
            <TabsContent value="absolute">
              <div className="space-y-6">
                <div className="prose prose-invert max-w-none text-sm text-muted-foreground">
                  <p><strong>Absolute Error</strong> is the simple difference between the exact mathematical value and our computed approximation. It measures "how far off" we are in raw units.</p>
                </div>
                <div className="glass p-6">
                  <AbsoluteErrorVisualizer />
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="relative">
              <div className="space-y-6">
                <div className="prose prose-invert max-w-none text-sm text-muted-foreground">
                  <p><strong>Relative Error</strong> normalizes the absolute error against the true value. It tells us how significant the error is relative to the size of the thing we are measuring.</p>
                </div>
                <RelativeErrorVisualizer />
              </div>
            </TabsContent>
            
            <TabsContent value="truncation">
              <div className="space-y-6">
                <div className="prose prose-invert max-w-none text-sm text-muted-foreground">
                  <p><strong>Truncation Error</strong> occurs when we approximate an infinite mathematical process (like a Taylor series) by stopping after a finite number of steps. Watch how adding more terms reduces the truncation error.</p>
                </div>
                <TruncationErrorVisualizer />
              </div>
            </TabsContent>
          </div>
        </Tabs>
      </div>
    </PageShell>
  );
}
