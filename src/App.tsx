import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AppProvider } from "@/state/AppContext";
import Landing from "./pages/Landing";
import Solver from "./pages/Solver";
import CompareLab from "./pages/CompareLab";
import ErrorGeometry from "./pages/ErrorGeometry";
import LearnHub from "./pages/LearnHub";
import MethodPage from "./pages/learn/MethodPage";
import Playground from "./pages/learn/Playground";
import Whiteboard from "./pages/Whiteboard";
import Fractals from "./pages/labs/Fractals";
import Quiz from "./pages/Quiz";
import Developer from "./pages/Developer";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AppProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Landing />} />
            <Route path="/solver" element={<Solver />} />
            <Route path="/learn" element={<LearnHub />} />
            <Route path="/learn/error-geometry" element={<ErrorGeometry />} />
            <Route path="/learn/playground" element={<Playground />} />
            <Route path="/learn/:id" element={<MethodPage />} />
            <Route path="/whiteboard" element={<Whiteboard />} />
            <Route path="/compare" element={<CompareLab />} />
            <Route path="/labs/fractals" element={<Fractals />} />
            <Route path="/labs" element={<Navigate to="/labs/fractals" replace />} />
            <Route path="/quiz" element={<Quiz />} />
            <Route path="/developer" element={<Developer />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </AppProvider>
  </QueryClientProvider>
);

export default App;
