
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

interface HullWhiteInputs {
  shortRate: number;
  meanReversion: number;
  volatility: number;
  theta: number;
  timeSteps: number;
  timePeriod: number;
}

export function HullWhiteModel() {
  const { toast } = useToast();
  const [inputs, setInputs] = useState<HullWhiteInputs>({
    shortRate: 0.03,
    meanReversion: 0.1,
    volatility: 0.02,
    theta: 0.04,
    timeSteps: 100,
    timePeriod: 1,
  });

  const [ratesPath, setRatesPath] = useState<{ time: number; rate: number }[]>([]);

  const generatePath = () => {
    const dt = inputs.timePeriod / inputs.timeSteps;
    const path = [{ time: 0, rate: inputs.shortRate }];
    let currentRate = inputs.shortRate;

    for (let t = 1; t <= inputs.timeSteps; t++) {
      const drift = inputs.meanReversion * (inputs.theta - currentRate) * dt;
      const diffusion = inputs.volatility * Math.sqrt(dt) * (Math.random() * 2 - 1);
      currentRate += drift + diffusion;
      
      path.push({
        time: Number((t * dt).toFixed(2)),
        rate: Number((currentRate * 100).toFixed(2)),
      });
    }

    setRatesPath(path);
    toast({
      title: "Path Generated",
      description: "Interest rate path has been simulated using the Hull-White model",
    });
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <h1 className="text-3xl font-bold text-primary">Hull-White Interest Rate Model</h1>
      
      <div className="grid md:grid-cols-2 gap-6">
        <Card className="p-6 space-y-4">
          <h2 className="text-xl font-semibold">Model Parameters</h2>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="shortRate">Short Rate (%)</Label>
              <Input
                id="shortRate"
                type="number"
                step="0.01"
                value={inputs.shortRate * 100}
                onChange={(e) => setInputs({ ...inputs, shortRate: Number(e.target.value) / 100 })}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="meanReversion">Mean Reversion Speed</Label>
              <Input
                id="meanReversion"
                type="number"
                step="0.01"
                value={inputs.meanReversion}
                onChange={(e) => setInputs({ ...inputs, meanReversion: Number(e.target.value) })}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="volatility">Volatility</Label>
              <Input
                id="volatility"
                type="number"
                step="0.001"
                value={inputs.volatility}
                onChange={(e) => setInputs({ ...inputs, volatility: Number(e.target.value) })}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="theta">Mean Level (%)</Label>
              <Input
                id="theta"
                type="number"
                step="0.01"
                value={inputs.theta * 100}
                onChange={(e) => setInputs({ ...inputs, theta: Number(e.target.value) / 100 })}
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
