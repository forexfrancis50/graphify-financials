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

interface ProjectInputs {
  initialInvestment: number;
  cashFlows: number[];
  discountRate: number;
  projectLife: number;
}

export function CapitalBudgetingModel() {
  const { toast } = useToast();
  const [inputs, setInputs] = useState<ProjectInputs>({
    initialInvestment: 1000000,
    cashFlows: [200000, 300000, 400000, 500000, 600000],
    discountRate: 10,
    projectLife: 5,
  });

  const [results, setResults] = useState<any>(null);

  const calculateNPV = () => {
    let npv = -inputs.initialInvestment;
    const cashFlowData = [];

    for (let i = 0; i < inputs.projectLife; i++) {
      const discountFactor = Math.pow(1 + inputs.discountRate / 100, i + 1);
      const presentValue = inputs.cashFlows[i] / discountFactor;
      npv += presentValue;

      cashFlowData.push({
        year: i + 1,
        cashFlow: inputs.cashFlows[i],
        presentValue: Math.round(presentValue),
        cumulativeNPV: Math.round(npv),
      });
    }

    const irr = calculateIRR(inputs.initialInvestment, inputs.cashFlows);

    setResults({
      npv,
      irr,
      paybackPeriod: calculatePaybackPeriod(inputs.initialInvestment, inputs.cashFlows),
      cashFlowData,
    });

    toast({
      title: "Calculations Complete",
      description: "Capital budgeting metrics have been updated",
    });
  };

  const calculateIRR = (initialInvestment: number, cashFlows: number[]): number => {
    let irr = 0;
    const maxIterations = 1000;
    const tolerance = 0.000001;

    for (let i = 0; i < maxIterations; i++) {
      let npv = -initialInvestment;
      for (let j = 0; j < cashFlows.length; j++) {
        npv += cashFlows[j] / Math.pow(1 + irr, j + 1);
      }

      if (Math.abs(npv) < tolerance) {
        break;
      }

      irr += npv > 0 ? 0.001 : -0.001;
    }

    return irr * 100;
  };

  const calculatePaybackPeriod = (initialInvestment: number, cashFlows: number[]): number => {
    let remainingInvestment = initialInvestment;
    let years = 0;

    for (let i = 0; i < cashFlows.length; i++) {
      remainingInvestment -= cashFlows[i];
      if (remainingInvestment <= 0) {
        years = i + 1 + (remainingInvestment / cashFlows[i]);
        break;
      }
    }

    return years;
  };

  return (
    <div className="p-6 space-y-6 animate-fade-in">
      <h1 className="text-3xl font-bold text-primary">Capital Budgeting Analysis</h1>

      <Tabs defaultValue="inputs" className="w-full">
        <TabsList>
          <TabsTrigger value="inputs">Project Inputs</TabsTrigger>
          <TabsTrigger value="results">Analysis Results</TabsTrigger>
        </TabsList>

        <TabsContent value="inputs">
          <div className="grid md:grid-cols-2 gap-6">
            <Card className="p-6 space-y-4">
              <h2 className="text-xl font-semibold">Initial Investment</h2>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="initialInvestment">Initial Investment ($)</Label>
                  <Input
                    id="initialInvestment"
                    type="number"
                    value={inputs.initialInvestment}
                    onChange={(e) =>
                      setInputs({ ...inputs, initialInvestment: Number(e.target.value) })
                    }
                  />
                </div>

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
                  <Label htmlFor="projectLife">Project Life (Years)</Label>
                  <Input
                    id="projectLife"
                    type="number"
                    value={inputs.projectLife}
                    onChange={(e) => {
                      const years = Number(e.target.value);
                      setInputs({
                        ...inputs,
                        projectLife: years,
                        cashFlows: Array(years).fill(0),
                      });
                    }}
                  />
                </div>
              </div>
            </Card>

            <Card className="p-6 space-y-4">
              <h2 className="text-xl font-semibold">Cash Flows</h2>
              <div className="space-y-4">
                {inputs.cashFlows.map((cf, index) => (
                  <div key={index} className="space-y-2">
                    <Label htmlFor={`cashFlow${index}`}>Year {index + 1} Cash Flow ($)</Label>
                    <Input
                      id={`cashFlow${index}`}
                      type="number"
                      value={cf}
                      onChange={(e) => {
                        const newCashFlows = [...inputs.cashFlows];
                        newCashFlows[index] = Number(e.target.value);
                        setInputs({ ...inputs, cashFlows: newCashFlows });
                      }}
                    />
                  </div>
                ))}
              </div>
            </Card>
          </div>

          <Button onClick={calculateNPV} className="w-full mt-6">
            Calculate Metrics
          </Button>
        </TabsContent>

        <TabsContent value="results">
          {results ? (
            <div className="space-y-6">
              <Card className="p-6">
                <h2 className="text-xl font-semibold mb-4">Key Metrics</h2>
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <p className="text-sm text-gray-500">Net Present Value</p>
                    <p className="text-lg font-semibold">
                      ${Math.round(results.npv).toLocaleString()}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Internal Rate of Return</p>
                    <p className="text-lg font-semibold">{results.irr.toFixed(2)}%</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Payback Period</p>
                    <p className="text-lg font-semibold">{results.paybackPeriod.toFixed(2)} years</p>
                  </div>
                </div>
              </Card>

              <Card className="p-6">
                <h2 className="text-xl font-semibold mb-4">Cash Flow Analysis</h2>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={results.cashFlowData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="year" />
                    <YAxis />
                    <Tooltip />
                    <Line
                      type="monotone"
                      dataKey="cashFlow"
                      stroke="#1E293B"
                      name="Cash Flow"
                    />
                    <Line
                      type="monotone"
                      dataKey="presentValue"
                      stroke="#059669"
                      name="Present Value"
                    />
                  </LineChart>
                </ResponsiveContainer>
              </Card>
            </div>
          ) : (
            <div className="text-center p-12 text-gray-500">
              Enter inputs and calculate to see analysis results
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}