import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";

interface DealStructureProps {
  inputs: {
    cashConsideration: number;
    stockConsideration: number;
    premiumPaid: number;
  };
  setInputs: (inputs: any) => void;
}

export function DealStructure({ inputs, setInputs }: DealStructureProps) {
  return (
    <Card className="p-6 space-y-4">
      <h2 className="text-xl font-semibold">Deal Structure</h2>
      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="cashConsideration">Cash Consideration ($)</Label>
          <Input
            id="cashConsideration"
            type="number"
            value={inputs.cashConsideration}
            onChange={(e) =>
              setInputs({ ...inputs, cashConsideration: Number(e.target.value) })
            }
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="stockConsideration">Stock Consideration ($)</Label>
          <Input
            id="stockConsideration"
            type="number"
            value={inputs.stockConsideration}
            onChange={(e) =>
              setInputs({ ...inputs, stockConsideration: Number(e.target.value) })
            }
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="premiumPaid">Premium Paid (%)</Label>
          <Input
            id="premiumPaid"
            type="number"
            value={inputs.premiumPaid}
            onChange={(e) =>
              setInputs({ ...inputs, premiumPaid: Number(e.target.value) })
            }
          />
        </div>
      </div>
    </Card>
  );
}