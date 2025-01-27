import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { BatchDataOperations } from "@/components/shared/BatchDataOperations";
import { FinancialMetrics } from "@/components/shared/FinancialMetrics";
import {
  Calculator,
  LineChart,
  Banknote,
  TrendingUp,
  Scale,
  Building,
  Briefcase,
  ArrowUpDown,
} from "lucide-react";

const modelCards = [
  {
    title: "DCF Model",
    description: "Discounted Cash Flow Analysis",
    icon: <Calculator className="w-6 h-6" />,
    route: "/dcf",
  },
  {
    title: "DDM Model",
    description: "Dividend Discount Model Analysis",
    icon: <Banknote className="w-6 h-6" />,
    route: "/ddm",
  },
  {
    title: "LBO Model",
    description: "Leveraged Buyout Analysis",
    icon: <Building className="w-6 h-6" />,
    route: "/lbo",
  },
  {
    title: "IPO Model",
    description: "Initial Public Offering Valuation",
    icon: <TrendingUp className="w-6 h-6" />,
    route: "/ipo",
  },
  {
    title: "M&A Model",
    description: "Mergers and Acquisitions Analysis",
    icon: <Briefcase className="w-6 h-6" />,
    route: "/ma",
  },
  {
    title: "Restructuring Model",
    description: "Financial Restructuring Analysis",
    icon: <ArrowUpDown className="w-6 h-6" />,
    route: "/restructuring",
  },
];

export default function Index() {
  const navigate = useNavigate();

  // Sample financial data for demonstration
  const sampleFinancialData = {
    revenue: 1000000000,
    ebitda: 200000000,
    netIncome: 150000000,
    totalAssets: 2000000000,
    totalLiabilities: 1000000000,
    currentAssets: 800000000,
    currentLiabilities: 400000000,
    inventory: 300000000,
    receivables: 200000000,
    payables: 150000000,
    operatingCashFlow: 250000000,
    capex: 100000000
  };

  return (
    <div className="container mx-auto p-6 space-y-8">
      {/* Hero Section */}
      <section className="text-center space-y-4">
        <h1 className="text-4xl font-bold">Financial Modeling Suite</h1>
        <p className="text-xl text-muted-foreground">
          Comprehensive tools for financial analysis and valuation
        </p>
      </section>

      {/* Financial Metrics */}
      <FinancialMetrics data={sampleFinancialData} />

      {/* Batch Data Operations */}
      <BatchDataOperations />

      {/* Quick Access Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {modelCards.map((model) => (
          <Card
            key={model.route}
            className="p-6 hover:shadow-lg transition-shadow cursor-pointer"
            onClick={() => navigate(model.route)}
          >
            <div className="flex items-center gap-4">
              <div className="p-2 rounded-lg bg-primary/10">
                {model.icon}
              </div>
              <div>
                <h3 className="font-semibold">{model.title}</h3>
                <p className="text-sm text-muted-foreground">{model.description}</p>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}