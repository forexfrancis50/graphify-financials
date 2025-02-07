
import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { MetricsCard } from "@/components/shared/MetricsCard";
import { DataChart } from "@/components/shared/DataChart";
import { TrendingUp } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

export function BetaModel() {
  const [stockReturns, setStockReturns] = useState("");
  const [marketReturns, setMarketReturns] = useState("");
  const [currentStockReturn, setCurrentStockReturn] = useState("");
  const [currentMarketReturn, setCurrentMarketReturn] = useState("");
  const [beta, setBeta] = useState(0);
  const [rSquared, setRSquared] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

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

  const addDataPoint = () => {
    const stockValue = parseFloat(currentStockReturn);
    const marketValue = parseFloat(currentMarketReturn);

    if (isNaN(stockValue) || isNaN(marketValue)) {
      toast({
        title: "Invalid Input",
        description: "Please enter valid numbers for both returns",
        variant: "destructive",
      });
      return;
    }

    setStockReturns(prev => prev ? `${prev}\n${currentStockReturn}` : currentStockReturn);
    setMarketReturns(prev => prev ? `${prev}\n${currentMarketReturn}` : currentMarketReturn);
    setCurrentStockReturn("");
    setCurrentMarketReturn("");

    toast({
      title: "Data Point Added",
      description: "New return values have been added to the dataset",
    });
  };

  const clearData = () => {
    setStockReturns("");
    setMarketReturns("");
    setCurrentStockReturn("");
    setCurrentMarketReturn("");
    setBeta(0);
    setRSquared(0);
    setError(null);
    toast({
      title: "Data Cleared",
      description: "All data has been cleared",
    });
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

      let totalSS = 0;
      let residualSS = 0;
      
      for (let i = 0; i < n; i++) {
        const predicted = stockMean + betaValue * (marketData[i] - marketMean);
        totalSS += Math.pow(stockData[i] - stockMean, 2);
        residualSS += Math.pow(stockData[i] - predicted, 2);
      }

      setRSquared(1 - (residualSS / totalSS));
      
      toast({
        title: "Beta Calculated",
        description: `Beta: ${betaValue.toFixed(2)}`,
      });
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Error calculating beta";
      setError(errorMessage);
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      });
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
          <div className="space-y-6">
            <div className="p-4 bg-muted rounded-lg mb-6">
              <h3 className="font-medium mb-2">Current Data Entry</h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="stock-return">Stock Return (%)</Label>
                  <Input
                    id="stock-return"
                    type="number"
                    step="0.01"
                    value={currentStockReturn}
                    onChange={(e) => setCurrentStockReturn(e.target.value)}
                    placeholder="e.g., 2.5"
                  />
                </div>
                <div>
                  <Label htmlFor="market-return">Market Return (%)</Label>
                  <Input
                    id="market-return"
                    type="number"
                    step="0.01"
                    value={currentMarketReturn}
                    onChange={(e) => setCurrentMarketReturn(e.target.value)}
                    placeholder="e.g., 1.8"
                  />
                </div>
              </div>
              <div className="flex gap-2 mt-4">
                <Button onClick={addDataPoint} className="flex-1">
                  Add Data Point
                </Button>
                <Button onClick={clearData} variant="outline" className="flex-1">
                  Clear All
                </Button>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <Label>Current Dataset</Label>
                <div className="grid grid-cols-2 gap-4 mt-2">
                  <div>
                    <Label className="text-sm text-muted-foreground">Stock Returns</Label>
                    <div className="bg-muted p-2 rounded-md min-h-[100px] text-sm">
                      {stockReturns.split("\n").map((ret, i) => (
                        <div key={i}>{ret}%</div>
                      ))}
                    </div>
                  </div>
                  <div>
                    <Label className="text-sm text-muted-foreground">Market Returns</Label>
                    <div className="bg-muted p-2 rounded-md min-h-[100px] text-sm">
                      {marketReturns.split("\n").map((ret, i) => (
                        <div key={i}>{ret}%</div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              <Button onClick={calculateBeta} className="w-full">
                Calculate Beta
              </Button>
            </div>
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
                <li>Enter a stock return percentage (e.g., 2.5 for 2.5%)</li>
                <li>Enter the corresponding market return percentage</li>
                <li>Click "Add Data Point" to add to the dataset</li>
                <li>Repeat for multiple data points</li>
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
