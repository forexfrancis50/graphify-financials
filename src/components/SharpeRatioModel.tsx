
import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { MetricsCard } from "@/components/shared/MetricsCard";
import { DataChart } from "@/components/shared/DataChart";
import { LineChart } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export function SharpeRatioModel() {
  const [returns, setReturns] = useState<number[]>([]);
  const [currentReturn, setCurrentReturn] = useState("");
  const [riskFreeRate, setRiskFreeRate] = useState(0.02);
  const [sharpeRatio, setSharpeRatio] = useState(0);
  const [excessReturn, setExcessReturn] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const calculateSharpeRatio = () => {
    try {
      setError(null);
      
      if (returns.length < 2) {
        throw new Error("Need at least 2 return observations to calculate Sharpe ratio");
      }

      const meanReturn = returns.reduce((a, b) => a + b, 0) / returns.length;
      const excess = meanReturn - riskFreeRate;
      
      const variance = returns.reduce((acc, val) => 
        acc + Math.pow(val - meanReturn, 2), 0) / returns.length;
      const stdDev = Math.sqrt(variance);
      
      if (stdDev === 0) {
        throw new Error("Standard deviation cannot be zero");
      }

      const sharpe = excess / stdDev;
      
      setSharpeRatio(sharpe);
      setExcessReturn(excess);

      toast({
        title: "Calculation Complete",
        description: `Sharpe Ratio: ${sharpe.toFixed(2)}`,
      });
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Error calculating Sharpe ratio";
      setError(errorMessage);
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      });
      setSharpeRatio(0);
      setExcessReturn(0);
    }
  };

  const addDataPoint = () => {
    const returnValue = parseFloat(currentReturn);

    if (isNaN(returnValue)) {
      toast({
        title: "Invalid Input",
        description: "Please enter a valid number for the return value",
        variant: "destructive",
      });
      return;
    }

    setReturns(prev => [...prev, returnValue / 100]); // Convert percentage to decimal
    setCurrentReturn("");
    setError(null);

    toast({
      title: "Data Point Added",
      description: "New return value has been added to the dataset",
    });
  };

  const clearData = () => {
    setReturns([]);
    setCurrentReturn("");
    setSharpeRatio(0);
    setExcessReturn(0);
    setError(null);
    toast({
      title: "Data Cleared",
      description: "All return data has been cleared",
    });
  };

  const handleRiskFreeRateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = Number(e.target.value);
    if (value >= 0 && value <= 1) {
      setRiskFreeRate(value);
    }
  };

  const chartData = returns.map((ret, index) => ({
    index,
    return: ret * 100,
    riskFree: riskFreeRate * 100
  }));

  return (
    <div className="space-y-6">
      <Card className="p-6">
        <h2 className="text-2xl font-bold mb-6">Sharpe Ratio Calculator</h2>
        
        <div className="grid gap-6 md:grid-cols-2">
          <div className="space-y-6">
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

            <div className="p-4 bg-muted rounded-lg">
              <h3 className="font-medium mb-2">Return Data Entry</h3>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="return-value">Return Value (%)</Label>
                  <Input
                    id="return-value"
                    type="number"
                    step="0.01"
                    value={currentReturn}
                    onChange={(e) => setCurrentReturn(e.target.value)}
                    placeholder="e.g., 2.5"
                    className="mt-1"
                  />
                </div>
                <div className="flex gap-2">
                  <Button onClick={addDataPoint} className="flex-1">
                    Add Data Point
                  </Button>
                  <Button onClick={clearData} variant="outline" className="flex-1">
                    Clear All
                  </Button>
                </div>
              </div>
            </div>

            <div>
              <Label>Current Dataset</Label>
              <div className="bg-muted p-2 rounded-md min-h-[100px] mt-1 text-sm">
                {returns.map((ret, i) => (
                  <div key={i}>{(ret * 100).toFixed(2)}%</div>
                ))}
              </div>
            </div>

            <Button onClick={calculateSharpeRatio} className="w-full">
              Calculate Sharpe Ratio
            </Button>
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
                <li>Set the risk-free rate (e.g., Treasury bill rate)</li>
                <li>Enter portfolio returns one at a time (as percentages)</li>
                <li>Click "Add Data Point" to add each return</li>
                <li>Once you have added all returns, click "Calculate Sharpe Ratio"</li>
              </ol>
            </div>
          </div>
        </div>
      </Card>

      {returns.length > 0 && (
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
