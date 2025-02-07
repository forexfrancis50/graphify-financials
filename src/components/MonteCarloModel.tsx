
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

interface MonteCarloInputs {
  spotPrice: number;
  drift: number;
  volatility: number;
  timeSteps: number;
  simulations: number;
  timePeriod: number;
}

export function MonteCarloModel() {
  const { toast } = useToast();
  const [inputs, setInputs] = useState<MonteCarloInputs>({
    spotPrice: 100,
    drift: 0.05,
    volatility: 0.2,
    timeSteps: 100,
    simulations: 10,
    timePeriod: 1,
  });

  const [simulatedPaths, setSimulatedPaths] = useState<{ time: number; [key: string]: number }[]>([]);

  const generatePaths = () => {
    const dt = inputs.timePeriod / inputs.timeSteps;
    const paths: { time: number; [key: string]: number }[] = Array(inputs.timeSteps + 1)
      .fill(null)
      .map((_, i) => ({ time: Number((i * dt).toFixed(2)) }));

    for (let sim = 0; sim < inputs.simulations; sim++) {
      let price = inputs.spotPrice;
      paths[0][`sim${sim}`] = price;

      for (let t = 1; t <= inputs.timeSteps; t++) {
        const drift = inputs.drift * dt;
        const diffusion = inputs.volatility * Math.sqrt(dt) * (Math.random() * 2 - 1);
        price *= Math.exp(drift + diffusion);
        paths[t][`sim${sim}`] = Number(price.toFixed(2));
      }
    }

    setSimulatedPaths(paths);
    toast({
      title: "Paths Generated",
      description: "Monte Carlo simulation paths have been generated",
    });
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <h1 className="text-3xl font-bold text-primary">Monte Carlo Simulation</h1>
      
      <div className="grid md:grid-cols-2 gap-6">
        <Card className="p-6 space-y-4">
          <h2 className="text-xl font-semibold">Model Parameters</h2>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="spotPrice">Spot Price</Label>
              <Input
                id="spotPrice"
                type="number"
                step="0.01"
                value={inputs.spotPrice}
                onChange={(e) => setInputs({ ...inputs, spotPrice: Number(e.target.value) })}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="drift">Drift Rate (%)</Label>
              <Input
                id="drift"
                type="number"
                step="0.1"
                value={inputs.drift * 100}
                onChange={(e) => setInputs({ ...inputs, drift: Number(e.target.value) / 100 })}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="volatility">Volatility (%)</Label>
              <Input
                id="volatility"
                type="number"
                step="0.1"
                value={inputs.volatility * 100}
                onChange={(e) => setInputs({ ...inputs, volatility: Number(e.target.value) / 100 })}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="simulations">Number of Simulations</Label>
              <Input
                id="simulations"
                type="number"
                max="20"
                value={inputs.simulations}
                onChange={(e) => setInputs({ ...inputs, simulations: Number(e.target.value) })}
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

          <Button onClick={generatePaths} className="w-full mt-4">
            Generate Simulation Paths
          </Button>
        </Card>

        <Card className="p-6">
          <h2 className="text-xl font-semibold mb-4">Price Paths</h2>
          {simulatedPaths.length > 0 ? (
            <ResponsiveContainer width="100%" height={400}>
              <LineChart data={simulatedPaths}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis 
                  dataKey="time" 
                  label={{ value: 'Time (Years)', position: 'bottom' }}
                />
                <YAxis 
                  label={{ value: 'Price', angle: -90, position: 'left' }}
                />
                <Tooltip />
                {Array.from({ length: inputs.simulations }).map((_, i) => (
                  <Line
                    key={i}
                    type="monotone"
                    dataKey={`sim${i}`}
                    stroke={`hsl(${(i * 360) / inputs.simulations}, 70%, 50%)`}
                    dot={false}
                    name={`Simulation ${i + 1}`}
                  />
                ))}
              </LineChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-[400px] flex items-center justify-center text-muted-foreground">
              Generate paths to see the visualization
            </div>
          )}
        </Card>
      </div>
    </div>
  );
}
