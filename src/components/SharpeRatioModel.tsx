
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

  const calculateSharpeRatio = () => {
    const returnValues = returns.split("\n").map(Number).filter(n => !isNaN(n));
    
    if (returnValues.length === 0) return;

    const meanReturn = returnValues.reduce((a, b) => a + b, 0) / returnValues.length;
    const excess = meanReturn - riskFreeRate;
    
    const variance = returnValues.reduce((acc, val) => 
      acc + Math.pow(val - meanReturn, 2), 0) / returnValues.length;
    const stdDev = Math.sqrt(variance);
    
    const sharpe = excess / stdDev;
    
    setSharpeRatio(sharpe);
    setExcessReturn(excess);

    return { sharpe, excess };
  };

  const handleCalculate = () => {
    calculateSharpeRatio();
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
                className="w-full min-h-[200px] p-2 border rounded"
                value={returns}
                onChange={(e) => setReturns(e.target.value)}
                placeholder="Enter returns, one per line&#10;Example:&#10;0.02&#10;-0.01&#10;0.03"
              />
            </div>
            
            <div>
              <Label htmlFor="risk-free-rate">Risk-Free Rate</Label>
              <Input
                id="risk-free-rate"
                type="number"
                step="0.001"
                value={riskFreeRate}
                onChange={(e) => setRiskFreeRate(Number(e.target.value))}
              />
            </div>

            <Button onClick={handleCalculate}>Calculate Sharpe Ratio</Button>
          </div>

          <div className="space-y-6">
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
