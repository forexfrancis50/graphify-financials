import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { useToast } from "@/components/ui/use-toast";

interface DDMInputs {
  currentDividend: number;
  growthRate: number;
  terminalGrowthRate: number;
  discountRate: number;
  projectionYears: number;
  payoutRatio: number;
  currentEPS: number;
}

export function DDMModel() {
  const { toast } = useToast();
  const [inputs, setInputs] = useState<DDMInputs>({
    currentDividend: 2.5,
    growthRate: 8,
    terminalGrowthRate: 3,
    discountRate: 10,
    projectionYears: 5,
    payoutRatio: 60,
    currentEPS: 4.17,
  });

  const [projections, setProjections] = useState<any[]>([]);

  const calculateDDM = () => {
    if (inputs.discountRate <= inputs.terminalGrowthRate) {
      toast({
        title: "Invalid Inputs",
        description: "Discount rate must be greater than terminal growth rate",
        variant: "destructive",
      });
      return;
    }

    const newProjections = [];
    let currentDividend = inputs.currentDividend;

    for (let year = 1; year <= inputs.projectionYears; year++) {
      // Calculate growing dividend
      currentDividend *= (1 + inputs.growthRate / 100);
      
      // Terminal value calculation (only for final year)
      let terminalValue = 0;
      if (year === inputs.projectionYears) {
        const terminalDividend = currentDividend * (1 + inputs.terminalGrowthRate / 100);
        terminalValue = terminalDividend / (inputs.discountRate / 100 - inputs.terminalGrowthRate / 100);
      }
      
      // Present value calculations
      const discountFactor = Math.pow(1 + inputs.discountRate / 100, year);
      const presentValueDividend = currentDividend / discountFactor;
      const presentValueTerminal = terminalValue / discountFactor;
      
      // Sustainable growth rate calculation
      const retentionRatio = 1 - (inputs.payoutRatio / 100);
      const sustainableGrowthRate = retentionRatio * (inputs.currentEPS / inputs.currentDividend);

      newProjections.push({
        year,
        dividend: Math.round(currentDividend * 100) / 100,
        presentValueDividend: Math.round(presentValueDividend * 100) / 100,
        terminalValue: Math.round(terminalValue * 100) / 100,
        presentValueTerminal: Math.round(presentValueTerminal * 100) / 100,
        totalValue: Math.round((presentValueDividend + presentValueTerminal) * 100) / 100,
        sustainableGrowthRate: Math.round(sustainableGrowthRate * 100) / 100,
      });
    }

    setProjections(newProjections);
    
    toast({
      title: "Calculations Complete",
      description: "DDM valuation has been updated",
    });
  };

  return (
    <div className="p-6 space-y-6 animate-fade-in">
      <h1 className="text-3xl font-bold text-primary">Dividend Discount Model</h1>
      
      <Tabs defaultValue="inputs" className="w-full">
        <TabsList>
          <TabsTrigger value="inputs">Model Inputs</TabsTrigger>
          <TabsTrigger value="results">Results</TabsTrigger>
        </TabsList>

        <TabsContent value="inputs">
          <div className="grid md:grid-cols-2 gap-6">
            <Card className="p-6 space-y-4">
              <h2 className="text-xl font-semibold">Dividend & Growth</h2>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="currentDividend">Current Annual Dividend ($)</Label>
                  <Input
                    id="currentDividend"
                    type="number"
                    value={inputs.currentDividend}
                    onChange={(e) =>
                      setInputs({ ...inputs, currentDividend: Number(e.target.value) })
                    }
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="growthRate">Growth Rate (%)</Label>
                  <Input
                    id="growthRate"
                    type="number"
                    value={inputs.growthRate}
                    onChange={(e) =>
                      setInputs({ ...inputs, growthRate: Number(e.target.value) })
                    }
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="terminalGrowthRate">Terminal Growth Rate (%)</Label>
                  <Input
                    id="terminalGrowthRate"
                    type="number"
                    value={inputs.terminalGrowthRate}
                    onChange={(e) =>
                      setInputs({ ...inputs, terminalGrowthRate: Number(e.target.value) })
                    }
                  />
                </div>
              </div>
            </Card>

            <Card className="p-6 space-y-4">
              <h2 className="text-xl font-semibold">Valuation Parameters</h2>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="discountRate">Discount Rate (%)</Label>
                  <Input
                    id="discountRate"
                    type="number"
                    value={inputs.discountRate}
                    onChange={(e) =>
                      setInputs({ ...inputs, discountRate: Number(e.target.value) })
                    }
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="projectionYears">Projection Years</Label>
                  <Input
                    id="projectionYears"
                    type="number"
                    value={inputs.projectionYears}
                    onChange={(e) =>
                      setInputs({ ...inputs, projectionYears: Number(e.target.value) })
                    }
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="payoutRatio">Payout Ratio (%)</Label>
                  <Input
                    id="payoutRatio"
                    type="number"
                    value={inputs.payoutRatio}
                    onChange={(e) =>
                      setInputs({ ...inputs, payoutRatio: Number(e.target.value) })
                    }
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="currentEPS">Current EPS ($)</Label>
                  <Input
                    id="currentEPS"
                    type="number"
                    value={inputs.currentEPS}
                    onChange={(e) =>
                      setInputs({ ...inputs, currentEPS: Number(e.target.value) })
                    }
                  />
                </div>
              </div>
            </Card>
          </div>

          <Button onClick={calculateDDM} className="w-full mt-6">
            Calculate DDM
          </Button>
        </TabsContent>

        <TabsContent value="results">
          {projections.length > 0 ? (
            <div className="space-y-6">
              <Card className="p-6">
                <h2 className="text-xl font-semibold mb-4">Dividend Growth Projection</h2>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={projections}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="year" />
                    <YAxis />
                    <Tooltip />
                    <Line
                      type="monotone"
                      dataKey="dividend"
                      stroke="#1E293B"
                      name="Dividend"
                    />
                    <Line
                      type="monotone"
                      dataKey="totalValue"
                      stroke="#059669"
                      name="Present Value"
                    />
                  </LineChart>
                </ResponsiveContainer>
              </Card>

              <Card className="p-6">
                <h2 className="text-xl font-semibold mb-4">Detailed Projections</h2>
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead>
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Year
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Dividend
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          PV of Dividend
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Terminal Value
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          PV of Terminal Value
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Total Value
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {projections.map((row) => (
                        <tr key={row.year}>
                          <td className="px-6 py-4 whitespace-nowrap">{row.year}</td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            ${row.dividend}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            ${row.presentValueDividend}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            ${row.terminalValue}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            ${row.presentValueTerminal}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            ${row.totalValue}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </Card>
            </div>
          ) : (
            <div className="text-center p-12 text-gray-500">
              Enter inputs and calculate to see projections
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}