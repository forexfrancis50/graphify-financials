import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";

interface SynergiesProps {
  inputs: {
    revenueSynergies: number;
    costSynergies: number;
    integrationCosts: number;
  };
  setInputs: (inputs: any) => void;
}

export function Synergies({ inputs, setInputs }: SynergiesProps) {
  return (
    <Card className="p-6 space-y-4">
      <h2 className="text-xl font-semibold">Synergies & Integration</h2>
      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="revenueSynergies">Revenue Synergies ($)</Label>
          <Input
            id="revenueSynergies"
            type="number"
            value={inputs.revenueSynergies}
            onChange={(e) =>
              setInputs({ ...inputs, revenueSynergies: Number(e.target.value) })
            }
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="costSynergies">Cost Synergies ($)</Label>
          <Input
            id="costSynergies"
            type="number"
            value={inputs.costSynergies}
            onChange={(e) =>
              setInputs({ ...inputs, costSynergies: Number(e.target.value) })
            }
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="integrationCosts">Integration Costs ($)</Label>
          <Input
            id="integrationCosts"
            type="number"
            value={inputs.integrationCosts}
            onChange={(e) =>
              setInputs({ ...inputs, integrationCosts: Number(e.target.value) })
            }
          />
        </div>
      </div>
    </Card>
  );
}