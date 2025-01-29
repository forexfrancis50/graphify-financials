import { ComparableAnalysis } from "@/components/ComparableAnalysis";
import { BatchDataOperations } from "@/components/shared/BatchDataOperations";
import { FinancialMetrics } from "@/components/shared/FinancialMetrics";
import { Card } from "@/components/ui/card";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Calculator, FileSpreadsheet, Briefcase, LineChart, Building2 } from "lucide-react";
import { DataTable } from "@/components/shared/DataTable";

const sampleFinancialData = {
  revenue: 1000000000,
  ebitda: 20000000,
  netIncome: 10000000,
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

const leverageMetrics = [
  {
    metric: "Senior Debt / EBITDA",
    value: "3.5x",
    benchmark: "< 4.0x",
    status: "Good"
  },
  {
    metric: "Total Debt / EBITDA",
    value: "4.8x",
    benchmark: "< 5.0x",
    status: "Good"
  },
  {
    metric: "Interest Coverage Ratio",
    value: "3.2x",
    benchmark: "> 3.0x",
    status: "Good"
  },
  {
    metric: "Fixed Charge Coverage",
    value: "2.8x",
    benchmark: "> 2.5x",
    status: "Good"
  }
];

const workingCapitalMetrics = [
  {
    metric: "Days Sales Outstanding",
    value: "45 days",
    benchmark: "< 50 days",
    status: "Good"
  },
  {
    metric: "Days Inventory Outstanding",
    value: "32 days",
    benchmark: "< 35 days",
    status: "Good"
  },
  {
    metric: "Days Payable Outstanding",
    value: "38 days",
    benchmark: "> 35 days",
    status: "Good"
  },
  {
    metric: "Cash Conversion Cycle",
    value: "39 days",
    benchmark: "< 45 days",
    status: "Good"
  }
];

export default function Index() {
  return (
    <div className="container mx-auto p-6 space-y-8">
      <section className="text-center space-y-4">
        <h1 className="text-4xl font-bold">Financial Analysis Suite</h1>
        <p className="text-xl text-muted-foreground">
          Professional tools for private equity analysis and valuation
        </p>
      </section>

      {/* User Guide Section */}
      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">Getting Started Guide</h2>
        <Accordion type="single" collapsible className="w-full">
          <AccordionItem value="navigation">
            <AccordionTrigger>Navigation Guide</AccordionTrigger>
            <AccordionContent>
              <ul className="list-disc pl-6 space-y-2">
                <li>Use the sidebar on the left to navigate between different financial models</li>
                <li>Click on any model name to access its specific tools and features</li>
                <li>You can always return to this dashboard by clicking "Dashboard" in the sidebar</li>
              </ul>
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="models">
            <AccordionTrigger>Available Models</AccordionTrigger>
            <AccordionContent>
              <ul className="list-disc pl-6 space-y-2">
                <li><strong>DCF Model:</strong> Discounted Cash Flow analysis for company valuation</li>
                <li><strong>LBO Model:</strong> Leveraged Buyout analysis for acquisition scenarios</li>
                <li><strong>M&A Model:</strong> Merger and Acquisition analysis tools</li>
                <li><strong>Restructuring:</strong> Tools for company restructuring analysis</li>
                <li><strong>DDM Model:</strong> Dividend Discount Model for equity valuation</li>
              </ul>
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="tools">
            <AccordionTrigger>Using Professional Tools</AccordionTrigger>
            <AccordionContent>
              <ul className="list-disc pl-6 space-y-2">
                <li><strong>Comparable Analysis:</strong> Compare key metrics across similar companies</li>
                <li><strong>Financial Metrics:</strong> Calculate and analyze important financial ratios</li>
                <li><strong>Working Capital Analysis:</strong> Track and optimize working capital metrics</li>
                <li><strong>Leverage Analysis:</strong> Monitor debt levels and coverage ratios</li>
                <li><strong>Batch Operations:</strong> Process multiple data sets simultaneously</li>
                <li>All tools support data export to Excel and PDF formats</li>
              </ul>
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="tips">
            <AccordionTrigger>Pro Tips</AccordionTrigger>
            <AccordionContent>
              <ul className="list-disc pl-6 space-y-2">
                <li>Use the export buttons to save your analysis in Excel or PDF format</li>
                <li>Input data is automatically saved as you work</li>
                <li>Compare results across different models for comprehensive analysis</li>
                <li>Check the metrics dashboard for quick insights into your models</li>
              </ul>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </section>

      <div className="grid grid-cols-1 gap-8">
        <section>
          <h2 className="text-2xl font-semibold mb-6">Professional Tools</h2>
          
          {/* Leverage Analysis */}
          <div className="mb-8">
            <Card className="p-6">
              <div className="flex items-center gap-2 mb-4">
                <Building2 className="h-5 w-5" />
                <h3 className="text-xl font-semibold">Leverage Analysis</h3>
              </div>
              <DataTable
                data={leverageMetrics}
                columns={[
                  { key: "metric", header: "Metric" },
                  { key: "value", header: "Value" },
                  { key: "benchmark", header: "Benchmark" },
                  { key: "status", header: "Status" }
                ]}
              />
            </Card>
          </div>

          {/* Working Capital Analysis */}
          <div className="mb-8">
            <Card className="p-6">
              <div className="flex items-center gap-2 mb-4">
                <LineChart className="h-5 w-5" />
                <h3 className="text-xl font-semibold">Working Capital Analysis</h3>
              </div>
              <DataTable
                data={workingCapitalMetrics}
                columns={[
                  { key: "metric", header: "Metric" },
                  { key: "value", header: "Value" },
                  { key: "benchmark", header: "Benchmark" },
                  { key: "status", header: "Status" }
                ]}
              />
            </Card>
          </div>

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