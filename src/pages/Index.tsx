import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { Card } from "@/components/ui/card";
import {
  ArrowRight,
  BarChart2,
  Brain,
  Calculator,
  LineChart,
  PieChart,
  Workflow,
  Lightbulb,
} from "lucide-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

export default function Index() {
  const navigate = useNavigate();

  const features = [
    {
      title: "DCF Modeling",
      description: "Build comprehensive discounted cash flow models with customizable templates and assumptions",
      icon: <Calculator className="w-6 h-6" />,
      route: "/dcf"
    },
    {
      title: "LBO Analysis",
      description: "Create leveraged buyout models with multiple scenarios and debt structures",
      icon: <LineChart className="w-6 h-6" />,
      route: "/lbo"
    },
    {
      title: "M&A Modeling",
      description: "Analyze mergers and acquisitions with detailed accretion/dilution analysis",
      icon: <PieChart className="w-6 h-6" />,
      route: "/ma"
    },
    {
      title: "Advanced Analytics",
      description: "Leverage AI-powered insights for deeper financial analysis and decision making",
      icon: <Brain className="w-6 h-6" />,
      route: "/options"
    }
  ];

  const modelingTips = [
    {
      industry: "Technology",
      tips: [
        "Focus on revenue growth rates and customer acquisition costs",
        "Consider R&D expenses as a percentage of revenue",
        "Analyze subscription-based revenue models separately",
        "Account for high initial capex but lower maintenance capex"
      ]
    },
    {
      industry: "Manufacturing",
      tips: [
        "Pay attention to working capital requirements",
        "Consider cyclical nature of capital expenditures",
        "Factor in commodity price fluctuations",
        "Analyze capacity utilization rates"
      ]
    },
    {
      industry: "Healthcare",
      tips: [
        "Account for regulatory compliance costs",
        "Consider reimbursement rates and payment cycles",
        "Analyze R&D pipeline and success rates",
        "Factor in patent expiration impacts"
      ]
    },
    {
      industry: "Retail",
      tips: [
        "Focus on same-store sales growth",
        "Consider seasonal working capital needs",
        "Analyze inventory turnover ratios",
        "Factor in e-commerce transition costs"
      ]
    },
    {
      industry: "Financial Services",
      tips: [
        "Focus on net interest margins",
        "Consider regulatory capital requirements",
        "Analyze loan loss provisions",
        "Factor in fee-based income streams"
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="py-20 px-6">
        <div className="max-w-5xl mx-auto text-center space-y-8">
          <h1 className="text-4xl md:text-6xl font-bold tracking-tight animate-fade-in">
            Professional Financial Modeling Suite
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto animate-fade-in">
            Empower your private equity analysis with advanced modeling tools, AI-driven insights,
            and professional-grade templates
          </p>
          <div className="flex gap-4 justify-center animate-fade-in">
            <Button
              size="lg"
              onClick={() => navigate("/dcf")}
              className="gap-2"
            >
              Start Modeling <ArrowRight className="w-4 h-4" />
            </Button>
            <Button
              size="lg"
              variant="outline"
              onClick={() => navigate("/ma")}
              className="gap-2"
            >
              Explore M&A Tools <BarChart2 className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-16 px-6 bg-accent/10">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">
            Comprehensive Financial Tools
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <div
                key={feature.title}
                className="p-6 rounded-lg border bg-card hover:shadow-lg transition-shadow cursor-pointer"
                onClick={() => navigate(feature.route)}
              >
                <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                <p className="text-muted-foreground">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Industry Modeling Tips */}
      <section className="py-16 px-6">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <div className="h-16 w-16 rounded-full bg-secondary/10 flex items-center justify-center mx-auto mb-6">
              <Lightbulb className="w-8 h-8 text-secondary" />
            </div>
            <h2 className="text-3xl font-bold mb-4">Industry-Specific Modeling Tips</h2>
            <p className="text-xl text-muted-foreground">
              Expert guidance for modeling different industries and company types
            </p>
          </div>
          
          <Accordion type="single" collapsible className="w-full">
            {modelingTips.map((industry, index) => (
              <AccordionItem key={industry.industry} value={`item-${index}`}>
                <AccordionTrigger className="text-lg font-semibold">
                  {industry.industry}
                </AccordionTrigger>
                <AccordionContent>
                  <ul className="list-disc pl-6 space-y-2">
                    {industry.tips.map((tip, tipIndex) => (
                      <li key={tipIndex} className="text-muted-foreground">
                        {tip}
                      </li>
                    ))}
                  </ul>
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </section>

      {/* Workflow Section */}
      <section className="py-16 px-6">
        <div className="max-w-4xl mx-auto text-center space-y-8">
          <div className="h-16 w-16 rounded-full bg-secondary/10 flex items-center justify-center mx-auto mb-8">
            <Workflow className="w-8 h-8 text-secondary" />
          </div>
          <h2 className="text-3xl font-bold">Streamlined Workflow</h2>
          <p className="text-xl text-muted-foreground">
            Our integrated suite of financial tools helps you move seamlessly from analysis to
            presentation, with professional templates and customizable outputs for every stage of
            your investment process.
          </p>
          <Button
            size="lg"
            variant="secondary"
            onClick={() => navigate("/dcf")}
            className="gap-2"
          >
            View All Tools <ArrowRight className="w-4 h-4" />
          </Button>
        </div>
      </section>
    </div>
  );
}