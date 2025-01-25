import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "./components/AppSidebar";
import Index from "./pages/Index";
import DCF from "./pages/DCF";
import LBO from "./pages/LBO";
import MA from "./pages/MA";
import Restructuring from "./pages/Restructuring";
import DDM from "./pages/DDM";
import AccretionDilution from "./pages/AccretionDilution";
import IPO from "./pages/IPO";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <SidebarProvider>
          <div className="min-h-screen flex w-full">
            <AppSidebar />
            <main className="flex-1">
              <Routes>
                <Route path="/" element={<Index />} />
                <Route path="/dcf" element={<DCF />} />
                <Route path="/lbo" element={<LBO />} />
                <Route path="/ma" element={<MA />} />
                <Route path="/restructuring" element={<Restructuring />} />
                <Route path="/ddm" element={<DDM />} />
                <Route path="/accretion-dilution" element={<AccretionDilution />} />
                <Route path="/ipo" element={<IPO />} />
              </Routes>
            </main>
          </div>
        </SidebarProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;