
import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { MetricsCard } from "@/components/shared/MetricsCard";
import { DollarSign } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export function EVEBITDAModel() {
  const [enterpriseValue, setEnterpriseValue] = useState(0);
  const [ebitda, setEbitda] = useState(0);
  const [multiple, setMultiple] = useState(0);
  const { toast } = useToast();

  const calculateMultiple = () => {
    try {
      if (ebitda === 0) {
        throw new Error("EBITDA cannot be zero");
      }

      const calculatedMultiple = enterpriseValue / ebitda;
      setMultiple(calculatedMultiple);

      toast({
        title: "Calculation Complete",
        description: `EV/EBITDA Multiple: ${calculatedMultiple.toFixed(2)}x`,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Invalid calculation",
        variant: "destructive",
      });
    }
  };

  const calculateEV = () => {
    const calculatedEV = ebitda * multiple;
    setEnterpriseValue(calculatedEV);

    toast({
      title: "Calculation Complete",
      description: `Enterprise Value: $${calculatedEV.toLocaleString()}`,
    });
  };

  return (
    <div className="space-y-6">
      <Card className="p-6">
        <h2 className="text-2xl font-bold mb-6">EV/EBITDA Calculator</h2>
        
        <div className="grid gap-6 md:grid-cols-2">
          <div className="space-y-4">
            <div>
              <Label htmlFor="enterprise-value">Enterprise Value ($)</Label>
              <Input
                id="enterprise-value"
                type="number"
                value={enterpriseValue}
                onChange={(e) => setEnterpriseValue(Number(e.target.value))}
                min="0"
              />
            </div>
            
            <div>
              <Label htmlFor="ebitda">EBITDA ($)</Label>
              <Input
                id="ebitda"
                type="number"
                value={ebitda}
                onChange={(e) => setEbitda(Number(e.target.value))}
                min="0"
              />
            </div>

            <div className="flex gap-2">
              <Button onClick={calculateMultiple} className="flex-1">
                Calculate Multiple
              </Button>
              <Button onClick={calculateEV} className="flex-1">
                Calculate EV
              </Button>
            </div>
          </div>

          <div className="space-y-6">
            <MetricsCard
              title="EV/EBITDA Multiple"
              value={`${multiple.toFixed(2)}x`}
              description="Enterprise Value to EBITDA ratio"
              icon={DollarSign}
            />

            <div className="p-4 bg-muted rounded-lg">
              <h3 className="font-medium mb-2">How to use this calculator:</h3>
              <ol className="list-decimal list-inside space-y-1 text-sm">
                <li>Enter the Enterprise Value and EBITDA to calculate the multiple</li>
                <li>Or enter EBITDA and a target multiple to calculate Enterprise Value</li>
                <li>Use the appropriate button for your desired calculation</li>
              </ol>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}
