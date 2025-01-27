import { Card } from "@/components/ui/card";
import { MetricsCard } from "@/components/shared/MetricsCard";
import { DataTable } from "@/components/shared/DataTable";
import { AlertTriangle, TrendingDown, Shield, Activity } from "lucide-react";

interface RiskMetric {
  category: string;
  value: number;
  threshold: number;
  status: "low" | "medium" | "high";
}

interface RiskAssessmentProps {
  financialData: {
    currentRatio: number;
    quickRatio: number;
    debtToEquity: number;
    interestCoverage: number;
    operatingMargin: number;
    returnOnEquity: number;
    betaValue: number;
    volatility: number;
  };
}

export function RiskAssessment({ financialData }: RiskAssessmentProps) {
  const riskMetrics: RiskMetric[] = [
    {
      category: "Liquidity Risk",
      value: financialData.currentRatio,
      threshold: 2.0,
      status: financialData.currentRatio < 1.5 ? "high" : 
              financialData.currentRatio < 2.0 ? "medium" : "low"
    },
    {
      category: "Credit Risk",
      value: financialData.debtToEquity,
      threshold: 1.0,
      status: financialData.debtToEquity > 2.0 ? "high" :
              financialData.debtToEquity > 1.0 ? "medium" : "low"
    },
    {
      category: "Market Risk",
      value: financialData.betaValue,
      threshold: 1.0,
      status: financialData.betaValue > 1.5 ? "high" :
              financialData.betaValue > 1.0 ? "medium" : "low"
    },
    {
      category: "Operational Risk",
      value: financialData.operatingMargin,
      threshold: 0.15,
      status: financialData.operatingMargin < 0.10 ? "high" :
              financialData.operatingMargin < 0.15 ? "medium" : "low"
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "high":
        return "text-red-500";
      case "medium":
        return "text-yellow-500";
      case "low":
        return "text-green-500";
      default:
        return "text-gray-500";
    }
  };

  const riskIndicators = [
    {
      title: "Overall Risk Score",
      value: "Medium",
      icon: AlertTriangle,
      description: "Composite risk assessment based on all metrics",
      trend: {
        direction: "up" as const,
        value: "+2.5%"
      }
    },
    {
      title: "Volatility",
      value: `${(financialData.volatility * 100).toFixed(1)}%`,
      icon: TrendingDown,
      description: "30-day price volatility"
    },
    {
      title: "Risk Coverage",
      value: `${(financialData.interestCoverage).toFixed(2)}x`,
      icon: Shield,
      description: "Interest coverage ratio"
    },
    {
      title: "Market Sensitivity",
      value: financialData.betaValue.toFixed(2),
      icon: Activity,
      description: "Beta relative to market"
    }
  ];

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-semibold mb-4">Risk Assessment</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {riskIndicators.map((indicator, index) => (
          <MetricsCard
            key={index}
            title={indicator.title}
            value={indicator.value}
            description={indicator.description}
            icon={indicator.icon}
            trend={indicator.trend}
          />
        ))}
      </div>

      <Card className="p-6">
        <h3 className="text-xl font-semibold mb-4">Risk Metrics Analysis</h3>
        <DataTable
          columns={[
            { key: "category", header: "Risk Category" },
            { 
              key: "value", 
              header: "Current Value",
              format: (value: number) => value.toFixed(2)
            },
            { 
              key: "threshold", 
              header: "Threshold",
              format: (value: number) => value.toFixed(2)
            },
            { 
              key: "status", 
              header: "Risk Level",
              format: (value: string) => (
                <span className={`font-semibold ${getStatusColor(value)}`}>
                  {value.toUpperCase()}
                </span>
              )
            }
          ]}
          data={riskMetrics}
        />
      </Card>
    </div>
  );
}