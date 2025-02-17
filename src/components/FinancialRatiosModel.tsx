
import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { MetricsCard } from "@/components/shared/MetricsCard";
import { DollarSign, Percent } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export function FinancialRatiosModel() {
  const [netIncome, setNetIncome] = useState(0);
  const [totalAssets, setTotalAssets] = useState(0);
  const [totalEquity, setTotalEquity] = useState(0);
  const [totalLiabilities, setTotalLiabilities] = useState(0);
  const [currentAssets, setCurrentAssets] = useState(0);
  const [currentLiabilities, setCurrentLiabilities] = useState(0);
  const [revenue, setRevenue] = useState(0);

  const [ratios, setRatios] = useState({
    roa: 0,
    roe: 0,
    currentRatio: 0,
    debtToEquity: 0,
    profitMargin: 0,
  });

  const { toast } = useToast();

  const calculateRatios = () => {
    try {
      if (totalAssets === 0 || totalEquity === 0 || currentLiabilities === 0 || revenue === 0) {
        throw new Error("Values cannot be zero");
      }

      const roa = (netIncome / totalAssets) * 100;
      const roe = (netIncome / totalEquity) * 100;
      const currentRatio = currentAssets / currentLiabilities;
      const debtToEquity = totalLiabilities / totalEquity;
      const profitMargin = (netIncome / revenue) * 100;

      setRatios({
        roa,
        roe,
        currentRatio,
        debtToEquity,
        profitMargin,
      });

      toast({
        title: "Calculation Complete",
        description: "Financial ratios have been calculated",
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
        <h2 className="text-2xl font-bold mb-6">Financial Ratios Calculator</h2>
        
        <div className="grid gap-6 md:grid-cols-2">
          <div className="space-y-4">
            <div>
              <Label htmlFor="net-income">Net Income ($)</Label>
              <Input
                id="net-income"
                type="number"
                value={netIncome}
                onChange={(e) => setNetIncome(Number(e.target.value))}
              />
            </div>
            
            <div>
              <Label htmlFor="total-assets">Total Assets ($)</Label>
              <Input
                id="total-assets"
                type="number"
                value={totalAssets}
                onChange={(e) => setTotalAssets(Number(e.target.value))}
                min="0"
              />
            </div>

            <div>
              <Label htmlFor="total-equity">Total Equity ($)</Label>
              <Input
                id="total-equity"
                type="number"
                value={totalEquity}
                onChange={(e) => setTotalEquity(Number(e.target.value))}
                min="0"
              />
            </div>

            <div>
              <Label htmlFor="total-liabilities">Total Liabilities ($)</Label>
              <Input
                id="total-liabilities"
                type="number"
                value={totalLiabilities}
                onChange={(e) => setTotalLiabilities(Number(e.target.value))}
                min="0"
              />
            </div>

            <div>
              <Label htmlFor="current-assets">Current Assets ($)</Label>
              <Input
                id="current-assets"
                type="number"
                value={currentAssets}
                onChange={(e) => setCurrentAssets(Number(e.target.value))}
                min="0"
              />
            </div>

            <div>
              <Label htmlFor="current-liabilities">Current Liabilities ($)</Label>
              <Input
                id="current-liabilities"
                type="number"
                value={currentLiabilities}
                onChange={(e) => setCurrentLiabilities(Number(e.target.value))}
                min="0"
              />
            </div>

            <div>
              <Label htmlFor="revenue">Revenue ($)</Label>
              <Input
                id="revenue"
                type="number"
                value={revenue}
                onChange={(e) => setRevenue(Number(e.target.value))}
                min="0"
              />
            </div>

            <Button onClick={calculateRatios} className="w-full">
              Calculate Ratios
            </Button>
          </div>

          <div className="space-y-4">
            <MetricsCard
              title="Return on Assets (ROA)"
              value={`${ratios.roa.toFixed(2)}%`}
              description="Net Income / Total Assets"
              icon={Percent}
            />

            <MetricsCard
              title="Return on Equity (ROE)"
              value={`${ratios.roe.toFixed(2)}%`}
              description="Net Income / Total Equity"
              icon={Percent}
            />

            <MetricsCard
              title="Current Ratio"
              value={ratios.currentRatio.toFixed(2)}
              description="Current Assets / Current Liabilities"
              icon={DollarSign}
            />

            <MetricsCard
              title="Debt to Equity"
              value={ratios.debtToEquity.toFixed(2)}
              description="Total Liabilities / Total Equity"
              icon={DollarSign}
            />

            <MetricsCard
              title="Profit Margin"
              value={`${ratios.profitMargin.toFixed(2)}%`}
              description="Net Income / Revenue"
              icon={Percent}
            />

            <div className="p-4 bg-muted rounded-lg">
              <h3 className="font-medium mb-2">About Financial Ratios:</h3>
              <ul className="list-disc list-inside space-y-1 text-sm">
                <li>ROA measures how efficiently a company uses its assets</li>
                <li>ROE shows the return generated on shareholders' equity</li>
                <li>Current Ratio indicates short-term liquidity</li>
                <li>Debt to Equity shows financial leverage</li>
                <li>Profit Margin reflects operational efficiency</li>
              </ul>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}
