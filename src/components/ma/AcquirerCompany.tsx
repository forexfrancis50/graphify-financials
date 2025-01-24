import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";

interface AcquirerCompanyProps {
  inputs: {
    acquirerRevenue: number;
    acquirerEBITDA: number;
    acquirerNetIncome: number;
    acquirerShares: number;
    acquirerPrice: number;
  };
  setInputs: (inputs: any) => void;
}

export function AcquirerCompany({ inputs, setInputs }: AcquirerCompanyProps) {
  return (
    <Card className="p-6 space-y-4">
      <h2 className="text-xl font-semibold">Acquirer Company</h2>
      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="acquirerRevenue">Revenue ($)</Label>
          <Input
            id="acquirerRevenue"
            type="number"
            value={inputs.acquirerRevenue}
            onChange={(e) =>
              setInputs({ ...inputs, acquirerRevenue: Number(e.target.value) })
            }
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="acquirerEBITDA">EBITDA ($)</Label>
          <Input
            id="acquirerEBITDA"
            type="number"
            value={inputs.acquirerEBITDA}
            onChange={(e) =>
              setInputs({ ...inputs, acquirerEBITDA: Number(e.target.value) })
            }
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="acquirerNetIncome">Net Income ($)</Label>
          <Input
            id="acquirerNetIncome"
            type="number"
            value={inputs.acquirerNetIncome}
            onChange={(e) =>
              setInputs({ ...inputs, acquirerNetIncome: Number(e.target.value) })
            }
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="acquirerShares">Shares Outstanding</Label>
          <Input
            id="acquirerShares"
            type="number"
            value={inputs.acquirerShares}
            onChange={(e) =>
              setInputs({ ...inputs, acquirerShares: Number(e.target.value) })
            }
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="acquirerPrice">Share Price ($)</Label>
          <Input
            id="acquirerPrice"
            type="number"
            value={inputs.acquirerPrice}
            onChange={(e) =>
              setInputs({ ...inputs, acquirerPrice: Number(e.target.value) })
            }
          />
        </div>
      </div>
    </Card>
  );
}