import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

interface VasicekInputs {
  r0: number;          // Initial interest rate
  theta: number;       // Long-term mean level
  kappa: number;       // Speed of reversion
  sigma: number;       // Volatility
  timeSteps: number;   // Number of time steps
  timePeriod: number;  // Time period in years
}

export function VasicekModel() {
  const { toast } = useToast();
  const [inputs, setInputs] = useState<VasicekInputs>({
    r0: 0.05,
    theta: 0.06,
    kappa: 0.3,
    sigma: 0.02,
    timeSteps: 100,
    timePeriod: 1,
  });

  const [ratesPath, setRatesPath] = useState<{ time: number; rate: number }[]>([]);

  const generatePath = () => {
    const dt = inputs.timePeriod / inputs.timeSteps;
    const path = [{ time: 0, rate: inputs.r0 }];
    let currentRate = inputs.r0;

    for (let t = 1; t <= inputs.timeSteps; t++) {
      // Vasicek model: dr = κ(θ - r)dt + σdW
      const drift = inputs.kappa * (inputs.theta - currentRate) * dt;
      const diffusion = inputs.sigma * Math.sqrt(dt) * (Math.random() * 2 - 1);
      currentRate += drift + diffusion;
      
      path.push({
        time: Number((t * dt).toFixed(2)),
        rate: Number((currentRate * 100).toFixed(2)), // Convert to percentage
      });
    }

    setRatesPath(path);
    toast({
      title: "Path Generated",
      description: "Interest rate path has been simulated using the Vasicek model",
    });
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <h1 className="text-3xl font-bold text-primary">Vasicek Interest Rate Model</h1>
      
      <div className="grid md:grid-cols-2 gap-6">
        <Card className="p-6 space-y-4">
          <h2 className="text-xl font-semibold">Model Parameters</h2>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="r0">Initial Interest Rate (%)</Label>
              <Input
                id="r0"
                type="number"
                step="0.01"
                value={inputs.r0 * 100}
                onChange={(e) => setInputs({ ...inputs, r0: Number(e.target.value) / 100 })}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="theta">Long-term Mean Rate (%)</Label>
              <Input
                id="theta"
                type="number"
                step="0.01"
                value={inputs.theta * 100}
                onChange={(e) => setInputs({ ...inputs, theta: Number(e.target.value) / 100 })}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="kappa">Mean Reversion Speed</Label>
              <Input
                id="kappa"
                type="number"
                step="0.01"
                value={inputs.kappa}
                onChange={(e) => setInputs({ ...inputs, kappa: Number(e.target.value) })}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="sigma">Volatility</Label>
              <Input
                id="sigma"
                type="number"
                step="0.001"
                value={inputs.sigma}
                onChange={(e) => setInputs({ ...inputs, sigma: Number(e.target.value) })}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="timePeriod">Time Period (Years)</Label>
              <Input
                id="timePeriod"
                type="number"
                step="0.5"
                value={inputs.timePeriod}
                onChange={(e) => setInputs({ ...inputs, timePeriod: Number(e.target.value) })}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="timeSteps">Number of Time Steps</Label>
              <Input
                id="timeSteps"
                type="number"
                value={inputs.timeSteps}
                onChange={(e) => setInputs({ ...inputs, timeSteps: Number(e.target.value) })}
              />
            </div>
          </div>

          <Button onClick={generatePath} className="w-full mt-4">
            Generate Interest Rate Path
          </Button>
        </Card>

        <Card className="p-6">
          <h2 className="text-xl font-semibold mb-4">Interest Rate Path</h2>
          {ratesPath.length > 0 ? (
            <ResponsiveContainer width="100%" height={400}>
              <LineChart data={ratesPath}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis 
                  dataKey="time" 
                  label={{ value: 'Time (Years)', position: 'bottom' }}
                />
                <YAxis 
                  label={{ value: 'Interest Rate (%)', angle: -90, position: 'left' }}
                />
                <Tooltip />
                <Line
                  type="monotone"
                  dataKey="rate"
                  stroke="#1E293B"
                  dot={false}
                  name="Interest Rate"
                />
              </LineChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-[400px] flex items-center justify-center text-muted-foreground">
              Generate a path to see the visualization
            </div>
          )}
        </Card>
      </div>
    </div>
  );
}