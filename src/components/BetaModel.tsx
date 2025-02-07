
import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { MetricsCard } from "@/components/shared/MetricsCard";
import { DataChart } from "@/components/shared/DataChart";
import { TrendingUp } from "lucide-react";

export function BetaModel() {
  const [stockReturns, setStockReturns] = useState("");
  const [marketReturns, setMarketReturns] = useState("");
  const [beta, setBeta] = useState(0);
  const [rSquared, setRSquared] = useState(0);
  const [error, setError] = useState<string | null>(null);

  const validateData = (stockData: number[], marketData: number[]) => {
    if (stockData.length === 0 || marketData.length === 0) {
      throw new Error("Please enter both stock and market returns");
    }
    if (stockData.length !== marketData.length) {
      throw new Error("Stock and market returns must have the same number of observations");
    }
    if (stockData.length < 2) {
      throw new Error("Need at least 2 observations to calculate beta");
    }
  };

  const calculateBeta = () => {
    try {
      setError(null);
      const stockData = stockReturns.split("\n").map(Number).filter(n => !isNaN(n));
      const marketData = marketReturns.split("\n").map(Number).filter(n => !isNaN(n));
      
      validateData(stockData, marketData);

      const n = stockData.length;
      const marketMean = marketData.reduce((a, b) => a + b, 0) / n;
      const stockMean = stockData.reduce((a, b) => a + b, 0) / n;

      let covariance = 0;
      let marketVariance = 0;

      for (let i = 0; i < n; i++) {
        covariance += (marketData[i] - marketMean) * (stockData[i] - stockMean);
        marketVariance += Math.pow(marketData[i] - marketMean, 2);
      }

      const betaValue = covariance / marketVariance;
      setBeta(betaValue);

      // Calculate R-squared
      let totalSS = 0;
      let residualSS = 0;
      
      for (let i = 0; i < n; i++) {
        const predicted = stockMean + betaValue * (marketData[i] - marketMean);
        totalSS += Math.pow(stockData[i] - stockMean, 2);
        residualSS += Math.pow(stockData[i] - predicted, 2);
      }

      setRSquared(1 - (residualSS / totalSS));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error calculating beta");
      setBeta(0);
      setRSquared(0);
    }
  };

  const chartData = stockReturns.split("\n").map((ret, index) => ({
    index,
    stock: Number(ret) * 100,
    market: Number(marketReturns.split("\n")[index]) * 100
  })).filter(d => !isNaN(d.stock) && !isNaN(d.market));

  return (
    <div className="space-y-6">
      <Card className="p-6">
        <h2 className="text-2xl font-bold mb-6">Beta Calculator</h2>
        
        <div className="grid gap-6 md:grid-cols-2">
          <div className="space-y-4">
            <div>
              <Label htmlFor="stock-returns">Stock Returns (one per line)</Label>
              <textarea
                id="stock-returns"
                className="w-full min-h-[200px] p-2 border rounded mt-1"
                value={stockReturns}
                onChange={(e) => setStockReturns(e.target.value)}
                placeholder="Enter decimal values, one per line&#10;Example:&#10;0.02&#10;-0.01&#10;0.03"
              />
              <p className="text-sm text-muted-foreground mt-1">
                Enter returns as decimals (e.g., 0.05 for 5%)
              </p>
            </div>
            
            <div>
              <Label htmlFor="market-returns">Market Returns (one per line)</Label>
              <textarea
                id="market-returns"
                className="w-full min-h-[200px] p-2 border rounded mt-1"
                value={marketReturns}
                onChange={(e) => setMarketReturns(e.target.value)}
                placeholder="Enter decimal values, one per line&#10;Example:&#10;0.01&#10;-0.02&#10;0.02"
              />
              <p className="text-sm text-muted-foreground mt-1">
                Enter returns as decimals (e.g., 0.05 for 5%)
              </p>
            </div>

            <Button onClick={calculateBeta}>Calculate Beta</Button>
          </div>

          <div className="space-y-6">
            {error && (
              <div className="bg-destructive/15 text-destructive p-3 rounded-md">
                {error}
              </div>
            )}

            <MetricsCard
              title="Beta"
              value={beta.toFixed(2)}
              description="Measure of systematic risk"
              icon={TrendingUp}
            />
            
            <MetricsCard
              title="R-Squared"
              value={`${(rSquared * 100).toFixed(2)}%`}
              description="Goodness of fit"
              icon={TrendingUp}
            />

            <div className="p-4 bg-muted rounded-lg">
              <h3 className="font-medium mb-2">How to use this calculator:</h3>
              <ol className="list-decimal list-inside space-y-1 text-sm">
                <li>Enter historical stock returns (one per line)</li>
                <li>Enter corresponding market returns</li>
                <li>Make sure both lists have the same number of observations</li>
                <li>Click "Calculate Beta" to see results</li>
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
          yKey="stock"
          title="Stock vs Market Returns"
          height={300}
        />
      )}
    </div>
  );
}
