import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Card } from "@/components/ui/card";

interface SensitivityAnalysisProps {
  baseValue: number;
  discountRates: number[];
  growthRates: number[];
  calculateEnterpriseValue: (discountRate: number, growthRate: number) => number;
}

export function SensitivityAnalysis({
  baseValue,
  discountRates,
  growthRates,
  calculateEnterpriseValue,
}: SensitivityAnalysisProps) {
  return (
    <Card className="p-6">
      <h2 className="text-xl font-semibold mb-4">Sensitivity Analysis</h2>
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Growth Rate (%)</TableHead>
              {discountRates.map((rate) => (
                <TableHead key={rate}>{rate}% WACC</TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {growthRates.map((growthRate) => (
              <TableRow key={growthRate}>
                <TableCell>{growthRate}%</TableCell>
                {discountRates.map((discountRate) => (
                  <TableCell key={`${growthRate}-${discountRate}`}>
                    ${calculateEnterpriseValue(discountRate, growthRate).toLocaleString()}
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </Card>
  );
}