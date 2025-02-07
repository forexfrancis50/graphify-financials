
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

  const calculateBeta = () => {
    const stockData = stockReturns.split("\n").map(Number).filter(n => !isNaN(n));
    const marketData = marketReturns.split("\n").map(Number).filter(n => !isNaN(n));
    
    if (stockData.length !== marketData.length) return;

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

    return { beta: betaValue, rSquared: 1 - (residualSS / totalSS) };
  };

  const handleCalculate = () => {
    calculateBeta();
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
                className="w-full min-h-[200px] p-2 border rounded"
                value={stockReturns}
                onChange={(e) => setStockReturns(e.target.value)}
                placeholder="Enter stock returns, one per line&#10;Example:&#10;0.02&#10;-0.01&#10;0.03"
              />
            </div>
            
            <div>
              <Label htmlFor="market-returns">Market Returns (one per line)</Label>
              <textarea
                id="market-returns"
                className="w-full min-h-[200px] p-2 border rounded"
                value={marketReturns}
                onChange={(e) => setMarketReturns(e.target.value)}
                placeholder="Enter market returns, one per line&#10;Example:&#10;0.01&#10;-0.02&#10;0.02"
              />
            </div>

            <Button onClick={handleCalculate}>Calculate Beta</Button>
          </div>

          <div className="space-y-6">
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
