
import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

interface FinancialInputs {
  revenue: number;
  netIncome: number;
  totalAssets: number;
  totalLiabilities: number;
  shareholdersEquity: number;
  currentAssets: number;
  currentLiabilities: number;
  inventory: number;
}

interface FinancialRatios {
  name: string;
  value: number;
}

export function FinancialRatiosModel() {
  const { toast } = useToast();
  const [inputs, setInputs] = useState<FinancialInputs>({
    revenue: 1000000,
    netIncome: 100000,
    totalAssets: 2000000,
    totalLiabilities: 1000000,
    shareholdersEquity: 1000000,
    currentAssets: 800000,
    currentLiabilities: 400000,
    inventory: 300000,
  });

  const [ratios, setRatios] = useState<FinancialRatios[]>([]);

  const calculateRatios = () => {
    const newRatios = [
      {
        name: "Net Profit Margin",
        value: Number(((inputs.netIncome / inputs.revenue) * 100).toFixed(2)),
      },
      {
        name: "ROA",
        value: Number(((inputs.netIncome / inputs.totalAssets) * 100).toFixed(2)),
      },
      {
        name: "ROE",
        value: Number(((inputs.netIncome / inputs.shareholdersEquity) * 100).toFixed(2)),
      },
      {
        name: "Current Ratio",
        value: Number((inputs.currentAssets / inputs.currentLiabilities).toFixed(2)),
      },
      {
        name: "Quick Ratio",
        value: Number(((inputs.currentAssets - inputs.inventory) / inputs.currentLiabilities).toFixed(2)),
      },
      {
        name: "Debt to Equity",
        value: Number((inputs.totalLiabilities / inputs.shareholdersEquity).toFixed(2)),
      },
    ];

    setRatios(newRatios);
    toast({
      title: "Ratios Calculated",
      description: "Financial ratios have been updated based on the input values",
    });
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <h1 className="text-3xl font-bold text-primary">Financial Ratios Analysis</h1>
      
      <div className="grid md:grid-cols-2 gap-6">
        <Card className="p-6 space-y-4">
          <h2 className="text-xl font-semibold">Financial Data</h2>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="revenue">Revenue</Label>
              <Input
                id="revenue"
                type="number"
                value={inputs.revenue}
                onChange={(e) => setInputs({ ...inputs, revenue: Number(e.target.value) })}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="netIncome">Net Income</Label>
              <Input
                id="netIncome"
                type="number"
                value={inputs.netIncome}
                onChange={(e) => setInputs({ ...inputs, netIncome: Number(e.target.value) })}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="totalAssets">Total Assets</Label>
              <Input
                id="totalAssets"
                type="number"
                value={inputs.totalAssets}
                onChange={(e) => setInputs({ ...inputs, totalAssets: Number(e.target.value) })}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="totalLiabilities">Total Liabilities</Label>
              <Input
                id="totalLiabilities"
                type="number"
                value={inputs.totalLiabilities}
                onChange={(e) => setInputs({ ...inputs, totalLiabilities: Number(e.target.value) })}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="shareholdersEquity">Shareholders Equity</Label>
              <Input
                id="shareholdersEquity"
                type="number"
                value={inputs.shareholdersEquity}
                onChange={(e) => setInputs({ ...inputs, shareholdersEquity: Number(e.target.value) })}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="currentAssets">Current Assets</Label>
              <Input
                id="currentAssets"
                type="number"
                value={inputs.currentAssets}
                onChange={(e) => setInputs({ ...inputs, currentAssets: Number(e.target.value) })}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="currentLiabilities">Current Liabilities</Label>
              <Input
                id="currentLiabilities"
                type="number"
                value={inputs.currentLiabilities}
                onChange={(e) => setInputs({ ...inputs, currentLiabilities: Number(e.target.value) })}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="inventory">Inventory</Label>
              <Input
                id="inventory"
                type="number"
                value={inputs.inventory}
                onChange={(e) => setInputs({ ...inputs, inventory: Number(e.target.value) })}
              />
            </div>
          </div>

          <Button onClick={calculateRatios} className="w-full mt-4">
            Calculate Financial Ratios
          </Button>
        </Card>

        <Card className="p-6">
          <h2 className="text-xl font-semibold mb-4">Financial Ratios</h2>
          {ratios.length > 0 ? (
            <ResponsiveContainer width="100%" height={400}>
              <BarChart data={ratios}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis 
                  dataKey="name" 
                  angle={-45}
                  textAnchor="end"
                  height={100}
                />
                <YAxis 
                  label={{ value: 'Value', angle: -90, position: 'left' }}
                />
                <Tooltip />
                <Bar dataKey="value" fill="#1E293B" />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-[400px] flex items-center justify-center text-muted-foreground">
              Calculate ratios to see the visualization
            </div>
          )}
        </Card>
      </div>
    </div>
  );
}
