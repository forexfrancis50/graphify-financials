
import { useState, useMemo } from "react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { MetricsCard } from "@/components/shared/MetricsCard";
import { DataChart } from "@/components/shared/DataChart";
import { AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";

export function VaRModel() {
  const [returns, setReturns] = useState<number[]>([]);
  const [confidenceLevel, setConfidenceLevel] = useState(95);
  const [portfolioValue, setPortfolioValue] = useState(1000000);
  const [historicalData, setHistoricalData] = useState("");
  const [error, setError] = useState<string | null>(null);

  const varResult = useMemo(() => {
    try {
      const returnValues = historicalData
        .split("\n")
        .map(Number)
        .filter((n) => !isNaN(n));
      
      if (returnValues.length === 0) {
        return { value: 0, percentile: 0 };
      }

      if (confidenceLevel <= 0 || confidenceLevel >= 100) {
        throw new Error("Confidence level must be between 0 and 100");
      }

      const sortedReturns = [...returnValues].sort((a, b) => a - b);
      const index = Math.floor(((100 - confidenceLevel) / 100) * sortedReturns.length);
      const varValue = -sortedReturns[index];
      
      return {
        value: varValue * portfolioValue,
        percentile: varValue * 100
      };
    } catch (err) {
      setError(err instanceof Error ? err.message : "Invalid calculation");
      return { value: 0, percentile: 0 };
    }
  }, [historicalData, confidenceLevel, portfolioValue]);

  const handleDataChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setError(null);
    setHistoricalData(e.target.value);
    const returnValues = e.target.value
      .split("\n")
      .map(Number)
      .filter((n) => !isNaN(n));
    setReturns(returnValues);
  };

  const handleConfidenceLevelChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = Number(e.target.value);
    setError(null);
    if (value > 0 && value < 100) {
      setConfidenceLevel(value);
    }
  };

  const handlePortfolioValueChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = Number(e.target.value);
    setError(null);
    if (value > 0) {
      setPortfolioValue(value);
    }
  };

  const chartData = returns.map((ret, index) => ({
    index,
    return: ret * 100
  }));

  return (
    <div className="space-y-6">
      <Card className="p-6">
        <h2 className="text-2xl font-bold mb-6">Value at Risk (VaR) Calculator</h2>
        
        <div className="grid gap-6 md:grid-cols-2">
          <div className="space-y-4">
            <div>
              <Label htmlFor="portfolio-value">Portfolio Value ($)</Label>
              <Input
                id="portfolio-value"
                type="number"
                min="0"
                value={portfolioValue}
                onChange={handlePortfolioValueChange}
                className="mt-1"
              />
            </div>
            
            <div>
              <Label htmlFor="confidence-level">Confidence Level (%)</Label>
              <Input
                id="confidence-level"
                type="number"
                min="1"
                max="99"
                value={confidenceLevel}
                onChange={handleConfidenceLevelChange}
                className="mt-1"
              />
              <p className="text-sm text-muted-foreground mt-1">
                Enter a value between 1 and 99
              </p>
            </div>
            
            <div>
              <Label htmlFor="historical-data">Historical Returns (one per line)</Label>
              <textarea
                id="historical-data"
                className="w-full min-h-[200px] p-2 border rounded mt-1"
                value={historicalData}
                onChange={handleDataChange}
                placeholder="Enter decimal values, one per line&#10;Example:&#10;0.02&#10;-0.01&#10;0.03"
              />
              <p className="text-sm text-muted-foreground mt-1">
                Enter returns as decimals (e.g., 0.05 for 5%)
              </p>
            </div>
          </div>

          <div className="space-y-6">
            {error && (
              <div className="bg-destructive/15 text-destructive p-3 rounded-md">
                {error}
              </div>
            )}
            
            <MetricsCard
              title="Value at Risk"
              value={`$${varResult.value.toLocaleString()}`}
              description={`${confidenceLevel}% confidence level`}
              icon={AlertTriangle}
            />
            
            <MetricsCard
              title="VaR Percentile"
              value={`${varResult.percentile.toFixed(2)}%`}
              description="Loss threshold"
              icon={AlertTriangle}
            />

            <div className="p-4 bg-muted rounded-lg">
              <h3 className="font-medium mb-2">How to use this calculator:</h3>
              <ol className="list-decimal list-inside space-y-1 text-sm">
                <li>Enter your total portfolio value</li>
                <li>Set your desired confidence level (typically 95% or 99%)</li>
                <li>Input historical returns as decimal values (one per line)</li>
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
          title="Historical Returns Distribution"
          height={300}
        />
      )}
    </div>
  );
}
