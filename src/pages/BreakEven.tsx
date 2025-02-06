import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { useToast } from "@/components/ui/use-toast";

export default function BreakEven() {
  const [fixedCosts, setFixedCosts] = useState("");
  const [variableCost, setVariableCost] = useState("");
  const [sellingPrice, setSellingPrice] = useState("");
  const [result, setResult] = useState<number | null>(null);
  const { toast } = useToast();

  const calculateBreakEven = () => {
    try {
      const fixed = parseFloat(fixedCosts);
      const variable = parseFloat(variableCost);
      const price = parseFloat(sellingPrice);

      if (isNaN(fixed) || isNaN(variable) || isNaN(price)) {
        throw new Error("Please enter valid numbers");
      }

      if (price <= variable) {
        throw new Error("Selling price must be greater than variable cost");
      }

      const breakEvenUnits = fixed / (price - variable);
      setResult(breakEvenUnits);
      
      toast({
        title: "Break-Even Point Calculated",
        description: `You need to sell ${breakEvenUnits.toFixed(0)} units to break even`,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Please check your inputs",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Break-Even Analysis Calculator</h1>
      <Card className="p-6">
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">
              Fixed Costs ($)
            </label>
            <Input
              type="number"
              value={fixedCosts}
              onChange={(e) => setFixedCosts(e.target.value)}
              placeholder="e.g., 100000"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">
              Variable Cost per Unit ($)
            </label>
            <Input
              type="number"
              value={variableCost}
              onChange={(e) => setVariableCost(e.target.value)}
              placeholder="e.g., 10"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">
              Selling Price per Unit ($)
            </label>
            <Input
              type="number"
              value={sellingPrice}
              onChange={(e) => setSellingPrice(e.target.value)}
              placeholder="e.g., 25"
            />
          </div>
          <Button onClick={calculateBreakEven} className="w-full">
            Calculate Break-Even Point
          </Button>
          {result !== null && (
            <div className="mt-4 p-4 bg-secondary/10 rounded-lg">
              <p className="text-lg font-semibold">
                Break-Even Point: {result.toFixed(0)} units
              </p>
              <p className="text-sm text-muted-foreground mt-2">
                At this point, total revenue equals total costs, resulting in neither profit nor loss.
              </p>
            </div>
          )}
        </div>
      </Card>
    </div>
  );
}