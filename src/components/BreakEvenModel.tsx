
import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { MetricsCard } from "@/components/shared/MetricsCard";
import { DollarSign } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { DataChart } from "@/components/shared/DataChart";

export function BreakEvenModel() {
  const [fixedCosts, setFixedCosts] = useState(0);
  const [variableCost, setVariableCost] = useState(0);
  const [sellingPrice, setSellingPrice] = useState(0);
  const [breakEvenUnits, setBreakEvenUnits] = useState(0);
  const [breakEvenRevenue, setBreakEvenRevenue] = useState(0);
  const { toast } = useToast();

  const calculateBreakEven = () => {
    try {
      if (sellingPrice <= variableCost) {
        throw new Error("Selling price must be greater than variable cost per unit");
      }

      const units = fixedCosts / (sellingPrice - variableCost);
      const revenue = units * sellingPrice;

      setBreakEvenUnits(units);
      setBreakEvenRevenue(revenue);

      toast({
        title: "Calculation Complete",
        description: `Break-even point: ${units.toFixed(0)} units`,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Invalid calculation",
        variant: "destructive",
      });
    }
  };

  // Generate data for the break-even chart
  const generateChartData = () => {
    const data = [];
    const maxUnits = Math.ceil(breakEvenUnits * 2);
    
    for (let units = 0; units <= maxUnits; units += Math.ceil(maxUnits / 10)) {
      const revenue = units * sellingPrice;
      const totalCosts = fixedCosts + (units * variableCost);
      data.push({
        units,
        revenue,
        totalCosts,
      });
    }
    return data;
  };

  return (
    <div className="space-y-6">
      <Card className="p-6">
        <h2 className="text-2xl font-bold mb-6">Break-Even Analysis</h2>
        
        <div className="grid gap-6 md:grid-cols-2">
          <div className="space-y-4">
            <div>
              <Label htmlFor="fixed-costs">Fixed Costs ($)</Label>
              <Input
                id="fixed-costs"
                type="number"
                value={fixedCosts}
                onChange={(e) => setFixedCosts(Number(e.target.value))}
                min="0"
              />
            </div>
            
            <div>
              <Label htmlFor="variable-cost">Variable Cost per Unit ($)</Label>
              <Input
                id="variable-cost"
                type="number"
                value={variableCost}
                onChange={(e) => setVariableCost(Number(e.target.value))}
                min="0"
              />
            </div>

            <div>
              <Label htmlFor="selling-price">Selling Price per Unit ($)</Label>
              <Input
                id="selling-price"
                type="number"
                value={sellingPrice}
                onChange={(e) => setSellingPrice(Number(e.target.value))}
                min="0"
              />
            </div>

            <Button onClick={calculateBreakEven} className="w-full">
              Calculate Break-Even Point
            </Button>
          </div>

          <div className="space-y-6">
            <MetricsCard
              title="Break-Even Units"
              value={breakEvenUnits.toFixed(0)}
              description="Number of units to break even"
              icon={DollarSign}
            />

            <MetricsCard
              title="Break-Even Revenue"
              value={`$${breakEvenRevenue.toLocaleString()}`}
              description="Revenue required to break even"
              icon={DollarSign}
            />

            <div className="p-4 bg-muted rounded-lg">
              <h3 className="font-medium mb-2">How to use this calculator:</h3>
              <ol className="list-decimal list-inside space-y-1 text-sm">
                <li>Enter your total fixed costs</li>
                <li>Input the variable cost per unit</li>
                <li>Set the selling price per unit</li>
                <li>Click calculate to find your break-even point</li>
              </ol>
            </div>
          </div>
        </div>
      </Card>

      {breakEvenUnits > 0 && (
        <Card className="p-6">
          <h3 className="text-xl font-semibold mb-4">Break-Even Chart</h3>
          <DataChart
            data={generateChartData()}
            type="line"
            xKey="units"
            yKey="revenue"
            secondaryKey="totalCosts"
            title="Revenue vs Total Costs"
            height={300}
          />
        </Card>
      )}
    </div>
  );
}
