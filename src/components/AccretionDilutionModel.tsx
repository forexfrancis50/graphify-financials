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

interface AccretionDilutionInputs {
  // Acquirer Details
  acquirerShares: number;
  acquirerEPS: number;
  acquirerPE: number;
  
  // Target Details
  targetShares: number;
  targetEPS: number;
  targetPE: number;
  
  // Deal Details
  premiumPercentage: number;
  cashConsideration: number;
  debtFinancing: number;
  interestRate: number;
  taxRate: number;
  synergies: number;
}

export function AccretionDilutionModel() {
  const [inputs, setInputs] = useState<AccretionDilutionInputs>({
    acquirerShares: 1000000,
    acquirerEPS: 2.5,
    acquirerPE: 15,
    
    targetShares: 500000,
    targetEPS: 1.8,
    targetPE: 12,
    
    premiumPercentage: 30,
    cashConsideration: 5000000,
    debtFinancing: 3000000,
    interestRate: 5,
    taxRate: 25,
    synergies: 1000000,
  });

  const [results, setResults] = useState<any>(null);

  const calculateAccretionDilution = () => {
    // Calculate pre-deal metrics
    const acquirerMarketCap = inputs.acquirerShares * (inputs.acquirerEPS * inputs.acquirerPE);
    const targetMarketCap = inputs.targetShares * (inputs.targetEPS * inputs.targetPE);
    
    // Calculate deal value with premium
    const dealValue = targetMarketCap * (1 + inputs.premiumPercentage / 100);
    
    // Calculate stock consideration
    const stockConsideration = dealValue - inputs.cashConsideration;
    const newShares = stockConsideration / (inputs.acquirerEPS * inputs.acquirerPE);
    
    // Calculate interest expense and tax impact
    const interestExpense = inputs.debtFinancing * (inputs.interestRate / 100);
    const taxSavings = interestExpense * (inputs.taxRate / 100);
    
    // Calculate combined earnings
    const acquirerEarnings = inputs.acquirerEPS * inputs.acquirerShares;
    const targetEarnings = inputs.targetEPS * inputs.targetShares;
    const combinedEarnings = acquirerEarnings + targetEarnings + inputs.synergies - interestExpense + taxSavings;
    
    // Calculate new EPS
    const totalNewShares = inputs.acquirerShares + newShares;
    const newEPS = combinedEarnings / totalNewShares;
    
    // Calculate accretion/dilution
    const accretionDilution = ((newEPS / inputs.acquirerEPS) - 1) * 100;
    
    // Prepare sensitivity analysis data
    const premiumSensitivity = [-10, -5, 0, 5, 10].map(premiumDelta => {
      const adjustedPremium = inputs.premiumPercentage + premiumDelta;
      const adjustedDealValue = targetMarketCap * (1 + adjustedPremium / 100);
      const adjustedStockConsideration = adjustedDealValue - inputs.cashConsideration;
      const adjustedNewShares = adjustedStockConsideration / (inputs.acquirerEPS * inputs.acquirerPE);
      const adjustedTotalShares = inputs.acquirerShares + adjustedNewShares;
      const adjustedEPS = combinedEarnings / adjustedTotalShares;
      return {
        premium: adjustedPremium,
        accretionDilution: ((adjustedEPS / inputs.acquirerEPS) - 1) * 100
      };
    });

    setResults({
      dealValue,
      newShares,
      newEPS,
      accretionDilution,
      premiumSensitivity,
      combinedEarnings,
      totalNewShares,
      interestExpense,
      taxSavings
    });
  };

  return (
    <div className="p-6 space-y-6 animate-fade-in">
      <h1 className="text-3xl font-bold text-primary">Accretion/Dilution Analysis</h1>
      
      <Tabs defaultValue="inputs" className="w-full">
        <TabsList>
          <TabsTrigger value="inputs">Model Inputs</TabsTrigger>
          <TabsTrigger value="results">Results</TabsTrigger>
        </TabsList>

        <TabsContent value="inputs">
          <div className="grid md:grid-cols-2 gap-6">
            <Card className="p-6 space-y-4">
              <h2 className="text-xl font-semibold">Acquirer Details</h2>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="acquirerShares">Shares Outstanding</Label>
                  <Input
                    id="acquirerShares"
                    type="number"
                    value={inputs.acquirerShares}
                    onChange={(e) =>
                      setInputs({ ...inputs, acquirerShares: Number(e.target.value) })
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="acquirerEPS">EPS ($)</Label>
                  <Input
                    id="acquirerEPS"
                    type="number"
                    value={inputs.acquirerEPS}
                    onChange={(e) =>
                      setInputs({ ...inputs, acquirerEPS: Number(e.target.value) })
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="acquirerPE">P/E Ratio</Label>
                  <Input
                    id="acquirerPE"
                    type="number"
                    value={inputs.acquirerPE}
                    onChange={(e) =>
                      setInputs({ ...inputs, acquirerPE: Number(e.target.value) })
                    }
                  />
                </div>
              </div>
            </Card>

            <Card className="p-6 space-y-4">
              <h2 className="text-xl font-semibold">Target Details</h2>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="targetShares">Shares Outstanding</Label>
                  <Input
                    id="targetShares"
                    type="number"
                    value={inputs.targetShares}
                    onChange={(e) =>
                      setInputs({ ...inputs, targetShares: Number(e.target.value) })
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="targetEPS">EPS ($)</Label>
                  <Input
                    id="targetEPS"
                    type="number"
                    value={inputs.targetEPS}
                    onChange={(e) =>
                      setInputs({ ...inputs, targetEPS: Number(e.target.value) })
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="targetPE">P/E Ratio</Label>
                  <Input
                    id="targetPE"
                    type="number"
                    value={inputs.targetPE}
                    onChange={(e) =>
                      setInputs({ ...inputs, targetPE: Number(e.target.value) })
                    }
                  />
                </div>
              </div>
            </Card>

            <Card className="p-6 space-y-4">
              <h2 className="text-xl font-semibold">Deal Structure</h2>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="premiumPercentage">Premium (%)</Label>
                  <Input
                    id="premiumPercentage"
                    type="number"
                    value={inputs.premiumPercentage}
                    onChange={(e) =>
                      setInputs({ ...inputs, premiumPercentage: Number(e.target.value) })
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="cashConsideration">Cash Consideration ($)</Label>
                  <Input
                    id="cashConsideration"
                    type="number"
                    value={inputs.cashConsideration}
                    onChange={(e) =>
                      setInputs({ ...inputs, cashConsideration: Number(e.target.value) })
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="debtFinancing">Debt Financing ($)</Label>
                  <Input
                    id="debtFinancing"
                    type="number"
                    value={inputs.debtFinancing}
                    onChange={(e) =>
                      setInputs({ ...inputs, debtFinancing: Number(e.target.value) })
                    }
                  />
                </div>
              </div>
            </Card>

            <Card className="p-6 space-y-4">
              <h2 className="text-xl font-semibold">Other Assumptions</h2>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="interestRate">Interest Rate (%)</Label>
                  <Input
                    id="interestRate"
                    type="number"
                    value={inputs.interestRate}
                    onChange={(e) =>
                      setInputs({ ...inputs, interestRate: Number(e.target.value) })
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="taxRate">Tax Rate (%)</Label>
                  <Input
                    id="taxRate"
                    type="number"
                    value={inputs.taxRate}
                    onChange={(e) =>
                      setInputs({ ...inputs, taxRate: Number(e.target.value) })
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="synergies">Expected Synergies ($)</Label>
                  <Input
                    id="synergies"
                    type="number"
                    value={inputs.synergies}
                    onChange={(e) =>
                      setInputs({ ...inputs, synergies: Number(e.target.value) })
                    }
                  />
                </div>
              </div>
            </Card>
          </div>

          <Button onClick={calculateAccretionDilution} className="w-full mt-6">
            Calculate Accretion/Dilution
          </Button>
        </TabsContent>

        <TabsContent value="results">
          {results ? (
            <div className="space-y-6">
              <Card className="p-6">
                <h2 className="text-xl font-semibold mb-4">Deal Summary</h2>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div>
                    <p className="text-sm text-gray-500">Deal Value</p>
                    <p className="text-lg font-semibold">
                      ${results.dealValue.toLocaleString()}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">New Shares Issued</p>
                    <p className="text-lg font-semibold">
                      {Math.round(results.newShares).toLocaleString()}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Pro Forma EPS</p>
                    <p className="text-lg font-semibold">
                      ${results.newEPS.toFixed(2)}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Accretion/(Dilution)</p>
                    <p className={`text-lg font-semibold ${
                      results.accretionDilution >= 0 ? "text-green-600" : "text-red-600"
                    }`}>
                      {results.accretionDilution.toFixed(2)}%
                    </p>
                  </div>
                </div>
              </Card>

              <Card className="p-6">
                <h2 className="text-xl font-semibold mb-4">Premium Sensitivity Analysis</h2>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={results.premiumSensitivity}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="premium" name="Premium %" />
                    <YAxis name="Accretion/Dilution %" />
                    <Tooltip />
                    <Line
                      type="monotone"
                      dataKey="accretionDilution"
                      stroke="#1E293B"
                      name="Accretion/Dilution %"
                    />
                  </LineChart>
                </ResponsiveContainer>
              </Card>

              <Card className="p-6">
                <h2 className="text-xl font-semibold mb-4">Additional Metrics</h2>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div>
                    <p className="text-sm text-gray-500">Combined Earnings</p>
                    <p className="text-lg font-semibold">
                      ${results.combinedEarnings.toLocaleString()}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Total Shares Outstanding</p>
                    <p className="text-lg font-semibold">
                      {Math.round(results.totalNewShares).toLocaleString()}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Interest Expense</p>
                    <p className="text-lg font-semibold">
                      ${results.interestExpense.toLocaleString()}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Tax Savings</p>
                    <p className="text-lg font-semibold">
                      ${results.taxSavings.toLocaleString()}
                    </p>
                  </div>
                </div>
              </Card>
            </div>
          ) : (
            <div className="text-center p-12 text-gray-500">
              Enter inputs and calculate to see results
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}