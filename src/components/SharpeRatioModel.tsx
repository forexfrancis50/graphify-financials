
import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { MetricsCard } from "@/components/shared/MetricsCard";
import { DataChart } from "@/components/shared/DataChart";
import { LineChart } from "lucide-react";

export function SharpeRatioModel() {
  const [returns, setReturns] = useState("");
  const [riskFreeRate, setRiskFreeRate] = useState(0.02);
  const [sharpeRatio, setSharpeRatio] = useState(0);
  const [excessReturn, setExcessReturn] = useState(0);
  const [error, setError] = useState<string | null>(null);

  const calculateSharpeRatio = () => {
    try {
      setError(null);
      const returnValues = returns.split("\n").map(Number).filter(n => !isNaN(n));
      
      if (returnValues.length < 2) {
        throw new Error("Need at least 2 return observations to calculate Sharpe ratio");
      }

      const meanReturn = returnValues.reduce((a, b) => a + b, 0) / returnValues.length;
      const excess = meanReturn - riskFreeRate;
      
      const variance = returnValues.reduce((acc, val) => 
        acc + Math.pow(val - meanReturn, 2), 0) / returnValues.length;
      const stdDev = Math.sqrt(variance);
      
      if (stdDev === 0) {
        throw new Error("Standard deviation cannot be zero");
      }

      const sharpe = excess / stdDev;
      
      setSharpeRatio(sharpe);
      setExcessReturn(excess);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error calculating Sharpe ratio");
      setSharpeRatio(0);
      setExcessReturn(0);
    }
  };

  const handleRiskFreeRateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = Number(e.target.value);
    if (value >= 0 && value <= 1) {
      setRiskFreeRate(value);
    }
  };

  const chartData = returns.split("\n").map((ret, index) => ({
    index,
    return: Number(ret) * 100,
    riskFree: riskFreeRate * 100
  })).filter(d => !isNaN(d.return));

  return (
    <div className="space-y-6">
      <Card className="p-6">
        <h2 className="text-2xl font-bold mb-6">Sharpe Ratio Calculator</h2>
        
        <div className="grid gap-6 md:grid-cols-2">
          <div className="space-y-4">
            <div>
              <Label htmlFor="returns">Portfolio Returns (one per line)</Label>
              <textarea
                id="returns"
                className="w-full min-h-[200px] p-2 border rounded mt-1"
                value={returns}
                onChange={(e) => setReturns(e.target.value)}
                placeholder="Enter decimal values, one per line&#10;Example:&#10;0.02&#10;-0.01&#10;0.03"
              />
              <p className="text-sm text-muted-foreground mt-1">
                Enter returns as decimals (e.g., 0.05 for 5%)
              </p>
            </div>
            
            <div>
              <Label htmlFor="risk-free-rate">Risk-Free Rate</Label>
              <Input
                id="risk-free-rate"
                type="number"
                step="0.001"
                min="0"
                max="1"
                value={riskFreeRate}
                onChange={handleRiskFreeRateChange}
                className="mt-1"
              />
              <p className="text-sm text-muted-foreground mt-1">
                Enter as decimal (e.g., 0.02 for 2%)
              </p>
            </div>

            <Button onClick={calculateSharpeRatio}>Calculate Sharpe Ratio</Button>
          </div>

          <div className="space-y-6">
            {error && (
              <div className="bg-destructive/15 text-destructive p-3 rounded-md">
                {error}
              </div>
            )}
            
            <MetricsCard
              title="Sharpe Ratio"
              value={sharpeRatio.toFixed(2)}
              description="Risk-adjusted return measure"
              icon={LineChart}
            />
            
            <MetricsCard
              title="Excess Return"
              value={`${(excessReturn * 100).toFixed(2)}%`}
              description="Return above risk-free rate"
              icon={LineChart}
            />

            <div className="p-4 bg-muted rounded-lg">
              <h3 className="font-medium mb-2">How to use this calculator:</h3>
              <ol className="list-decimal list-inside space-y-1 text-sm">
                <li>Enter historical portfolio returns (one per line)</li>
                <li>Set the risk-free rate (e.g., Treasury bill rate)</li>
                <li>Click "Calculate Sharpe Ratio" to see results</li>
              </ol>
            </div>
          </div>
        </div>
      </Card>

      {chartData.length > 0 && (
        <DataChart
          data={chartData}
          type="line"
          xKey="index"
          yKey="return"
          title="Portfolio Returns vs Risk-Free Rate"
          height={300}
        />
      )}
    </div>
  );
}
