
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

interface BlackScholesInputs {
  spotPrice: number;
  strikePrice: number;
  timeToMaturity: number;
  riskFreeRate: number;
  volatility: number;
  steps: number;
}

export function BlackScholesModel() {
  const { toast } = useToast();
  const [inputs, setInputs] = useState<BlackScholesInputs>({
    spotPrice: 100,
    strikePrice: 100,
    timeToMaturity: 1,
    riskFreeRate: 0.05,
    volatility: 0.2,
    steps: 100,
  });

  const [optionPrices, setOptionPrices] = useState<{ spot: number; call: number; put: number }[]>([]);

  const calculateBlackScholes = () => {
    const points = [];
    const minSpot = inputs.spotPrice * 0.5;
    const maxSpot = inputs.spotPrice * 1.5;
    const step = (maxSpot - minSpot) / inputs.steps;

    for (let i = 0; i <= inputs.steps; i++) {
      const spot = minSpot + (i * step);
      const d1 = (Math.log(spot / inputs.strikePrice) + 
        (inputs.riskFreeRate + Math.pow(inputs.volatility, 2) / 2) * inputs.timeToMaturity) / 
        (inputs.volatility * Math.sqrt(inputs.timeToMaturity));
      const d2 = d1 - inputs.volatility * Math.sqrt(inputs.timeToMaturity);

      const call = spot * normalCDF(d1) - 
        inputs.strikePrice * Math.exp(-inputs.riskFreeRate * inputs.timeToMaturity) * normalCDF(d2);
      const put = call + inputs.strikePrice * 
        Math.exp(-inputs.riskFreeRate * inputs.timeToMaturity) - spot;

      points.push({
        spot: Number(spot.toFixed(2)),
        call: Number(call.toFixed(2)),
        put: Number(put.toFixed(2)),
      });
    }

    setOptionPrices(points);
    toast({
      title: "Option Prices Calculated",
      description: "Call and put option prices have been calculated using Black-Scholes model",
    });
  };

  // Standard normal cumulative distribution function
  const normalCDF = (x: number): number => {
    const t = 1 / (1 + 0.2316419 * Math.abs(x));
    const d = 0.3989423 * Math.exp(-x * x / 2);
    const probability = d * t * (0.3193815 + t * (-0.3565638 + t * (1.781478 + t * (-1.821256 + t * 1.330274))));
    return x > 0 ? 1 - probability : probability;
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <h1 className="text-3xl font-bold text-primary">Black-Scholes Option Pricing Model</h1>
      
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
              <Label htmlFor="strikePrice">Strike Price</Label>
              <Input
                id="strikePrice"
                type="number"
                step="0.01"
                value={inputs.strikePrice}
                onChange={(e) => setInputs({ ...inputs, strikePrice: Number(e.target.value) })}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="timeToMaturity">Time to Maturity (Years)</Label>
              <Input
                id="timeToMaturity"
                type="number"
                step="0.1"
                value={inputs.timeToMaturity}
                onChange={(e) => setInputs({ ...inputs, timeToMaturity: Number(e.target.value) })}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="riskFreeRate">Risk-Free Rate (%)</Label>
              <Input
                id="riskFreeRate"
                type="number"
                step="0.1"
                value={inputs.riskFreeRate * 100}
                onChange={(e) => setInputs({ ...inputs, riskFreeRate: Number(e.target.value) / 100 })}
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
          </div>

          <Button onClick={calculateBlackScholes} className="w-full mt-4">
            Calculate Option Prices
          </Button>
        </Card>

        <Card className="p-6">
          <h2 className="text-xl font-semibold mb-4">Option Prices vs Spot Price</h2>
          {optionPrices.length > 0 ? (
            <ResponsiveContainer width="100%" height={400}>
              <LineChart data={optionPrices}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis 
                  dataKey="spot" 
                  label={{ value: 'Spot Price', position: 'bottom' }}
                />
                <YAxis 
                  label={{ value: 'Option Price', angle: -90, position: 'left' }}
                />
                <Tooltip />
                <Line
                  type="monotone"
                  dataKey="call"
                  stroke="#2563EB"
                  dot={false}
                  name="Call Option"
                />
                <Line
                  type="monotone"
                  dataKey="put"
                  stroke="#DC2626"
                  dot={false}
                  name="Put Option"
                />
              </LineChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-[400px] flex items-center justify-center text-muted-foreground">
              Calculate option prices to see the visualization
            </div>
          )}
        </Card>
      </div>
    </div>
  );
}
