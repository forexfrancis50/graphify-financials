import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { TrendingUp } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

export default function IRR() {
  const { toast } = useToast();
  const [cashFlows, setCashFlows] = useState<number[]>([-1000, 200, 300, 400, 500]);
  const [result, setResult] = useState<number | null>(null);

  const calculateIRR = () => {
    if (cashFlows.length < 2) {
      toast({
        title: "Invalid Input",
        description: "Please enter at least two cash flows (initial investment and one return)",
        variant: "destructive",
      });
      return;
    }

    const guess = 0.1;
    const tolerance = 0.00001;
    let maxIterations = 1000;
    
    const npv = (rate: number) => {
      return cashFlows.reduce((acc, cf, i) => acc + cf / Math.pow(1 + rate, i), 0);
    };
    
    let rate = guess;
    let iteration = 0;
    
    try {
      while (iteration < maxIterations) {
        const currentNPV = npv(rate);
        
        if (Math.abs(currentNPV) < tolerance) {
          setResult(rate * 100);
          toast({
            title: "Calculation Complete",
            description: `IRR calculated: ${(rate * 100).toFixed(2)}%`,
          });
          return;
        }
        
        const derivativeNPV = cashFlows.reduce((acc, cf, i) => 
          acc - (i * cf) / Math.pow(1 + rate, i + 1), 0);
        
        if (Math.abs(derivativeNPV) < tolerance) {
          toast({
            title: "Calculation Error",
            description: "Could not converge to a solution. Try different cash flows.",
            variant: "destructive",
          });
          setResult(null);
          return;
        }
        
        const nextRate = rate - currentNPV / derivativeNPV;
        
        if (Math.abs(nextRate - rate) < tolerance) {
          setResult(nextRate * 100);
          toast({
            title: "Calculation Complete",
            description: `IRR calculated: ${(nextRate * 100).toFixed(2)}%`,
          });
          return;
        }
        
        rate = nextRate;
        iteration++;
      }
      
      toast({
        title: "Calculation Error",
        description: "Maximum iterations reached. Try different cash flows.",
        variant: "destructive",
      });
      setResult(null);
    } catch (error) {
      toast({
        title: "Calculation Error",
        description: "An error occurred during calculation. Please check your inputs.",
        variant: "destructive",
      });
      setResult(null);
    }
  };

  const handleCashFlowInput = (input: string) => {
    const values = input.split(",").map(v => {
      const parsed = parseFloat(v.trim());
      return isNaN(parsed) ? 0 : parsed;
    });
    
    if (values.some(v => !isFinite(v))) {
      toast({
        title: "Invalid Input",
        description: "Please enter valid numbers only",
        variant: "destructive",
      });
      return;
    }
    
    setCashFlows(values);
  };

  return (
    <div className="container mx-auto py-8 px-4">
      <Card className="max-w-2xl mx-auto p-6">
        <div className="flex items-center gap-3 mb-6">
          <TrendingUp className="w-8 h-8 text-primary" />
          <h1 className="text-3xl font-bold">IRR Calculator</h1>
        </div>
        
        <div className="space-y-6">
          <div>
            <Label>Cash Flows (comma-separated)</Label>
            <Input
              value={cashFlows.join(", ")}
              onChange={(e) => handleCashFlowInput(e.target.value)}
              placeholder="Enter cash flows (e.g., -1000, 200, 300, 400, 500)"
              className="font-mono"
            />
            <p className="text-sm text-muted-foreground mt-2">
              Enter initial investment as negative, followed by expected cash inflows
            </p>
          </div>

          <Button onClick={calculateIRR} className="w-full">
            Calculate IRR
          </Button>

          {result !== null && (
            <div className="mt-4 p-4 bg-primary/10 rounded-lg">
              <p className="text-lg font-semibold">
                Internal Rate of Return (IRR): {result.toFixed(2)}%
              </p>
            </div>
          )}

          <div className="mt-6 space-y-2">
            <h3 className="font-semibold">How to use:</h3>
            <ul className="list-disc pl-6 space-y-1 text-muted-foreground">
              <li>Enter your initial investment as a negative number</li>
              <li>Add expected future cash flows as positive numbers</li>
              <li>Separate values with commas</li>
              <li>The calculator will show the IRR as a percentage</li>
            </ul>
          </div>
        </div>
      </Card>
    </div>
  );
}