import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export function RestructuringModel() {
  const { toast } = useToast();
  const [inputs, setInputs] = useState({
    // Financial Data
    currentRevenue: 0,
    currentEBITDA: 0,
    currentDebt: 0,
    currentEquity: 0,
    
    // Asset Sales
    assetSaleProceeds: 0,
    assetSaleCosts: 0,
    
    // Debt Restructuring
    debtWriteOff: 0,
    newDebtIssuance: 0,
    interestRate: 0,
    
    // Operational Restructuring
    costReduction: 0,
    restructuringCosts: 0,
    expectedRevenueGrowth: 0,
  });

  const [results, setResults] = useState({
    postRestructuringDebt: 0,
    postRestructuringEquity: 0,
    postRestructuringEBITDA: 0,
    debtToEBITDA: 0,
    interestCoverage: 0,
  });

  const handleInputChange = (field: keyof typeof inputs, value: string) => {
    setInputs(prev => ({
      ...prev,
      [field]: parseFloat(value) || 0
    }));
  };

  const calculateRestructuring = () => {
    // Calculate post-restructuring metrics
    const postRestructuringDebt = 
      inputs.currentDebt - inputs.debtWriteOff + inputs.newDebtIssuance;
    
    const postRestructuringEBITDA = 
      inputs.currentEBITDA + inputs.costReduction * (1 + inputs.expectedRevenueGrowth / 100);
    
    const interestExpense = (postRestructuringDebt * inputs.interestRate) / 100;
    
    const postRestructuringEquity = 
      inputs.currentEquity + 
      (inputs.assetSaleProceeds - inputs.assetSaleCosts) - 
      inputs.restructuringCosts + 
      inputs.debtWriteOff;

    setResults({
      postRestructuringDebt,
      postRestructuringEquity,
      postRestructuringEBITDA,
      debtToEBITDA: postRestructuringDebt / postRestructuringEBITDA,
      interestCoverage: postRestructuringEBITDA / interestExpense,
    });

    toast({
      title: "Calculations Complete",
      description: "Restructuring analysis has been updated.",
    });
  };

  return (
    <div className="space-y-8">
      <Card className="p-6">
        <h2 className="text-2xl font-bold mb-6">Restructuring Model</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Current Financial Position */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Current Financial Position</h3>
            <div className="space-y-2">
              <Label htmlFor="currentRevenue">Current Revenue ($M)</Label>
              <Input
                id="currentRevenue"
                type="number"
                value={inputs.currentRevenue}
                onChange={(e) => handleInputChange("currentRevenue", e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="currentEBITDA">Current EBITDA ($M)</Label>
              <Input
                id="currentEBITDA"
                type="number"
                value={inputs.currentEBITDA}
                onChange={(e) => handleInputChange("currentEBITDA", e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="currentDebt">Current Debt ($M)</Label>
              <Input
                id="currentDebt"
                type="number"
                value={inputs.currentDebt}
                onChange={(e) => handleInputChange("currentDebt", e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="currentEquity">Current Equity ($M)</Label>
              <Input
                id="currentEquity"
                type="number"
                value={inputs.currentEquity}
                onChange={(e) => handleInputChange("currentEquity", e.target.value)}
              />
            </div>
          </div>

          {/* Asset Sales */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Asset Sales</h3>
            <div className="space-y-2">
              <Label htmlFor="assetSaleProceeds">Asset Sale Proceeds ($M)</Label>
              <Input
                id="assetSaleProceeds"
                type="number"
                value={inputs.assetSaleProceeds}
                onChange={(e) => handleInputChange("assetSaleProceeds", e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="assetSaleCosts">Asset Sale Costs ($M)</Label>
              <Input
                id="assetSaleCosts"
                type="number"
                value={inputs.assetSaleCosts}
                onChange={(e) => handleInputChange("assetSaleCosts", e.target.value)}
              />
            </div>
          </div>

          {/* Debt Restructuring */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Debt Restructuring</h3>
            <div className="space-y-2">
              <Label htmlFor="debtWriteOff">Debt Write-off ($M)</Label>
              <Input
                id="debtWriteOff"
                type="number"
                value={inputs.debtWriteOff}
                onChange={(e) => handleInputChange("debtWriteOff", e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="newDebtIssuance">New Debt Issuance ($M)</Label>
              <Input
                id="newDebtIssuance"
                type="number"
                value={inputs.newDebtIssuance}
                onChange={(e) => handleInputChange("newDebtIssuance", e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="interestRate">Interest Rate (%)</Label>
              <Input
                id="interestRate"
                type="number"
                value={inputs.interestRate}
                onChange={(e) => handleInputChange("interestRate", e.target.value)}
              />
            </div>
          </div>

          {/* Operational Restructuring */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Operational Restructuring</h3>
            <div className="space-y-2">
              <Label htmlFor="costReduction">Cost Reduction ($M)</Label>
              <Input
                id="costReduction"
                type="number"
                value={inputs.costReduction}
                onChange={(e) => handleInputChange("costReduction", e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="restructuringCosts">Restructuring Costs ($M)</Label>
              <Input
                id="restructuringCosts"
                type="number"
                value={inputs.restructuringCosts}
                onChange={(e) => handleInputChange("restructuringCosts", e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="expectedRevenueGrowth">Expected Revenue Growth (%)</Label>
              <Input
                id="expectedRevenueGrowth"
                type="number"
                value={inputs.expectedRevenueGrowth}
                onChange={(e) => handleInputChange("expectedRevenueGrowth", e.target.value)}
              />
            </div>
          </div>
        </div>

        <Button 
          className="mt-6"
          onClick={calculateRestructuring}
        >
          Calculate Restructuring Impact
        </Button>
      </Card>

      {/* Results Table */}
      <Card className="p-6">
        <h3 className="text-xl font-semibold mb-4">Post-Restructuring Analysis</h3>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Metric</TableHead>
              <TableHead>Value</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <TableRow>
              <TableCell>Post-Restructuring Debt ($M)</TableCell>
              <TableCell>{results.postRestructuringDebt.toFixed(2)}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell>Post-Restructuring Equity ($M)</TableCell>
              <TableCell>{results.postRestructuringEquity.toFixed(2)}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell>Post-Restructuring EBITDA ($M)</TableCell>
              <TableCell>{results.postRestructuringEBITDA.toFixed(2)}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell>Debt/EBITDA Ratio</TableCell>
              <TableCell>{results.debtToEBITDA.toFixed(2)}x</TableCell>
            </TableRow>
            <TableRow>
              <TableCell>Interest Coverage Ratio</TableCell>
              <TableCell>{results.interestCoverage.toFixed(2)}x</TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </Card>
    </div>
  );
}