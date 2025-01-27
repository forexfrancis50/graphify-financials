import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { MetricsCard } from "@/components/shared/MetricsCard";
import {
  TrendingUp,
  Percent,
  DollarSign,
  Scale,
  Activity,
  Clock,
} from "lucide-react";

interface FinancialMetricsProps {
  data: {
    revenue: number;
    ebitda: number;
    netIncome: number;
    totalAssets: number;
    totalLiabilities: number;
    currentAssets: number;
    currentLiabilities: number;
    inventory: number;
    receivables: number;
    payables: number;
    operatingCashFlow: number;
    capex: number;
  };
}

export function FinancialMetrics({ data }: FinancialMetricsProps) {
  // Profitability Ratios
  const ebitdaMargin = (data.ebitda / data.revenue) * 100;
  const netProfitMargin = (data.netIncome / data.revenue) * 100;
  const roa = (data.netIncome / data.totalAssets) * 100;
  
  // Liquidity Ratios
  const currentRatio = data.currentAssets / data.currentLiabilities;
  const quickRatio = (data.currentAssets - data.inventory) / data.currentLiabilities;
  const cashRatio = (data.currentAssets - data.inventory - data.receivables) / data.currentLiabilities;
  
  // Efficiency Ratios
  const assetTurnover = data.revenue / data.totalAssets;
  const receivablesDays = (data.receivables / data.revenue) * 365;
  const payablesDays = (data.payables / data.revenue) * 365;
  const inventoryTurnover = data.revenue / data.inventory;
  
  // Cash Flow Metrics
  const fcf = data.operatingCashFlow - data.capex;
  const fcfMargin = (fcf / data.revenue) * 100;
  
  // Leverage Ratios
  const debtToEquity = data.totalLiabilities / (data.totalAssets - data.totalLiabilities);
  const interestCoverage = data.ebitda / (data.totalLiabilities * 0.05); // Assuming 5% interest rate

  return (
    <Card className="p-6">
      <h2 className="text-2xl font-bold mb-6">Financial Metrics & Ratios</h2>
      
      <Tabs defaultValue="profitability" className="w-full">
        <TabsList className="grid w-full grid-cols-2 lg:grid-cols-5">
          <TabsTrigger value="profitability">Profitability</TabsTrigger>
          <TabsTrigger value="liquidity">Liquidity</TabsTrigger>
          <TabsTrigger value="efficiency">Efficiency</TabsTrigger>
          <TabsTrigger value="cashflow">Cash Flow</TabsTrigger>
          <TabsTrigger value="leverage">Leverage</TabsTrigger>
        </TabsList>

        <TabsContent value="profitability" className="mt-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <MetricsCard
              title="EBITDA Margin"
              value={`${ebitdaMargin.toFixed(2)}%`}
              icon={TrendingUp}
              description="Earnings before interest, taxes, depreciation, and amortization margin"
            />
            <MetricsCard
              title="Net Profit Margin"
              value={`${netProfitMargin.toFixed(2)}%`}
              icon={Percent}
              description="Net income as a percentage of revenue"
            />
            <MetricsCard
              title="Return on Assets"
              value={`${roa.toFixed(2)}%`}
              icon={DollarSign}
              description="Net income relative to total assets"
            />
          </div>
        </TabsContent>

        <TabsContent value="liquidity" className="mt-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <MetricsCard
              title="Current Ratio"
              value={currentRatio.toFixed(2)}
              icon={Scale}
              description="Current assets divided by current liabilities"
            />
            <MetricsCard
              title="Quick Ratio"
              value={quickRatio.toFixed(2)}
              icon={Scale}
              description="Current assets less inventory divided by current liabilities"
            />
            <MetricsCard
              title="Cash Ratio"
              value={cashRatio.toFixed(2)}
              icon={Scale}
              description="Cash and equivalents divided by current liabilities"
            />
          </div>
        </TabsContent>

        <TabsContent value="efficiency" className="mt-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <MetricsCard
              title="Asset Turnover"
              value={assetTurnover.toFixed(2)}
              icon={Activity}
              description="Revenue generated per dollar of assets"
            />
            <MetricsCard
              title="Days Receivables"
              value={receivablesDays.toFixed(0)}
              icon={Clock}
              description="Average days to collect receivables"
            />
            <MetricsCard
              title="Days Payables"
              value={payablesDays.toFixed(0)}
              icon={Clock}
              description="Average days to pay suppliers"
            />
          </div>
        </TabsContent>

        <TabsContent value="cashflow" className="mt-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <MetricsCard
              title="Free Cash Flow"
              value={`$${(fcf / 1000000).toFixed(2)}M`}
              icon={DollarSign}
              description="Operating cash flow less capital expenditures"
            />
            <MetricsCard
              title="FCF Margin"
              value={`${fcfMargin.toFixed(2)}%`}
              icon={Percent}
              description="Free cash flow as a percentage of revenue"
            />
            <MetricsCard
              title="Inventory Turnover"
              value={inventoryTurnover.toFixed(2)}
              icon={Activity}
              description="Revenue divided by average inventory"
            />
          </div>
        </TabsContent>

        <TabsContent value="leverage" className="mt-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <MetricsCard
              title="Debt to Equity"
              value={debtToEquity.toFixed(2)}
              icon={Scale}
              description="Total liabilities divided by shareholders' equity"
            />
            <MetricsCard
              title="Interest Coverage"
              value={interestCoverage.toFixed(2)}
              icon={Scale}
              description="EBITDA divided by interest expense"
            />
          </div>
        </TabsContent>
      </Tabs>
    </Card>
  );
}