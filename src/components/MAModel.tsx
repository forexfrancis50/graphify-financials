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

interface MAInputs {
  // Target Company
  targetRevenue: number;
  targetEBITDA: number;
  targetNetIncome: number;
  targetShares: number;
  targetPrice: number;
  
  // Acquirer Company
  acquirerRevenue: number;
  acquirerEBITDA: number;
  acquirerNetIncome: number;
  acquirerShares: number;
  acquirerPrice: number;
  
  // Deal Structure
  cashConsideration: number;
  stockConsideration: number;
  premiumPaid: number;
  
  // Synergies
  revenueSynergies: number;
  costSynergies: number;
  integrationCosts: number;
}

export function MAModel() {
  const [inputs, setInputs] = useState<MAInputs>({
    targetRevenue: 1000000,
    targetEBITDA: 200000,
    targetNetIncome: 150000,
    targetShares: 1000000,
    targetPrice: 20,
    
    acquirerRevenue: 5000000,
    acquirerEBITDA: 1000000,
    acquirerNetIncome: 750000,
    acquirerShares: 5000000,
    acquirerPrice: 40,
    
    cashConsideration: 10000000,
    stockConsideration: 10000000,
    premiumPaid: 25,
    
    revenueSynergies: 100000,
    costSynergies: 200000,
    integrationCosts: 150000,
  });

  const [projections, setProjections] = useState<any[]>([]);

  const calculateMA = () => {
    // Calculate enterprise values
    const targetEV = inputs.targetShares * inputs.targetPrice * (1 + inputs.premiumPaid / 100);
    const acquirerEV = inputs.acquirerShares * inputs.acquirerPrice;
    
    // Calculate combined financials
    const combinedRevenue = inputs.targetRevenue + inputs.acquirerRevenue + inputs.revenueSynergies;
    const combinedEBITDA = inputs.targetEBITDA + inputs.acquirerEBITDA + inputs.costSynergies - inputs.integrationCosts;
    const combinedNetIncome = inputs.targetNetIncome + inputs.acquirerNetIncome + 
      (inputs.costSynergies - inputs.integrationCosts) * 0.7; // Assuming 30% tax rate
    
    // Calculate deal metrics
    const totalConsideration = inputs.cashConsideration + inputs.stockConsideration;
    const newShares = inputs.stockConsideration / inputs.acquirerPrice;
    const proFormaShares = inputs.acquirerShares + newShares;
    
    // EPS calculations
    const targetEPS = inputs.targetNetIncome / inputs.targetShares;
    const acquirerEPS = inputs.acquirerNetIncome / inputs.acquirerShares;
    const proFormaEPS = combinedNetIncome / proFormaShares;
    
    // Calculate accretion/dilution
    const accretionDilution = ((proFormaEPS / acquirerEPS) - 1) * 100;

    setProjections([{
      targetEV,
      acquirerEV,
      combinedRevenue,
      combinedEBITDA,
      combinedNetIncome,
      totalConsideration,
      newShares,
      proFormaShares,
      targetEPS,
      acquirerEPS,
      proFormaEPS,
      accretionDilution
    }]);
  };

  return (
    <div className="p-6 space-y-6 animate-fade-in">
      <h1 className="text-3xl font-bold text-primary">M&A Model</h1>
      
      <Tabs defaultValue="inputs" className="w-full">
        <TabsList>
          <TabsTrigger value="inputs">Model Inputs</TabsTrigger>
          <TabsTrigger value="results">Results</TabsTrigger>
        </TabsList>

        <TabsContent value="inputs">
          <div className="grid md:grid-cols-2 gap-6">
            <Card className="p-6 space-y-4">
              <h2 className="text-xl font-semibold">Target Company</h2>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="targetRevenue">Revenue ($)</Label>
                  <Input
                    id="targetRevenue"
                    type="number"
                    value={inputs.targetRevenue}
                    onChange={(e) =>
                      setInputs({ ...inputs, targetRevenue: Number(e.target.value) })
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="targetEBITDA">EBITDA ($)</Label>
                  <Input
                    id="targetEBITDA"
                    type="number"
                    value={inputs.targetEBITDA}
                    onChange={(e) =>
                      setInputs({ ...inputs, targetEBITDA: Number(e.target.value) })
                    }
                  />
                </div>
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
                  <Label htmlFor="targetPrice">Share Price ($)</Label>
                  <Input
                    id="targetPrice"
                    type="number"
                    value={inputs.targetPrice}
                    onChange={(e) =>
                      setInputs({ ...inputs, targetPrice: Number(e.target.value) })
                    }
                  />
                </div>
              </div>
            </Card>

            <Card className="p-6 space-y-4">
              <h2 className="text-xl font-semibold">Acquirer Company</h2>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="acquirerRevenue">Revenue ($)</Label>
                  <Input
                    id="acquirerRevenue"
                    type="number"
                    value={inputs.acquirerRevenue}
                    onChange={(e) =>
                      setInputs({ ...inputs, acquirerRevenue: Number(e.target.value) })
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="acquirerEBITDA">EBITDA ($)</Label>
                  <Input
                    id="acquirerEBITDA"
                    type="number"
                    value={inputs.acquirerEBITDA}
                    onChange={(e) =>
                      setInputs({ ...inputs, acquirerEBITDA: Number(e.target.value) })
                    }
                  />
                </div>
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
                  <Label htmlFor="acquirerPrice">Share Price ($)</Label>
                  <Input
                    id="acquirerPrice"
                    type="number"
                    value={inputs.acquirerPrice}
                    onChange={(e) =>
                      setInputs({ ...inputs, acquirerPrice: Number(e.target.value) })
                    }
                  />
                </div>
              </div>
            </Card>

            <Card className="p-6 space-y-4">
              <h2 className="text-xl font-semibold">Deal Structure</h2>
              <div className="space-y-4">
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
                  <Label htmlFor="stockConsideration">Stock Consideration ($)</Label>
                  <Input
                    id="stockConsideration"
                    type="number"
                    value={inputs.stockConsideration}
                    onChange={(e) =>
                      setInputs({ ...inputs, stockConsideration: Number(e.target.value) })
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="premiumPaid">Premium Paid (%)</Label>
                  <Input
                    id="premiumPaid"
                    type="number"
                    value={inputs.premiumPaid}
                    onChange={(e) =>
                      setInputs({ ...inputs, premiumPaid: Number(e.target.value) })
                    }
                  />
                </div>
              </div>
            </Card>

            <Card className="p-6 space-y-4">
              <h2 className="text-xl font-semibold">Synergies & Integration</h2>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="revenueSynergies">Revenue Synergies ($)</Label>
                  <Input
                    id="revenueSynergies"
                    type="number"
                    value={inputs.revenueSynergies}
                    onChange={(e) =>
                      setInputs({ ...inputs, revenueSynergies: Number(e.target.value) })
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="costSynergies">Cost Synergies ($)</Label>
                  <Input
                    id="costSynergies"
                    type="number"
                    value={inputs.costSynergies}
                    onChange={(e) =>
                      setInputs({ ...inputs, costSynergies: Number(e.target.value) })
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="integrationCosts">Integration Costs ($)</Label>
                  <Input
                    id="integrationCosts"
                    type="number"
                    value={inputs.integrationCosts}
                    onChange={(e) =>
                      setInputs({ ...inputs, integrationCosts: Number(e.target.value) })
                    }
                  />
                </div>
              </div>
            </Card>
          </div>

          <Button onClick={calculateMA} className="w-full mt-6">
            Calculate M&A Impact
          </Button>
        </TabsContent>

        <TabsContent value="results">
          {projections.length > 0 ? (
            <div className="space-y-6">
              <Card className="p-6">
                <h2 className="text-xl font-semibold mb-4">Deal Summary</h2>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div>
                    <p className="text-sm text-gray-500">Target EV</p>
                    <p className="text-lg font-semibold">${projections[0].targetEV.toLocaleString()}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Acquirer EV</p>
                    <p className="text-lg font-semibold">${projections[0].acquirerEV.toLocaleString()}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Total Consideration</p>
                    <p className="text-lg font-semibold">${projections[0].totalConsideration.toLocaleString()}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">New Shares Issued</p>
                    <p className="text-lg font-semibold">{projections[0].newShares.toLocaleString()}</p>
                  </div>
                </div>
              </Card>

              <Card className="p-6">
                <h2 className="text-xl font-semibold mb-4">Pro Forma Metrics</h2>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  <div>
                    <p className="text-sm text-gray-500">Combined Revenue</p>
                    <p className="text-lg font-semibold">${projections[0].combinedRevenue.toLocaleString()}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Combined EBITDA</p>
                    <p className="text-lg font-semibold">${projections[0].combinedEBITDA.toLocaleString()}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Combined Net Income</p>
                    <p className="text-lg font-semibold">${projections[0].combinedNetIncome.toLocaleString()}</p>
                  </div>
                </div>
              </Card>

              <Card className="p-6">
                <h2 className="text-xl font-semibold mb-4">Accretion/Dilution Analysis</h2>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div>
                    <p className="text-sm text-gray-500">Target EPS</p>
                    <p className="text-lg font-semibold">${projections[0].targetEPS.toFixed(2)}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Acquirer EPS</p>
                    <p className="text-lg font-semibold">${projections[0].acquirerEPS.toFixed(2)}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Pro Forma EPS</p>
                    <p className="text-lg font-semibold">${projections[0].proFormaEPS.toFixed(2)}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Accretion/(Dilution)</p>
                    <p className={`text-lg font-semibold ${projections[0].accretionDilution >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                      {projections[0].accretionDilution.toFixed(2)}%
                    </p>
                  </div>
                </div>
              </Card>
            </div>
          ) : (
            <div className="text-center p-12 text-gray-500">
              Enter inputs and calculate to see M&A analysis
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}