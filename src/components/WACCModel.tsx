
import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { MetricsCard } from "@/components/shared/MetricsCard";
import { Percent } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export function WACCModel() {
  const [equityWeight, setEquityWeight] = useState(60);
  const [debtWeight, setDebtWeight] = useState(40);
  const [costOfEquity, setCostOfEquity] = useState(10);
  const [costOfDebt, setCostOfDebt] = useState(5);
  const [taxRate, setTaxRate] = useState(21);
  const [wacc, setWacc] = useState(0);
  const { toast } = useToast();

  const calculateWACC = () => {
    try {
      if (equityWeight + debtWeight !== 100) {
        throw new Error("Weights must sum to 100%");
      }

      const waccValue = 
        (equityWeight / 100) * (costOfEquity / 100) +
        (debtWeight / 100) * (costOfDebt / 100) * (1 - taxRate / 100);

      setWacc(waccValue * 100);

      toast({
        title: "Calculation Complete",
        description: `WACC: ${(waccValue * 100).toFixed(2)}%`,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Invalid calculation",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="space-y-6">
      <Card className="p-6">
        <h2 className="text-2xl font-bold mb-6">WACC Calculator</h2>
        
        <div className="grid gap-6 md:grid-cols-2">
          <div className="space-y-4">
            <div>
              <Label htmlFor="equity-weight">Equity Weight (%)</Label>
              <Input
                id="equity-weight"
                type="number"
                value={equityWeight}
                onChange={(e) => setEquityWeight(Number(e.target.value))}
                min="0"
                max="100"
              />
            </div>
            
            <div>
              <Label htmlFor="debt-weight">Debt Weight (%)</Label>
              <Input
                id="debt-weight"
                type="number"
                value={debtWeight}
                onChange={(e) => setDebtWeight(Number(e.target.value))}
                min="0"
                max="100"
              />
            </div>

            <div>
              <Label htmlFor="cost-equity">Cost of Equity (%)</Label>
              <Input
                id="cost-equity"
                type="number"
                value={costOfEquity}
                onChange={(e) => setCostOfEquity(Number(e.target.value))}
                min="0"
              />
            </div>

            <div>
              <Label htmlFor="cost-debt">Cost of Debt (%)</Label>
              <Input
                id="cost-debt"
                type="number"
                value={costOfDebt}
                onChange={(e) => setCostOfDebt(Number(e.target.value))}
                min="0"
              />
            </div>

            <div>
              <Label htmlFor="tax-rate">Tax Rate (%)</Label>
              <Input
                id="tax-rate"
                type="number"
                value={taxRate}
                onChange={(e) => setTaxRate(Number(e.target.value))}
                min="0"
                max="100"
              />
            </div>

            <Button onClick={calculateWACC} className="w-full">
              Calculate WACC
            </Button>
          </div>

          <div className="space-y-6">
            <MetricsCard
              title="WACC"
              value={`${wacc.toFixed(2)}%`}
              description="Weighted Average Cost of Capital"
              icon={Percent}
            />

            <div className="p-4 bg-muted rounded-lg">
              <h3 className="font-medium mb-2">How to use this calculator:</h3>
              <ol className="list-decimal list-inside space-y-1 text-sm">
                <li>Enter the weights for equity and debt (must sum to 100%)</li>
                <li>Input the cost of equity (e.g., from CAPM)</li>
                <li>Input the cost of debt (e.g., interest rate)</li>
                <li>Enter the corporate tax rate</li>
                <li>Click "Calculate WACC" to get the result</li>
              </ol>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}
