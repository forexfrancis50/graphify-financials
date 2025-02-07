
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { SidebarProvider } from "@/components/ui/sidebar";
import { ModelDataProvider } from "./contexts/ModelDataContext";
import { ThemeProvider } from "./components/ThemeProvider";
import { AppSidebar } from "./components/AppSidebar";
import Index from "./pages/Index";
import DCF from "./pages/DCF";
import LBO from "./pages/LBO";
import MA from "./pages/MA";
import Restructuring from "./pages/Restructuring";
import DDM from "./pages/DDM";
import AccretionDilution from "./pages/AccretionDilution";
import IPO from "./pages/IPO";
import CapitalBudgeting from "./pages/CapitalBudgeting";
import Options from "./pages/Options";
import IRR from "./pages/IRR";
import NPV from "./pages/NPV";
import BreakEven from "./pages/BreakEven";
import Loan from "./pages/Loan";
import ROI from "./pages/ROI";
import Vasicek from "./pages/Vasicek";
import CAPM from "./pages/CAPM";
import BlackScholes from "./pages/BlackScholes";

const queryClient = new QueryClient();

const App = () => (
  <ThemeProvider defaultTheme="system" storageKey="app-theme">
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <ModelDataProvider>
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
                    <Route path="/capital-budgeting" element={<CapitalBudgeting />} />
                    <Route path="/options" element={<Options />} />
                    <Route path="/irr" element={<IRR />} />
                    <Route path="/npv" element={<NPV />} />
                    <Route path="/break-even" element={<BreakEven />} />
                    <Route path="/loan" element={<Loan />} />
                    <Route path="/roi" element={<ROI />} />
                    <Route path="/vasicek" element={<Vasicek />} />
                    <Route path="/capm" element={<CAPM />} />
                    <Route path="/black-scholes" element={<BlackScholes />} />
                  </Routes>
                </main>
              </div>
            </SidebarProvider>
          </BrowserRouter>
        </ModelDataProvider>
      </TooltipProvider>
    </QueryClientProvider>
  </ThemeProvider>
);

export default App;
