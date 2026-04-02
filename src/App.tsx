import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { TournamentProvider } from "@/context/TournamentContext";
import TeamBuilder from "./pages/TeamBuilder";
import SimulatePage from "./pages/SimulatePage";
import ResultsPage from "./pages/ResultsPage";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <TournamentProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<TeamBuilder />} />
            <Route path="/simulate" element={<SimulatePage />} />
            <Route path="/results" element={<ResultsPage />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TournamentProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
