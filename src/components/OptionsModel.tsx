import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/components/ui/use-toast";
import { Slider } from "@/components/ui/slider";
import { ExportButtons } from "@/components/shared/ExportButtons";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
  AreaChart,
  Area,
} from "recharts";
import { Info, TrendingUp, Activity, DollarSign } from "lucide-react";

interface OptionInputs {
  stockPrice: number;
  strikePrice: number;
  timeToExpiry: number;
  riskFreeRate: number;
  volatility: number;
  optionType: "call" | "put";
  dividendYield: number;
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
    dividendYield: 0,
  });

  const [results, setResults] = useState<any>(null);
  const [historicalPrices, setHistoricalPrices] = useState<any[]>([]);

  useEffect(() => {
    // Simulate historical price data
    const generateHistoricalData = () => {
      const data = [];
      const periods = 30;
      let price = inputs.stockPrice;
      
      for (let i = periods; i >= 0; i--) {
        const randomChange = (Math.random() - 0.5) * 2;
        price = price * (1 + randomChange * 0.02);
        data.push({
          day: i,
          price: price.toFixed(2),
        });
      }
      setHistoricalPrices(data);
    };

    generateHistoricalData();
  }, [inputs.stockPrice]);

  const calculateBlackScholes = () => {
    const S = inputs.stockPrice;
    const K = inputs.strikePrice;
    const T = inputs.timeToExpiry;
    const r = inputs.riskFreeRate / 100;
    const sigma = inputs.volatility / 100;
    const q = inputs.dividendYield / 100;

    const d1 = (Math.log(S / K) + (r - q + sigma * sigma / 2) * T) / (sigma * Math.sqrt(T));
    const d2 = d1 - sigma * Math.sqrt(T);

    const Nd1 = normalCDF(inputs.optionType === "call" ? d1 : -d1);
    const Nd2 = normalCDF(inputs.optionType === "call" ? d2 : -d2);

    let optionPrice;
    if (inputs.optionType === "call") {
      optionPrice = S * Math.exp(-q * T) * Nd1 - K * Math.exp(-r * T) * Nd2;
    } else {
      optionPrice = K * Math.exp(-r * T) * (1 - Nd2) - S * Math.exp(-q * T) * (1 - Nd1);
    }

    // Calculate Greeks
    const delta = inputs.optionType === "call" ? 
      Math.exp(-q * T) * Nd1 : 
      Math.exp(-q * T) * (Nd1 - 1);
    const gamma = Math.exp(-q * T) * Math.exp(-(d1 * d1) / 2) / (S * sigma * Math.sqrt(T) * Math.sqrt(2 * Math.PI));
    const theta = -(S * sigma * Math.exp(-q * T) * Math.exp(-(d1 * d1) / 2)) / (2 * Math.sqrt(T) * Math.sqrt(2 * Math.PI)) -
      r * K * Math.exp(-r * T) * (inputs.optionType === "call" ? Nd2 : -Nd2) +
      q * S * Math.exp(-q * T) * (inputs.optionType === "call" ? Nd1 : -Nd1);
    const vega = S * Math.exp(-q * T) * Math.sqrt(T) * Math.exp(-(d1 * d1) / 2) / Math.sqrt(2 * Math.PI);
    const rho = K * T * Math.exp(-r * T) * (inputs.optionType === "call" ? Nd2 : -Nd2);

    // Generate sensitivity analysis data
    const sensitivityData = [];
    const priceRange = S * 0.5;
    for (let price = S - priceRange; price <= S + priceRange; price += priceRange / 10) {
      const d1_new = (Math.log(price / K) + (r - q + sigma * sigma / 2) * T) / (sigma * Math.sqrt(T));
      const d2_new = d1_new - sigma * Math.sqrt(T);
      const Nd1_new = normalCDF(inputs.optionType === "call" ? d1_new : -d1_new);
      const Nd2_new = normalCDF(inputs.optionType === "call" ? d2_new : -d2_new);
      
      let price_new;
      if (inputs.optionType === "call") {
        price_new = price * Math.exp(-q * T) * Nd1_new - K * Math.exp(-r * T) * Nd2_new;
      } else {
        price_new = K * Math.exp(-r * T) * (1 - Nd2_new) - price * Math.exp(-q * T) * (1 - Nd1_new);
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

  const getExportData = () => {
    if (!results) return [];
    
    return [
      {
        metric: "Option Price",
        value: results.optionPrice.toFixed(2),
      },
      {
        metric: "Delta",
        value: results.delta.toFixed(4),
      },
      {
        metric: "Gamma",
        value: results.gamma.toFixed(4),
      },
      {
        metric: "Theta",
        value: results.theta.toFixed(4),
      },
      {
        metric: "Vega",
        value: results.vega.toFixed(4),
      },
      {
        metric: "Rho",
        value: results.rho.toFixed(4),
      },
    ];
  };

  return (
    <div className="p-6 space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-primary">Options Pricing Model</h1>
        {results && (
          <ExportButtons
            title="Options Analysis"
            data={getExportData()}
          />
        )}
      </div>

      <Tabs defaultValue="inputs" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="inputs">
            <DollarSign className="mr-2 h-4 w-4" />
            Inputs
          </TabsTrigger>
          <TabsTrigger value="results">
            <Activity className="mr-2 h-4 w-4" />
            Analysis
          </TabsTrigger>
          <TabsTrigger value="market">
            <TrendingUp className="mr-2 h-4 w-4" />
            Market Data
          </TabsTrigger>
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
                  <Slider
                    id="timeToExpiry"
                    min={0.1}
                    max={5}
                    step={0.1}
                    value={[inputs.timeToExpiry]}
                    onValueChange={(value) =>
                      setInputs({ ...inputs, timeToExpiry: value[0] })
                    }
                  />
                  <span className="text-sm text-muted-foreground">{inputs.timeToExpiry} years</span>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="dividendYield">Dividend Yield (%)</Label>
                  <Input
                    id="dividendYield"
                    type="number"
                    value={inputs.dividendYield}
                    onChange={(e) =>
                      setInputs({ ...inputs, dividendYield: Number(e.target.value) })
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
                  <Slider
                    id="volatility"
                    min={1}
                    max={100}
                    step={1}
                    value={[inputs.volatility]}
                    onValueChange={(value) =>
                      setInputs({ ...inputs, volatility: value[0] })
                    }
                  />
                  <span className="text-sm text-muted-foreground">{inputs.volatility}%</span>
                </div>

                <div className="space-y-2">
                  <Label>Option Type</Label>
                  <Select
                    value={inputs.optionType}
                    onValueChange={(value: "call" | "put") =>
                      setInputs({ ...inputs, optionType: value })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="call">Call Option</SelectItem>
                      <SelectItem value="put">Put Option</SelectItem>
                    </SelectContent>
                  </Select>
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
                <p className="text-sm text-muted-foreground mt-2">
                  Theoretical price based on Black-Scholes model
                </p>
              </Card>

              <Card className="p-6">
                <h2 className="text-xl font-semibold mb-4">Greeks</h2>
                <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                  <div>
                    <p className="text-sm text-muted-foreground">Delta</p>
                    <p className="text-lg font-semibold">{results.delta.toFixed(4)}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Gamma</p>
                    <p className="text-lg font-semibold">{results.gamma.toFixed(4)}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Theta</p>
                    <p className="text-lg font-semibold">{results.theta.toFixed(4)}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Vega</p>
                    <p className="text-lg font-semibold">{results.vega.toFixed(4)}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Rho</p>
                    <p className="text-lg font-semibold">{results.rho.toFixed(4)}</p>
                  </div>
                </div>
              </Card>

              <Card className="p-6">
                <h2 className="text-xl font-semibold mb-4">Price Sensitivity</h2>
                <ResponsiveContainer width="100%" height={300}>
                  <AreaChart data={results.sensitivityData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis 
                      dataKey="stockPrice"
                      label={{ value: 'Stock Price ($)', position: 'bottom' }}
                    />
                    <YAxis
                      label={{ value: 'Option Price ($)', angle: -90, position: 'left' }}
                    />
                    <Tooltip />
                    <Legend />
                    <Area
                      type="monotone"
                      dataKey="optionPrice"
                      stroke="#1E293B"
                      fill="#93C5FD"
                      name="Option Price"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </Card>
            </div>
          ) : (
            <div className="text-center p-12 text-muted-foreground">
              Enter inputs and calculate to see option pricing results
            </div>
          )}
        </TabsContent>

        <TabsContent value="market">
          <Card className="p-6">
            <h2 className="text-xl font-semibold mb-4">Historical Price Movement</h2>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={historicalPrices}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis 
                  dataKey="day"
                  label={{ value: 'Days', position: 'bottom' }}
                />
                <YAxis
                  label={{ value: 'Stock Price ($)', angle: -90, position: 'left' }}
                />
                <Tooltip />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="price"
                  stroke="#059669"
                  name="Stock Price"
                />
              </LineChart>
            </ResponsiveContainer>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
