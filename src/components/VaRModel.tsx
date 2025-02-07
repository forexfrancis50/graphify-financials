
import { useState, useMemo } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { MetricsCard } from "@/components/shared/MetricsCard";
import { DataChart } from "@/components/shared/DataChart";
import { AlertTriangle } from "lucide-react";

export function VaRModel() {
  const [returns, setReturns] = useState<number[]>([]);
  const [confidenceLevel, setConfidenceLevel] = useState(95);
  const [portfolioValue, setPortfolioValue] = useState(1000000);
  const [historicalData, setHistoricalData] = useState("");

  const varResult = useMemo(() => {
    const returnValues = historicalData
      .split("\n")
      .map(Number)
      .filter((n) => !isNaN(n));
    
    if (returnValues.length === 0) {
      return { value: 0, percentile: 0 };
    }

    const sortedReturns = [...returnValues].sort((a, b) => a - b);
    const index = Math.floor(((100 - confidenceLevel) / 100) * sortedReturns.length);
    const varValue = -sortedReturns[index];
    
    return {
      value: varValue * portfolioValue,
      percentile: varValue * 100
    };
  }, [historicalData, confidenceLevel, portfolioValue]);

  const handleDataChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setHistoricalData(e.target.value);
    const returnValues = e.target.value
      .split("\n")
      .map(Number)
      .filter((n) => !isNaN(n));
    setReturns(returnValues);
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
                value={portfolioValue}
                onChange={(e) => setPortfolioValue(Number(e.target.value))}
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
                onChange={(e) => setConfidenceLevel(Number(e.target.value))}
              />
            </div>
            
            <div>
              <Label htmlFor="historical-data">Historical Returns (one per line)</Label>
              <textarea
                id="historical-data"
                className="w-full min-h-[200px] p-2 border rounded"
                value={historicalData}
                onChange={handleDataChange}
                placeholder="Enter historical returns, one per line&#10;Example:&#10;0.02&#10;-0.01&#10;0.03"
              />
            </div>
          </div>

          <div className="space-y-6">
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
