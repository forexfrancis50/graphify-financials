import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
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

interface OptionInputs {
  stockPrice: number;
  strikePrice: number;
  timeToExpiry: number;
  riskFreeRate: number;
  volatility: number;
  optionType: "call" | "put";
}

export function OptionsModel() {
  const { toast } = useToast();
  const [inputs, setInputs] = useState<OptionInputs>({
    stockPrice: 100,
    strikePrice: 100,
    timeToExpiry: 1,
    riskFreeRate: 5,
    volatility: 20,
    optionType: "call",
  });

  const [results, setResults] = useState<any>(null);

  const calculateBlackScholes = () => {
    const S = inputs.stockPrice;
    const K = inputs.strikePrice;
    const T = inputs.timeToExpiry;
    const r = inputs.riskFreeRate / 100;
    const sigma = inputs.volatility / 100;

    const d1 = (Math.log(S / K) + (r + sigma * sigma / 2) * T) / (sigma * Math.sqrt(T));
    const d2 = d1 - sigma * Math.sqrt(T);

    const Nd1 = normalCDF(inputs.optionType === "call" ? d1 : -d1);
    const Nd2 = normalCDF(inputs.optionType === "call" ? d2 : -d2);

    let optionPrice;
    if (inputs.optionType === "call") {
      optionPrice = S * Nd1 - K * Math.exp(-r * T) * Nd2;
    } else {
      optionPrice = K * Math.exp(-r * T) * (1 - Nd2) - S * (1 - Nd1);
    }

    // Calculate Greeks
    const delta = inputs.optionType === "call" ? Nd1 : Nd1 - 1;
    const gamma = Math.exp(-(d1 * d1) / 2) / (S * sigma * Math.sqrt(T) * Math.sqrt(2 * Math.PI));
    const theta = -(S * sigma * Math.exp(-(d1 * d1) / 2)) / (2 * Math.sqrt(T) * Math.sqrt(2 * Math.PI)) -
      r * K * Math.exp(-r * T) * (inputs.optionType === "call" ? Nd2 : -Nd2);
    const vega = S * Math.sqrt(T) * Math.exp(-(d1 * d1) / 2) / Math.sqrt(2 * Math.PI);
    const rho = K * T * Math.exp(-r * T) * (inputs.optionType === "call" ? Nd2 : -Nd2);

    // Generate sensitivity analysis data
    const sensitivityData = [];
    const priceRange = S * 0.5;
    for (let price = S - priceRange; price <= S + priceRange; price += priceRange / 10) {
      const d1_new = (Math.log(price / K) + (r + sigma * sigma / 2) * T) / (sigma * Math.sqrt(T));
      const d2_new = d1_new - sigma * Math.sqrt(T);
      const Nd1_new = normalCDF(inputs.optionType === "call" ? d1_new : -d1_new);
      const Nd2_new = normalCDF(inputs.optionType === "call" ? d2_new : -d2_new);
      
      let price_new;
      if (inputs.optionType === "call") {
        price_new = price * Nd1_new - K * Math.exp(-r * T) * Nd2_new;
      } else {
        price_new = K * Math.exp(-r * T) * (1 - Nd2_new) - price * (1 - Nd1_new);
      }

      sensitivityData.push({
        stockPrice: price,
        optionPrice: price_new,
      });
    }

    setResults({
      optionPrice,
      delta,
      gamma,
      theta,
      vega,
      rho,
      sensitivityData,
    });

    toast({
      title: "Calculations Complete",
      description: "Option pricing metrics have been updated",
    });
  };

  const normalCDF = (x: number): number => {
    const t = 1 / (1 + 0.2316419 * Math.abs(x));
    const d = 0.3989423 * Math.exp(-x * x / 2);
    const probability = d * t * (0.3193815 + t * (-0.3565638 + t * (1.781478 + t * (-1.821256 + t * 1.330274))));
    return x > 0 ? 1 - probability : probability;
  };

  return (
    <div className="p-6 space-y-6 animate-fade-in">
      <h1 className="text-3xl font-bold text-primary">Options Pricing Model</h1>

      <Tabs defaultValue="inputs" className="w-full">
        <TabsList>
          <TabsTrigger value="inputs">Option Inputs</TabsTrigger>
          <TabsTrigger value="results">Pricing Results</TabsTrigger>
        </TabsList>

        <TabsContent value="inputs">
          <div className="grid md:grid-cols-2 gap-6">
            <Card className="p-6 space-y-4">
              <h2 className="text-xl font-semibold">Market Data</h2>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="stockPrice">Stock Price ($)</Label>
                  <Input
                    id="stockPrice"
                    type="number"
                    value={inputs.stockPrice}
                    onChange={(e) =>
                      setInputs({ ...inputs, stockPrice: Number(e.target.value) })
                    }
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="strikePrice">Strike Price ($)</Label>
                  <Input
                    id="strikePrice"
                    type="number"
                    value={inputs.strikePrice}
                    onChange={(e) =>
                      setInputs({ ...inputs, strikePrice: Number(e.target.value) })
                    }
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="timeToExpiry">Time to Expiry (Years)</Label>
                  <Input
                    id="timeToExpiry"
                    type="number"
                    value={inputs.timeToExpiry}
                    onChange={(e) =>
                      setInputs({ ...inputs, timeToExpiry: Number(e.target.value) })
                    }
                  />
                </div>
              </div>
            </Card>

            <Card className="p-6 space-y-4">
              <h2 className="text-xl font-semibold">Option Parameters</h2>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="riskFreeRate">Risk-Free Rate (%)</Label>
                  <Input
                    id="riskFreeRate"
                    type="number"
                    value={inputs.riskFreeRate}
                    onChange={(e) =>
                      setInputs({ ...inputs, riskFreeRate: Number(e.target.value) })
                    }
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="volatility">Volatility (%)</Label>
                  <Input
                    id="volatility"
                    type="number"
                    value={inputs.volatility}
                    onChange={(e) =>
                      setInputs({ ...inputs, volatility: Number(e.target.value) })
                    }
                  />
                </div>

                <div className="space-y-2">
                  <Label>Option Type</Label>
                  <div className="flex space-x-4">
                    <Button
                      variant={inputs.optionType === "call" ? "default" : "outline"}
                      onClick={() => setInputs({ ...inputs, optionType: "call" })}
                    >
                      Call
                    </Button>
                    <Button
                      variant={inputs.optionType === "put" ? "default" : "outline"}
                      onClick={() => setInputs({ ...inputs, optionType: "put" })}
                    >
                      Put
                    </Button>
                  </div>
                </div>
              </div>
            </Card>
          </div>

          <Button onClick={calculateBlackScholes} className="w-full mt-6">
            Calculate Option Price
          </Button>
        </TabsContent>

        <TabsContent value="results">
          {results ? (
            <div className="space-y-6">
              <Card className="p-6">
                <h2 className="text-xl font-semibold mb-4">Option Value</h2>
                <p className="text-3xl font-bold">${results.optionPrice.toFixed(2)}</p>
              </Card>

              <Card className="p-6">
                <h2 className="text-xl font-semibold mb-4">Greeks</h2>
                <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                  <div>
                    <p className="text-sm text-gray-500">Delta</p>
                    <p className="text-lg font-semibold">{results.delta.toFixed(4)}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Gamma</p>
                    <p className="text-lg font-semibold">{results.gamma.toFixed(4)}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Theta</p>
                    <p className="text-lg font-semibold">{results.theta.toFixed(4)}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Vega</p>
                    <p className="text-lg font-semibold">{results.vega.toFixed(4)}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Rho</p>
                    <p className="text-lg font-semibold">{results.rho.toFixed(4)}</p>
                  </div>
                </div>
              </Card>

              <Card className="p-6">
                <h2 className="text-xl font-semibold mb-4">Price Sensitivity</h2>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={results.sensitivityData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="stockPrice" />
                    <YAxis />
                    <Tooltip />
                    <Line
                      type="monotone"
                      dataKey="optionPrice"
                      stroke="#1E293B"
                      name="Option Price"
                    />
                  </LineChart>
                </ResponsiveContainer>
              </Card>
            </div>
          ) : (
            <div className="text-center p-12 text-gray-500">
              Enter inputs and calculate to see option pricing results
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}