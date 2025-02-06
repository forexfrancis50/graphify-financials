import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { useSidebar } from "@/components/ui/sidebar";
import { useNavigate, useLocation } from "react-router-dom";
import {
  Home,
  Calculator,
  Building,
  Briefcase,
  Scale,
  Banknote,
  TrendingUp,
  ArrowUpDown,
  LineChart,
  BarChart,
  Percent,
  DollarSign,
  ChartPie,
  CircleDollarSign,
  Wallet,
  Activity
} from "lucide-react";

export function AppSidebar() {
  const { isOpen } = useSidebar();
  const navigate = useNavigate();
  const location = useLocation();

  const links = [
    { name: "Dashboard", path: "/", icon: <Home className="h-4 w-4" /> },
    { name: "DCF Model", path: "/dcf", icon: <Calculator className="h-4 w-4" /> },
    { name: "LBO Model", path: "/lbo", icon: <Building className="h-4 w-4" /> },
    { name: "M&A Model", path: "/ma", icon: <Briefcase className="h-4 w-4" /> },
    { name: "Restructuring", path: "/restructuring", icon: <Scale className="h-4 w-4" /> },
    { name: "DDM Model", path: "/ddm", icon: <Banknote className="h-4 w-4" /> },
    { name: "Accretion/Dilution", path: "/accretion-dilution", icon: <TrendingUp className="h-4 w-4" /> },
    { name: "IPO Model", path: "/ipo", icon: <ArrowUpDown className="h-4 w-4" /> },
    { name: "Capital Budgeting", path: "/capital-budgeting", icon: <LineChart className="h-4 w-4" /> },
    { name: "Options", path: "/options", icon: <BarChart className="h-4 w-4" /> },
    { name: "IRR Calculator", path: "/irr", icon: <Percent className="h-4 w-4" /> },
    { name: "NPV Calculator", path: "/npv", icon: <DollarSign className="h-4 w-4" /> },
    { name: "Break-Even Analysis", path: "/break-even", icon: <ChartPie className="h-4 w-4" /> },
    { name: "Loan Calculator", path: "/loan", icon: <CircleDollarSign className="h-4 w-4" /> },
    { name: "ROI Calculator", path: "/roi", icon: <Wallet className="h-4 w-4" /> },
    { name: "Vasicek Model", path: "/vasicek", icon: <Activity className="h-4 w-4" /> },
  ];

  return (
    <aside
      className={cn(
        "border-r bg-background h-screen sticky top-0 overflow-y-auto",
        isOpen ? "w-64" : "w-16"
      )}
    >
      <div className="space-y-4 py-4">
        <div className="px-3 py-2">
          <h2 className={cn("text-lg font-semibold", !isOpen && "sr-only")}>
            Financial Models
          </h2>
        </div>
        <nav className="space-y-1 px-2">
          {links.map((link) => (
            <Button
              key={link.path}
              variant={location.pathname === link.path ? "secondary" : "ghost"}
              className={cn(
                "w-full justify-start",
                !isOpen && "justify-center px-2"
              )}
              onClick={() => navigate(link.path)}
            >
              {link.icon}
              <span className={cn("ml-2", !isOpen && "sr-only")}>{link.name}</span>
            </Button>
          ))}
        </nav>
      </div>
    </aside>
  );
}