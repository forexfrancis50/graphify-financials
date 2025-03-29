
import { FinancialDataFetcher } from "@/components/shared/FinancialDataFetcher";

export default function FinancialData() {
  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Financial Data Aggregator</h1>
      <FinancialDataFetcher />
    </div>
  );
}
