import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { BatchDataOperations } from "@/components/shared/BatchDataOperations";
import {
  Calculator,
  LineChart,
  GitMerge,
  Scissors,
  DollarSign,
  Rocket,
  Briefcase,
  Binary,
  ArrowRight,
  TrendingUp,
} from "lucide-react";

const modelCards = [
  {
    title: "DCF Valuation",
    description: "Discounted Cash Flow analysis for company valuation",
    icon: Calculator,
    route: "/dcf",
    gradient: "from-blue-500 to-cyan-500",
  },
  {
    title: "LBO Analysis",
    description: "Leveraged Buyout modeling and analysis",
    icon: LineChart,
    route: "/lbo",
    gradient: "from-purple-500 to-pink-500",
  },
  {
    title: "M&A Modeling",
    description: "Merger & Acquisition analysis tools",
    icon: GitMerge,
    route: "/ma",
    gradient: "from-green-500 to-emerald-500",
  },
  {
    title: "Restructuring",
    description: "Corporate restructuring and reorganization tools",
    icon: Scissors,
    route: "/restructuring",
    gradient: "from-red-500 to-orange-500",
  },
  {
    title: "DDM Analysis",
    description: "Dividend Discount Model for equity valuation",
    icon: DollarSign,
    route: "/ddm",
    gradient: "from-yellow-500 to-orange-500",
  },
  {
    title: "Accretion/Dilution",
    description: "M&A transaction impact analysis",
    icon: TrendingUp,
    route: "/accretion-dilution",
    gradient: "from-indigo-500 to-purple-500",
  },
  {
    title: "IPO Modeling",
    description: "Initial Public Offering analysis tools",
    icon: Rocket,
    route: "/ipo",
    gradient: "from-pink-500 to-rose-500",
  },
  {
    title: "Capital Budgeting",
    description: "Investment project evaluation tools",
    icon: Briefcase,
    route: "/capital-budgeting",
    gradient: "from-teal-500 to-emerald-500",
  },
  {
    title: "Options Pricing",
    description: "Advanced options valuation models",
    icon: Binary,
    route: "/options",
    gradient: "from-violet-500 to-purple-500",
  },
];

const Index = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background p-6 animate-fade-in">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Hero Section */}
        <section className="text-center space-y-4 mb-12">
          <h1 className="text-4xl font-bold text-primary">
            Professional Financial Modeling Suite
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Comprehensive tools for financial analysis, valuation, and strategic decision-making
          </p>
        </section>

        {/* Batch Data Operations */}
        <BatchDataOperations />

        {/* Quick Access Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {modelCards.map((model) => (
            <Card
              key={model.route}
              className="relative overflow-hidden group hover:shadow-lg transition-shadow duration-300"
            >
              <div
                className={`absolute inset-0 opacity-10 bg-gradient-to-br ${model.gradient}`}
              />
              <div className="relative p-6 space-y-4">
                <div className="flex items-center space-x-4">
                  <div className={`p-2 rounded-lg bg-gradient-to-br ${model.gradient}`}>
                    <model.icon className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-xl font-semibold">{model.title}</h3>
                </div>
                <p className="text-muted-foreground">{model.description}</p>
                <Button
                  variant="ghost"
                  className="group-hover:translate-x-2 transition-transform duration-300"
                  onClick={() => navigate(model.route)}
                >
                  Launch Model
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </div>
            </Card>
          ))}
        </div>

        {/* Features Section */}
        <section className="mt-16 text-center space-y-8">
          <h2 className="text-3xl font-bold text-primary">Key Features</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="p-6">
              <h3 className="text-xl font-semibold mb-4">Professional Analysis</h3>
              <p className="text-muted-foreground">
                Industry-standard financial models and calculations for accurate analysis
              </p>
            </Card>
            <Card className="p-6">
              <h3 className="text-xl font-semibold mb-4">Interactive Tools</h3>
              <p className="text-muted-foreground">
                Dynamic inputs and real-time calculations for efficient modeling
              </p>
            </Card>
            <Card className="p-6">
              <h3 className="text-xl font-semibold mb-4">Comprehensive Suite</h3>
              <p className="text-muted-foreground">
                Complete set of financial modeling tools for various scenarios
              </p>
            </Card>
          </div>
        </section>
      </div>
    </div>
  );
};

export default Index;