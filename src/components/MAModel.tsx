import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { TargetCompany } from "./ma/TargetCompany";
import { AcquirerCompany } from "./ma/AcquirerCompany";
import { DealStructure } from "./ma/DealStructure";
import { Synergies } from "./ma/Synergies";
import { Results } from "./ma/Results";

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
            <TargetCompany inputs={inputs} setInputs={setInputs} />
            <AcquirerCompany inputs={inputs} setInputs={setInputs} />
            <DealStructure inputs={inputs} setInputs={setInputs} />
            <Synergies inputs={inputs} setInputs={setInputs} />
          </div>

          <Button onClick={calculateMA} className="w-full mt-6">
            Calculate M&A Impact
          </Button>
        </TabsContent>

        <TabsContent value="results">
          <Results projections={projections} />
        </TabsContent>
      </Tabs>
    </div>
  );
}