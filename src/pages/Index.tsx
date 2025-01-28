import { Card } from "@/components/ui/card";
import { ComparableAnalysis } from "@/components/ComparableAnalysis";
import { BatchDataOperations } from "@/components/shared/BatchDataOperations";
import { FinancialMetrics } from "@/components/shared/FinancialMetrics";
import { Dashboard } from "@/components/dashboard/Dashboard";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

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
                <li><strong>Options:</strong> Options pricing and analysis tools</li>
              </ul>
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="tools">
            <AccordionTrigger>Using Professional Tools</AccordionTrigger>
            <AccordionContent>
              <ul className="list-disc pl-6 space-y-2">
                <li><strong>Comparable Analysis:</strong> Compare key metrics across similar companies</li>
                <li><strong>Financial Metrics:</strong> Calculate and analyze important financial ratios</li>
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
