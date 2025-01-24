import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";

interface TargetCompanyProps {
  inputs: {
    targetRevenue: number;
    targetEBITDA: number;
    targetNetIncome: number;
    targetShares: number;
    targetPrice: number;
  };
  setInputs: (inputs: any) => void;
}

export function TargetCompany({ inputs, setInputs }: TargetCompanyProps) {
  return (
    <Card className="p-6 space-y-4">
      <h2 className="text-xl font-semibold">Target Company</h2>
      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="targetRevenue">Revenue ($)</Label>
          <Input
            id="targetRevenue"
            type="number"
            value={inputs.targetRevenue}
            onChange={(e) =>
              setInputs({ ...inputs, targetRevenue: Number(e.target.value) })
            }
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="targetEBITDA">EBITDA ($)</Label>
          <Input
            id="targetEBITDA"
            type="number"
            value={inputs.targetEBITDA}
            onChange={(e) =>
              setInputs({ ...inputs, targetEBITDA: Number(e.target.value) })
            }
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="targetNetIncome">Net Income ($)</Label>
          <Input
            id="targetNetIncome"
            type="number"
            value={inputs.targetNetIncome}
            onChange={(e) =>
              setInputs({ ...inputs, targetNetIncome: Number(e.target.value) })
            }
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="targetShares">Shares Outstanding</Label>
          <Input
            id="targetShares"
            type="number"
            value={inputs.targetShares}
            onChange={(e) =>
              setInputs({ ...inputs, targetShares: Number(e.target.value) })
            }
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="targetPrice">Share Price ($)</Label>
          <Input
            id="targetPrice"
            type="number"
            value={inputs.targetPrice}
            onChange={(e) =>
              setInputs({ ...inputs, targetPrice: Number(e.target.value) })
            }
          />
        </div>
      </div>
    </Card>
  );
}