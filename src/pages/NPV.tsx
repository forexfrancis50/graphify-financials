import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { useToast } from "@/components/ui/use-toast";

export default function NPV() {
  const [initialInvestment, setInitialInvestment] = useState("");
  const [cashFlows, setCashFlows] = useState("");
  const [discountRate, setDiscountRate] = useState("");
  const [result, setResult] = useState<number | null>(null);
  const { toast } = useToast();

  const calculateNPV = () => {
    try {
      const investment = parseFloat(initialInvestment);
      const rate = parseFloat(discountRate) / 100;
      const flows = cashFlows.split(",").map(flow => parseFloat(flow.trim()));
      
      if (isNaN(investment) || isNaN(rate) || flows.some(isNaN)) {
        throw new Error("Please enter valid numbers");
      }

      const npv = -investment + flows.reduce((acc, flow, index) => {
        return acc + flow / Math.pow(1 + rate, index + 1);
      }, 0);

      setResult(npv);
      toast({
        title: "NPV Calculated",
        description: `The Net Present Value is $${npv.toFixed(2)}`,
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
      <h1 className="text-3xl font-bold mb-6">Net Present Value (NPV) Calculator</h1>
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
              Cash Flows (comma-separated) ($)
            </label>
            <Input
              value={cashFlows}
              onChange={(e) => setCashFlows(e.target.value)}
              placeholder="e.g., 2000, 3000, 4000"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">
              Discount Rate (%)
            </label>
            <Input
              type="number"
              value={discountRate}
              onChange={(e) => setDiscountRate(e.target.value)}
              placeholder="e.g., 10"
            />
          </div>
          <Button onClick={calculateNPV} className="w-full">
            Calculate NPV
          </Button>
          {result !== null && (
            <div className="mt-4 p-4 bg-secondary/10 rounded-lg">
              <p className="text-lg font-semibold">
                Net Present Value: ${result.toFixed(2)}
              </p>
              <p className="text-sm text-muted-foreground mt-2">
                {result > 0
                  ? "Positive NPV indicates a potentially profitable investment."
                  : "Negative NPV suggests the investment may not be profitable."}
              </p>
            </div>
          )}
        </div>
      </Card>
    </div>
  );
}