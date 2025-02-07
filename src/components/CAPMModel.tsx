
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

interface CAPMInputs {
  riskFreeRate: number;
  marketReturn: number;
  beta: number;
  numPoints: number;
}

export function CAPMModel() {
  const { toast } = useToast();
  const [inputs, setInputs] = useState<CAPMInputs>({
    riskFreeRate: 0.02,
    marketReturn: 0.10,
    beta: 1.0,
    numPoints: 100,
  });

  const [securityLine, setSecurityLine] = useState<{ marketReturn: number; expectedReturn: number }[]>([]);

  const generateCAPM = () => {
    const points = [];
    const step = (inputs.marketReturn * 2) / inputs.numPoints;
    
    for (let i = 0; i <= inputs.numPoints; i++) {
      const marketReturn = -inputs.marketReturn + (i * step);
      const expectedReturn = inputs.riskFreeRate + 
        inputs.beta * (marketReturn - inputs.riskFreeRate);
      
      points.push({
        marketReturn: Number((marketReturn * 100).toFixed(2)),
        expectedReturn: Number((expectedReturn * 100).toFixed(2)),
      });
    }

    setSecurityLine(points);
    toast({
      title: "CAPM Line Generated",
      description: "Security market line has been calculated using CAPM model",
    });
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <h1 className="text-3xl font-bold text-primary">Capital Asset Pricing Model (CAPM)</h1>
      
      <div className="grid md:grid-cols-2 gap-6">
        <Card className="p-6 space-y-4">
          <h2 className="text-xl font-semibold">Model Parameters</h2>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="riskFreeRate">Risk-Free Rate (%)</Label>
              <Input
                id="riskFreeRate"
                type="number"
                step="0.01"
                value={inputs.riskFreeRate * 100}
                onChange={(e) => setInputs({ ...inputs, riskFreeRate: Number(e.target.value) / 100 })}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="marketReturn">Expected Market Return (%)</Label>
              <Input
                id="marketReturn"
                type="number"
                step="0.01"
                value={inputs.marketReturn * 100}
                onChange={(e) => setInputs({ ...inputs, marketReturn: Number(e.target.value) / 100 })}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="beta">Asset Beta</Label>
              <Input
                id="beta"
                type="number"
                step="0.01"
                value={inputs.beta}
                onChange={(e) => setInputs({ ...inputs, beta: Number(e.target.value) })}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="numPoints">Number of Data Points</Label>
              <Input
                id="numPoints"
                type="number"
                value={inputs.numPoints}
                onChange={(e) => setInputs({ ...inputs, numPoints: Number(e.target.value) })}
              />
            </div>
          </div>

          <Button onClick={generateCAPM} className="w-full mt-4">
            Generate Security Market Line
          </Button>
        </Card>

        <Card className="p-6">
          <h2 className="text-xl font-semibold mb-4">Security Market Line</h2>
          {securityLine.length > 0 ? (
            <ResponsiveContainer width="100%" height={400}>
              <LineChart data={securityLine}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis 
                  dataKey="marketReturn" 
                  label={{ value: 'Market Return (%)', position: 'bottom' }}
                />
                <YAxis 
                  label={{ value: 'Expected Return (%)', angle: -90, position: 'left' }}
                />
                <Tooltip />
                <Line
                  type="monotone"
                  dataKey="expectedReturn"
                  stroke="#1E293B"
                  dot={false}
                  name="Expected Return"
                />
              </LineChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-[400px] flex items-center justify-center text-muted-foreground">
              Generate the security market line to see the visualization
            </div>
          )}
        </Card>
      </div>
    </div>
  );
}
