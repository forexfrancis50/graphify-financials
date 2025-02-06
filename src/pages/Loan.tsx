import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { useToast } from "@/components/ui/use-toast";

export default function Loan() {
  const [principal, setPrincipal] = useState("");
  const [interestRate, setInterestRate] = useState("");
  const [years, setYears] = useState("");
  const [result, setResult] = useState<{
    monthlyPayment: number;
    totalPayment: number;
    totalInterest: number;
  } | null>(null);
  const { toast } = useToast();

  const calculateLoan = () => {
    try {
      const p = parseFloat(principal);
      const r = parseFloat(interestRate) / 100 / 12;
      const n = parseFloat(years) * 12;

      if (isNaN(p) || isNaN(r) || isNaN(n)) {
        throw new Error("Please enter valid numbers");
      }

      const monthlyPayment = (p * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
      const totalPayment = monthlyPayment * n;
      const totalInterest = totalPayment - p;

      setResult({
        monthlyPayment,
        totalPayment,
        totalInterest,
      });

      toast({
        title: "Loan Payment Calculated",
        description: `Monthly Payment: $${monthlyPayment.toFixed(2)}`,
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
      <h1 className="text-3xl font-bold mb-6">Loan Payment Calculator</h1>
      <Card className="p-6">
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">
              Loan Amount ($)
            </label>
            <Input
              type="number"
              value={principal}
              onChange={(e) => setPrincipal(e.target.value)}
              placeholder="e.g., 200000"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">
              Annual Interest Rate (%)
            </label>
            <Input
              type="number"
              value={interestRate}
              onChange={(e) => setInterestRate(e.target.value)}
              placeholder="e.g., 5"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">
              Loan Term (Years)
            </label>
            <Input
              type="number"
              value={years}
              onChange={(e) => setYears(e.target.value)}
              placeholder="e.g., 30"
            />
          </div>
          <Button onClick={calculateLoan} className="w-full">
            Calculate Loan Payments
          </Button>
          {result && (
            <div className="mt-4 p-4 bg-secondary/10 rounded-lg space-y-2">
              <p className="text-lg font-semibold">
                Monthly Payment: ${result.monthlyPayment.toFixed(2)}
              </p>
              <p className="text-sm text-muted-foreground">
                Total Payment: ${result.totalPayment.toFixed(2)}
              </p>
              <p className="text-sm text-muted-foreground">
                Total Interest: ${result.totalInterest.toFixed(2)}
              </p>
            </div>
          )}
        </div>
      </Card>
    </div>
  );
}