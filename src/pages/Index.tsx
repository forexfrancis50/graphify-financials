import { Card } from "@/components/ui/card";
import { ComparableAnalysis } from "@/components/ComparableAnalysis";
import { BatchDataOperations } from "@/components/shared/BatchDataOperations";
import { FinancialMetrics } from "@/components/shared/FinancialMetrics";
import { Dashboard } from "@/components/dashboard/Dashboard";

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

export default function Index() {
  return (
    <div className="container mx-auto p-6 space-y-8">
      <section className="text-center space-y-4">
        <h1 className="text-4xl font-bold">Financial Analysis Suite</h1>
        <p className="text-xl text-muted-foreground">
          Professional tools for financial analysis and valuation
        </p>
      </section>

      <div className="grid grid-cols-1 gap-8">
        {/* Professional Tools Section */}
        <section>
          <h2 className="text-2xl font-semibold mb-6">Professional Tools</h2>
          
          {/* Comparable Company Analysis */}
          <div className="mb-8">
            <ComparableAnalysis />
          </div>

          {/* Financial Metrics */}
          <div className="mb-8">
            <Card className="p-6">
              <h3 className="text-xl font-semibold mb-4">Financial Metrics</h3>
              <FinancialMetrics data={sampleFinancialData} />
            </Card>
          </div>

          {/* Batch Data Operations */}
          <div>
            <BatchDataOperations />
          </div>
        </section>
      </div>
    </div>
  );
}