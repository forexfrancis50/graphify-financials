import { useState, useEffect } from "react";
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
import { SensitivityAnalysis } from "./SensitivityAnalysis";
import { ComparableAnalysis } from "./ComparableAnalysis";
import { DCFTemplates } from "./dcf/DCFTemplates";
import { useToast } from "@/components/ui/use-toast";
import { FinancialDataImporter } from "./shared/FinancialDataImporter";

interface DCFInputs {
  initialRevenue: number;
  growthRate: number;
  operatingMargin: number;
  taxRate: number;
  discountRate: number;
  workingCapitalPercent: number;
  capexPercent: number;
  terminalGrowthRate: number;
  historicalRevenue: number[];
}

export function DCFModel() {
  const { toast } = useToast();
  const [selectedTemplate, setSelectedTemplate] = useState("detailed");
  const [inputs, setInputs] = useState<DCFInputs>({
    initialRevenue: 1000000,
    growthRate: 10,
    operatingMargin: 20,
    taxRate: 25,
    discountRate: 10,
    workingCapitalPercent: 10,
    capexPercent: 5,
    terminalGrowthRate: 2,
    historicalRevenue: [800000, 850000, 920000, 980000, 1000000],
  });

  const [projections, setProjections] = useState<any[]>([]);

  useEffect(() => {
    const loadModelData = () => {
      try {
        const storedData = localStorage.getItem('dcfModelData');
        if (storedData) {
          const dcfData = JSON.parse(storedData);
          
          setInputs(prevInputs => ({
            ...prevInputs,
            initialRevenue: dcfData.revenue || prevInputs.initialRevenue,
            growthRate: dcfData.growthRate || prevInputs.growthRate,
            operatingMargin: dcfData.operatingMargin || prevInputs.operatingMargin,
            discountRate: dcfData.discountRate || prevInputs.discountRate,
          }));
          
          toast({
            title: "Data Loaded",
            description: "Financial data has been loaded into the DCF model.",
          });
        }
      } catch (error) {
        console.error("Error loading DCF model data:", error);
      }
    };
    
    loadModelData();
    
    const handleDataImported = (event: CustomEvent) => {
      if (event.detail?.modelType === 'dcf') {
        loadModelData();
      }
    };
    
    window.addEventListener('modelDataImported', handleDataImported as EventListener);
    
    return () => {
      window.removeEventListener('modelDataImported', handleDataImported as EventListener);
    };
  }, [toast]);

  const handleImportedData = (importedData: any) => {
    if (importedData) {
      setInputs(prevInputs => ({
        ...prevInputs,
        initialRevenue: importedData.revenue || prevInputs.initialRevenue,
        growthRate: importedData.growthRate || prevInputs.growthRate,
        operatingMargin: importedData.operatingMargin || prevInputs.operatingMargin,
        discountRate: importedData.discountRate || prevInputs.discountRate,
      }));
      
      toast({
        title: "Data Imported",
        description: "Financial data has been imported into the DCF model.",
      });
    }
  };

  const calculateDCF = () => {
    const years = 5;
    const newProjections = [];
    let currentRevenue = inputs.initialRevenue;

    for (let year = 1; year <= years; year++) {
      currentRevenue *= (1 + inputs.growthRate / 100);
      
      const operatingIncome = currentRevenue * (inputs.operatingMargin / 100);
      
      const taxAmount = operatingIncome * (inputs.taxRate / 100);
      
      const workingCapital = currentRevenue * (inputs.workingCapitalPercent / 100);
      const previousRevenue = year === 1 ? inputs.initialRevenue : newProjections[year - 2].revenue;
      const workingCapitalChange = (currentRevenue - previousRevenue) * (inputs.workingCapitalPercent / 100);
      
      const capex = currentRevenue * (inputs.capexPercent / 100);
      
      const freeCashFlow = operatingIncome - taxAmount - workingCapitalChange - capex;
      
      let terminalValue = 0;
      if (year === years) {
        const terminalFCF = freeCashFlow * (1 + inputs.terminalGrowthRate / 100);
        terminalValue = terminalFCF / (inputs.discountRate / 100 - inputs.terminalGrowthRate / 100);
      }
      
      const discountFactor = Math.pow(1 + inputs.discountRate / 100, year);
      const discountedCashFlow = freeCashFlow / discountFactor;
      const discountedTerminalValue = terminalValue / discountFactor;

      newProjections.push({
        year,
        revenue: Math.round(currentRevenue),
        operatingIncome: Math.round(operatingIncome),
        freeCashFlow: Math.round(freeCashFlow),
        workingCapital: Math.round(workingCapital),
        workingCapitalChange: Math.round(workingCapitalChange),
        capex: Math.round(capex),
        discountedCashFlow: Math.round(discountedCashFlow),
        terminalValue: Math.round(terminalValue),
        discountedTerminalValue: Math.round(discountedTerminalValue),
        enterpriseValue: Math.round(discountedCashFlow + discountedTerminalValue),
      });
    }

    setProjections(newProjections);
  };

  const calculateEnterpriseValue = (discountRate: number, growthRate: number) => {
    const years = 5;
    let currentRevenue = inputs.initialRevenue;
    let totalValue = 0;

    for (let year = 1; year <= years; year++) {
      currentRevenue *= (1 + inputs.growthRate / 100);
      const operatingIncome = currentRevenue * (inputs.operatingMargin / 100);
      const taxAmount = operatingIncome * (inputs.taxRate / 100);
      const previousRevenue = year === 1 ? inputs.initialRevenue : currentRevenue / (1 + inputs.growthRate / 100);
      const workingCapitalChange = (currentRevenue - previousRevenue) * (inputs.workingCapitalPercent / 100);
      const capex = currentRevenue * (inputs.capexPercent / 100);
      const freeCashFlow = operatingIncome - taxAmount - workingCapitalChange - capex;

      if (year === years) {
        const terminalFCF = freeCashFlow * (1 + growthRate / 100);
        const terminalValue = terminalFCF / (discountRate / 100 - growthRate / 100);
        totalValue += terminalValue / Math.pow(1 + discountRate / 100, year);
      }

      totalValue += freeCashFlow / Math.pow(1 + discountRate / 100, year);
    }

    return Math.round(totalValue);
  };

  const handleTemplateChange = (template: string) => {
    setSelectedTemplate(template);
    toast({
      title: "Template Updated",
      description: "The DCF output format has been updated.",
    });
  };

  const renderContent = () => {
    const template = selectedTemplate;
    const sections = {
      assumptions: (
        <div className="grid md:grid-cols-2 gap-6">
          <Card className="p-6 space-y-4">
            <h2 className="text-xl font-semibold">Growth & Margins</h2>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="initialRevenue">Initial Revenue ($)</Label>
                <Input
                  id="initialRevenue"
                  type="number"
                  value={inputs.initialRevenue}
                  onChange={(e) =>
                    setInputs({ ...inputs, initialRevenue: Number(e.target.value) })
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
                <Label htmlFor="operatingMargin">Operating Margin (%)</Label>
                <Input
                  id="operatingMargin"
                  type="number"
                  value={inputs.operatingMargin}
                  onChange={(e) =>
                    setInputs({ ...inputs, operatingMargin: Number(e.target.value) })
                  }
                />
              </div>
            </div>
          </Card>

          <Card className="p-6 space-y-4">
            <h2 className="text-xl font-semibold">Capital Structure & Valuation</h2>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="workingCapitalPercent">Working Capital (% of Revenue)</Label>
                <Input
                  id="workingCapitalPercent"
                  type="number"
                  value={inputs.workingCapitalPercent}
                  onChange={(e) =>
                    setInputs({ ...inputs, workingCapitalPercent: Number(e.target.value) })
                  }
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="capexPercent">CapEx (% of Revenue)</Label>
                <Input
                  id="capexPercent"
                  type="number"
                  value={inputs.capexPercent}
                  onChange={(e) =>
                    setInputs({ ...inputs, capexPercent: Number(e.target.value) })
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
            </div>
          </Card>
        </div>
      ),
      projections: projections.length > 0 ? (
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
                    Revenue
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Operating Income
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Working Capital
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    CapEx
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Free Cash Flow
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Terminal Value
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Enterprise Value
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {projections.map((row) => (
                  <tr key={row.year}>
                    <td className="px-6 py-4 whitespace-nowrap">{2024 + row.year}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      ${row.revenue.toLocaleString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      ${row.operatingIncome.toLocaleString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      ${row.workingCapital.toLocaleString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      ${row.capex.toLocaleString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      ${row.freeCashFlow.toLocaleString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      ${row.terminalValue.toLocaleString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      ${row.enterpriseValue.toLocaleString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      ) : null,
      charts: (
        <Card className="p-6">
          <h2 className="text-xl font-semibold mb-4">Revenue & Cash Flow Projections</h2>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={[...inputs.historicalRevenue.map((revenue, index) => ({
              year: 2019 + index,
              revenue,
              type: 'historical'
            })), ...projections.map(p => ({
              year: 2024 + p.year,
              revenue: p.revenue,
              freeCashFlow: p.freeCashFlow,
              type: 'projection'
            }))]}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="year" />
              <YAxis />
              <Tooltip />
              <Line
                type="monotone"
                dataKey="revenue"
                stroke="#1E293B"
                name="Revenue"
              />
              <Line
                type="monotone"
                dataKey="freeCashFlow"
                stroke="#059669"
                name="Free Cash Flow"
              />
            </LineChart>
          </ResponsiveContainer>
        </Card>
      ),
      sensitivity: <SensitivityAnalysis
        baseValue={projections[projections.length - 1]?.enterpriseValue || 0}
        discountRates={[8, 10, 12, 14, 16]}
        growthRates={[1, 2, 3, 4, 5]}
        calculateEnterpriseValue={calculateEnterpriseValue}
      />,
      comps: <ComparableAnalysis />,
    };

    return sections;
  };

  return (
    <div className="p-6 space-y-6 animate-fade-in">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-primary">DCF Model</h1>
        <DCFTemplates
          selectedTemplate={selectedTemplate}
          onTemplateChange={handleTemplateChange}
        />
      </div>
      
      <div className="bg-muted p-4 rounded-md">
        <h2 className="text-lg font-medium mb-3">Import Financial Data</h2>
        <FinancialDataImporter 
          activeModelType="dcf"
          onDataImported={handleImportedData}
        />
      </div>
      
      <Tabs defaultValue="inputs" className="w-full">
        <TabsList>
          <TabsTrigger value="inputs">Model Inputs</TabsTrigger>
          <TabsTrigger value="historical">Historical Data</TabsTrigger>
          <TabsTrigger value="results">Results</TabsTrigger>
          <TabsTrigger value="sensitivity">Sensitivity</TabsTrigger>
          <TabsTrigger value="comps">Comparable Analysis</TabsTrigger>
        </TabsList>

        <TabsContent value="inputs">
          {renderContent().assumptions}
          <Button onClick={calculateDCF} className="w-full mt-6">
            Calculate DCF
          </Button>
        </TabsContent>

        <TabsContent value="historical">
          <Card className="p-6">
            <h2 className="text-xl font-semibold mb-4">Historical Performance</h2>
            <div className="space-y-4">
              {inputs.historicalRevenue.map((revenue, index) => (
                <div key={index} className="space-y-2">
                  <Label htmlFor={`historical-${index}`}>Year {2019 + index} Revenue ($)</Label>
                  <Input
                    id={`historical-${index}`}
                    type="number"
                    value={revenue}
                    onChange={(e) => {
                      const newHistorical = [...inputs.historicalRevenue];
                      newHistorical[index] = Number(e.target.value);
                      setInputs({ ...inputs, historicalRevenue: newHistorical });
                    }}
                  />
                </div>
              ))}
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="results">
          {renderContent().projections}
        </TabsContent>

        <TabsContent value="sensitivity">
          {renderContent().sensitivity}
        </TabsContent>

        <TabsContent value="comps">
          {renderContent().comps}
        </TabsContent>
      </Tabs>
    </div>
  );
}
