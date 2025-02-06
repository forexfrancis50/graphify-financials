import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { useToast } from "@/components/ui/use-toast";

export default function ROI() {
  const [initialInvestment, setInitialInvestment] = useState("");
  const [finalValue, setFinalValue] = useState("");
  const [result, setResult] = useState<{
    roi: number;
    profit: number;
  } | null>(null);
  const { toast } = useToast();

  const calculateROI = () => {
    try {
      const initial = parseFloat(initialInvestment);
      const final = parseFloat(finalValue);

      if (isNaN(initial) || isNaN(final)) {
        throw new Error("Please enter valid numbers");
      }

      const profit = final - initial;
      const roi = (profit / initial) * 100;

      setResult({
        roi,
        profit,
      });

      toast({
        title: "ROI Calculated",
        description: `Return on Investment: ${roi.toFixed(2)}%`,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Please check your inputs and try again",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Return on Investment (ROI) Calculator</h1>
      <Card className="p-6">
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">
              Initial Investment ($)
            </label>
            <Input
              type="number"
              value={initialInvestment}
              onChange={(e) => setInitialInvestment(e.target.value)}
              placeholder="e.g., 10000"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">
              Final Value ($)
            </label>
            <Input
              type="number"
              value={finalValue}
              onChange={(e) => setFinalValue(e.target.value)}
              placeholder="e.g., 15000"
            />
          </div>
          <Button onClick={calculateROI} className="w-full">
            Calculate ROI
          </Button>
          {result && (
            <div className="mt-4 p-4 bg-secondary/10 rounded-lg space-y-2">
              <p className="text-lg font-semibold">
                ROI: {result.roi.toFixed(2)}%
              </p>
              <p className="text-sm text-muted-foreground">
                Total Profit/Loss: ${result.profit.toFixed(2)}
              </p>
              <p className="text-sm text-muted-foreground mt-2">
                {result.roi > 0
                  ? "Positive ROI indicates a profitable investment."
                  : "Negative ROI indicates a loss on investment."}
              </p>
            </div>
          )}
        </div>
      </Card>
    </div>
  );
}