import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, useParams } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import Cadastro from "./pages/Cadastro";
import Login from "./pages/Login";
import AgentDetailPage from "./pages/AgentDetailPage";
import { AgentsPage } from "./components/AgentsPage";
import React from "react";
import HistoryPage from "./pages/HistoryPage";
import Comunidade from "./pages/Comunidade";
import Sugestoes from "./pages/Sugestoes";
import Video from "./pages/Video";
import Imagem from "./pages/Imagem";
import Configuracao from "./pages/Configuracao";
import Landing from "./pages/Landing";

// Wrapper para passar o id da URL como prop agentId
const AgentDetailWrapper = () => {
  const { id } = useParams();
  return <AgentDetailPage agentId={id} onBack={() => window.history.back()} />;
};

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/agentes" element={<AgentsPage />} />
          <Route path="/cadastro" element={<Cadastro />} />
          <Route path="/login" element={<Login />} />
          <Route path="/agente/:id" element={<AgentDetailWrapper />} />
          <Route path="/historico" element={<HistoryPage />} />
          <Route path="/comunidade" element={<Comunidade />} />
          <Route path="/sugestoes" element={<Sugestoes />} />
          <Route path="/video" element={<Video />} />
          <Route path="/imagem" element={<Imagem />} />
          <Route path="/configuracao" element={<Configuracao />} />
          <Route path="/landing" element={<Landing />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
