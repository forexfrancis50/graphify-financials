
import { useState, useMemo } from "react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { MetricsCard } from "@/components/shared/MetricsCard";
import { DataChart } from "@/components/shared/DataChart";
import { AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

export function VaRModel() {
  const [returns, setReturns] = useState<number[]>([]);
  const [confidenceLevel, setConfidenceLevel] = useState(95);
  const [portfolioValue, setPortfolioValue] = useState(1000000);
  const [currentReturn, setCurrentReturn] = useState("");
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const varResult = useMemo(() => {
    try {
      if (returns.length === 0) {
        return { value: 0, percentile: 0 };
      }

      if (confidenceLevel <= 0 || confidenceLevel >= 100) {
        throw new Error("Confidence level must be between 0 and 100");
      }

      const sortedReturns = [...returns].sort((a, b) => a - b);
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
  }, [returns, confidenceLevel, portfolioValue]);

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
    setError(null);
    toast({
      title: "Data Cleared",
      description: "All return data has been cleared",
    });
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
          <div className="space-y-6">
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
                <li>Add historical returns one by one using the data entry form</li>
                <li>The VaR will update automatically as you add data</li>
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
