import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ComparableAnalysis } from "./ComparableAnalysis";
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

interface IPOInputs {
  revenue: number;
  ebitda: number;
  netIncome: number;
  sharesOutstanding: number;
  proposedPrice: number;
  proposedShares: number;
  underwritingDiscount: number;
  otherExpenses: number;
  useOfProceeds: {
    debtRepayment: number;
    workingCapital: number;
    capex: number;
    acquisition: number;
  };
}

export function IPOModel() {
  const { toast } = useToast();
  const [inputs, setInputs] = useState<IPOInputs>({
    revenue: 100000000,
    ebitda: 20000000,
    netIncome: 10000000,
    sharesOutstanding: 10000000,
    proposedPrice: 15,
    proposedShares: 2000000,
    underwritingDiscount: 7,
    otherExpenses: 2000000,
    useOfProceeds: {
      debtRepayment: 40,
      workingCapital: 30,
      capex: 20,
      acquisition: 10,
    },
  });

  const [valuationMetrics, setValuationMetrics] = useState<any>(null);

  const calculateValuation = () => {
    const grossProceeds = inputs.proposedPrice * inputs.proposedShares;
    const underwritingFees = (grossProceeds * inputs.underwritingDiscount) / 100;
    const netProceeds = grossProceeds - underwritingFees - inputs.otherExpenses;

    const totalShares = inputs.sharesOutstanding + inputs.proposedShares;
    const marketCap = totalShares * inputs.proposedPrice;

    const metrics = {
      grossProceeds,
      netProceeds,
      marketCap,
      evToRevenue: marketCap / inputs.revenue,
      evToEbitda: marketCap / inputs.ebitda,
      peRatio: marketCap / inputs.netIncome,
      proceedsAllocation: Object.entries(inputs.useOfProceeds).map(([key, value]) => ({
        name: key,
        value: (netProceeds * value) / 100,
      })),
    };

    setValuationMetrics(metrics);
    toast({
      title: "Valuation Calculated",
      description: "IPO valuation metrics have been updated.",
    });
  };

  return (
    <div className="p-6 space-y-6 animate-fade-in">
      <h1 className="text-3xl font-bold text-primary">IPO Valuation Model</h1>

      <Tabs defaultValue="inputs" className="w-full">
        <TabsList>
          <TabsTrigger value="inputs">Company Inputs</TabsTrigger>
          <TabsTrigger value="offering">Offering Details</TabsTrigger>
          <TabsTrigger value="results">Results</TabsTrigger>
          <TabsTrigger value="comps">Comparable Analysis</TabsTrigger>
        </TabsList>

        <TabsContent value="inputs">
          <div className="grid md:grid-cols-2 gap-6">
            <Card className="p-6 space-y-4">
              <h2 className="text-xl font-semibold">Financial Metrics</h2>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="revenue">Revenue ($)</Label>
                  <Input
                    id="revenue"
                    type="number"
                    value={inputs.revenue}
                    onChange={(e) =>
                      setInputs({ ...inputs, revenue: Number(e.target.value) })
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="ebitda">EBITDA ($)</Label>
                  <Input
                    id="ebitda"
                    type="number"
                    value={inputs.ebitda}
                    onChange={(e) =>
                      setInputs({ ...inputs, ebitda: Number(e.target.value) })
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="netIncome">Net Income ($)</Label>
                  <Input
                    id="netIncome"
                    type="number"
                    value={inputs.netIncome}
                    onChange={(e) =>
                      setInputs({ ...inputs, netIncome: Number(e.target.value) })
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="sharesOutstanding">Current Shares Outstanding</Label>
                  <Input
                    id="sharesOutstanding"
                    type="number"
                    value={inputs.sharesOutstanding}
                    onChange={(e) =>
                      setInputs({ ...inputs, sharesOutstanding: Number(e.target.value) })
                    }
                  />
                </div>
              </div>
            </Card>

            <Card className="p-6 space-y-4">
              <h2 className="text-xl font-semibold">Use of Proceeds (%)</h2>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="debtRepayment">Debt Repayment</Label>
                  <Input
                    id="debtRepayment"
                    type="number"
                    value={inputs.useOfProceeds.debtRepayment}
                    onChange={(e) =>
                      setInputs({
                        ...inputs,
                        useOfProceeds: {
                          ...inputs.useOfProceeds,
                          debtRepayment: Number(e.target.value),
                        },
                      })
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="workingCapital">Working Capital</Label>
                  <Input
                    id="workingCapital"
                    type="number"
                    value={inputs.useOfProceeds.workingCapital}
                    onChange={(e) =>
                      setInputs({
                        ...inputs,
                        useOfProceeds: {
                          ...inputs.useOfProceeds,
                          workingCapital: Number(e.target.value),
                        },
                      })
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="capex">Capital Expenditure</Label>
                  <Input
                    id="capex"
                    type="number"
                    value={inputs.useOfProceeds.capex}
                    onChange={(e) =>
                      setInputs({
                        ...inputs,
                        useOfProceeds: {
                          ...inputs.useOfProceeds,
                          capex: Number(e.target.value),
                        },
                      })
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="acquisition">Acquisitions</Label>
                  <Input
                    id="acquisition"
                    type="number"
                    value={inputs.useOfProceeds.acquisition}
                    onChange={(e) =>
                      setInputs({
                        ...inputs,
                        useOfProceeds: {
                          ...inputs.useOfProceeds,
                          acquisition: Number(e.target.value),
                        },
                      })
                    }
                  />
                </div>
              </div>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="offering">
          <Card className="p-6 space-y-4">
            <h2 className="text-xl font-semibold">Offering Structure</h2>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="proposedPrice">Proposed Price per Share ($)</Label>
                  <Input
                    id="proposedPrice"
                    type="number"
                    value={inputs.proposedPrice}
                    onChange={(e) =>
                      setInputs({ ...inputs, proposedPrice: Number(e.target.value) })
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="proposedShares">New Shares to be Issued</Label>
                  <Input
                    id="proposedShares"
                    type="number"
                    value={inputs.proposedShares}
                    onChange={(e) =>
                      setInputs({ ...inputs, proposedShares: Number(e.target.value) })
                    }
                  />
                </div>
              </div>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="underwritingDiscount">Underwriting Discount (%)</Label>
                  <Input
                    id="underwritingDiscount"
                    type="number"
                    value={inputs.underwritingDiscount}
                    onChange={(e) =>
                      setInputs({ ...inputs, underwritingDiscount: Number(e.target.value) })
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="otherExpenses">Other IPO Expenses ($)</Label>
                  <Input
                    id="otherExpenses"
                    type="number"
                    value={inputs.otherExpenses}
                    onChange={(e) =>
                      setInputs({ ...inputs, otherExpenses: Number(e.target.value) })
                    }
                  />
                </div>
              </div>
            </div>
            <Button onClick={calculateValuation} className="w-full mt-6">
              Calculate Valuation
            </Button>
          </Card>
        </TabsContent>

        <TabsContent value="results">
          {valuationMetrics ? (
            <div className="space-y-6">
              <Card className="p-6">
                <h2 className="text-xl font-semibold mb-4">Offering Summary</h2>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div>
                    <p className="text-sm text-gray-500">Gross Proceeds</p>
                    <p className="text-lg font-semibold">
                      ${valuationMetrics.grossProceeds.toLocaleString()}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Net Proceeds</p>
                    <p className="text-lg font-semibold">
                      ${valuationMetrics.netProceeds.toLocaleString()}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Market Cap</p>
                    <p className="text-lg font-semibold">
                      ${valuationMetrics.marketCap.toLocaleString()}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Post-IPO Shares</p>
                    <p className="text-lg font-semibold">
                      {(inputs.sharesOutstanding + inputs.proposedShares).toLocaleString()}
                    </p>
                  </div>
                </div>
              </Card>

              <Card className="p-6">
                <h2 className="text-xl font-semibold mb-4">Valuation Metrics</h2>
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <p className="text-sm text-gray-500">EV/Revenue</p>
                    <p className="text-lg font-semibold">
                      {valuationMetrics.evToRevenue.toFixed(2)}x
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">EV/EBITDA</p>
                    <p className="text-lg font-semibold">
                      {valuationMetrics.evToEbitda.toFixed(2)}x
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">P/E Ratio</p>
                    <p className="text-lg font-semibold">
                      {valuationMetrics.peRatio.toFixed(2)}x
                    </p>
                  </div>
                </div>
              </Card>

              <Card className="p-6">
                <h2 className="text-xl font-semibold mb-4">Use of Proceeds</h2>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={valuationMetrics.proceedsAllocation}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Line
                      type="monotone"
                      dataKey="value"
                      stroke="#1E293B"
                      name="Amount ($)"
                    />
                  </LineChart>
                </ResponsiveContainer>
              </Card>
            </div>
          ) : (
            <div className="text-center p-12 text-gray-500">
              Enter inputs and calculate to see IPO valuation results
            </div>
          )}
        </TabsContent>

        <TabsContent value="comps">
          <ComparableAnalysis />
        </TabsContent>
      </Tabs>
    </div>
  );
}