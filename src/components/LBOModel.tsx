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
import { LBOTemplates } from "./lbo/LBOTemplates";

interface LBOInputs {
  purchasePrice: number;
  equityContribution: number;
  debtAmount: number;
  interestRate: number;
  loanTerm: number;
  exitMultiple: number;
  revenueGrowth: number;
  ebitdaMargin: number;
  workingCapitalPercent: number;
  capexPercent: number;
  historicalRevenue: number[];
  historicalEBITDA: number[];
}

export function LBOModel() {
  const { toast } = useToast();
  const [selectedTemplate, setSelectedTemplate] = useState("detailed");
  const [inputs, setInputs] = useState<LBOInputs>({
    purchasePrice: 1000000,
    equityContribution: 300000,
    debtAmount: 700000,
    interestRate: 8,
    loanTerm: 5,
    exitMultiple: 8,
    revenueGrowth: 10,
    ebitdaMargin: 20,
    workingCapitalPercent: 10,
    capexPercent: 5,
    historicalRevenue: [800000, 850000, 920000, 980000, 1000000],
    historicalEBITDA: [160000, 170000, 184000, 196000, 200000],
  });

  const [projections, setProjections] = useState<any[]>([]);

  const calculateLBO = () => {
    const years = inputs.loanTerm;
    const newProjections = [];
    let currentRevenue = inputs.historicalRevenue[inputs.historicalRevenue.length - 1];
    let debtBalance = inputs.debtAmount;

    for (let year = 1; year <= years; year++) {
      // Revenue and EBITDA calculations
      currentRevenue *= (1 + inputs.revenueGrowth / 100);
      const ebitda = currentRevenue * (inputs.ebitdaMargin / 100);
      
      // Working capital changes
      const workingCapital = currentRevenue * (inputs.workingCapitalPercent / 100);
      const previousRevenue = year === 1 ? inputs.historicalRevenue[inputs.historicalRevenue.length - 1] : newProjections[year - 2].revenue;
      const workingCapitalChange = (currentRevenue - previousRevenue) * (inputs.workingCapitalPercent / 100);
      
      // CapEx calculation
      const capex = currentRevenue * (inputs.capexPercent / 100);
      
      // Debt service
      const interestPayment = debtBalance * (inputs.interestRate / 100);
      const principalPayment = inputs.debtAmount / years;
      const totalDebtService = interestPayment + principalPayment;
      
      // Update debt balance
      debtBalance -= principalPayment;
      
      // Free cash flow calculation
      const freeCashFlow = ebitda - workingCapitalChange - capex - totalDebtService;
      
      // Exit value calculation (only for final year)
      let exitValue = 0;
      if (year === years) {
        exitValue = ebitda * inputs.exitMultiple;
      }
      
      // IRR components
      const equityValue = exitValue - debtBalance;
      const irr = year === years ? ((equityValue / inputs.equityContribution) ** (1/years) - 1) * 100 : 0;

      newProjections.push({
        year,
        revenue: Math.round(currentRevenue),
        ebitda: Math.round(ebitda),
        workingCapital: Math.round(workingCapital),
        workingCapitalChange: Math.round(workingCapitalChange),
        capex: Math.round(capex),
        interestPayment: Math.round(interestPayment),
        principalPayment: Math.round(principalPayment),
        debtBalance: Math.round(debtBalance),
        freeCashFlow: Math.round(freeCashFlow),
        exitValue: Math.round(exitValue),
        equityValue: Math.round(equityValue),
        irr: Math.round(irr * 100) / 100,
      });
    }

    setProjections(newProjections);
  };

  const handleTemplateChange = (template: string) => {
    setSelectedTemplate(template);
    toast({
      title: "Template Updated",
      description: "The LBO output format has been updated.",
    });
  };

  const renderContent = () => {
    const template = selectedTemplate;
    const sections = {
      assumptions: (
        <div className="grid md:grid-cols-2 gap-6">
          <Card className="p-6 space-y-4">
            <h2 className="text-xl font-semibold">Transaction Structure</h2>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="purchasePrice">Purchase Price ($)</Label>
                <Input
                  id="purchasePrice"
                  type="number"
                  value={inputs.purchasePrice}
                  onChange={(e) =>
                    setInputs({ ...inputs, purchasePrice: Number(e.target.value) })
                  }
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="equityContribution">Equity Contribution ($)</Label>
                <Input
                  id="equityContribution"
                  type="number"
                  value={inputs.equityContribution}
                  onChange={(e) =>
                    setInputs({ ...inputs, equityContribution: Number(e.target.value) })
                  }
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="debtAmount">Debt Amount ($)</Label>
                <Input
                  id="debtAmount"
                  type="number"
                  value={inputs.debtAmount}
                  onChange={(e) =>
                    setInputs({ ...inputs, debtAmount: Number(e.target.value) })
                  }
                />
              </div>
            </div>
          </Card>

          <Card className="p-6 space-y-4">
            <h2 className="text-xl font-semibold">Debt Terms & Exit</h2>
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
                <Label htmlFor="loanTerm">Loan Term (Years)</Label>
                <Input
                  id="loanTerm"
                  type="number"
                  value={inputs.loanTerm}
                  onChange={(e) =>
                    setInputs({ ...inputs, loanTerm: Number(e.target.value) })
                  }
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="exitMultiple">Exit Multiple</Label>
                <Input
                  id="exitMultiple"
                  type="number"
                  value={inputs.exitMultiple}
                  onChange={(e) =>
                    setInputs({ ...inputs, exitMultiple: Number(e.target.value) })
                  }
                />
              </div>
            </div>
          </Card>

          <Card className="p-6 space-y-4">
            <h2 className="text-xl font-semibold">Operating Assumptions</h2>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="revenueGrowth">Revenue Growth (%)</Label>
                <Input
                  id="revenueGrowth"
                  type="number"
                  value={inputs.revenueGrowth}
                  onChange={(e) =>
                    setInputs({ ...inputs, revenueGrowth: Number(e.target.value) })
                  }
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="ebitdaMargin">EBITDA Margin (%)</Label>
                <Input
                  id="ebitdaMargin"
                  type="number"
                  value={inputs.ebitdaMargin}
                  onChange={(e) =>
                    setInputs({ ...inputs, ebitdaMargin: Number(e.target.value) })
                  }
                />
              </div>
            </div>
          </Card>

          <Card className="p-6 space-y-4">
            <h2 className="text-xl font-semibold">Working Capital & CapEx</h2>
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
            </div>
          </Card>
        </div>
      ),
      projections: projections.length > 0 ? (
        <div className="space-y-6">
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
                      EBITDA
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Interest
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Principal
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Debt Balance
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Free Cash Flow
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Exit Value
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      IRR
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
                        ${row.ebitda.toLocaleString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        ${row.interestPayment.toLocaleString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        ${row.principalPayment.toLocaleString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        ${row.debtBalance.toLocaleString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        ${row.freeCashFlow.toLocaleString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        ${row.exitValue.toLocaleString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {row.irr}%
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        </div>
      ) : null,
      charts: (
        <Card className="p-6">
          <h2 className="text-xl font-semibold mb-4">Financial Projections</h2>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={[...inputs.historicalRevenue.map((revenue, index) => ({
              year: 2019 + index,
              revenue,
              ebitda: inputs.historicalEBITDA[index],
              type: 'historical'
            })), ...projections.map(p => ({
              year: 2024 + p.year,
              revenue: p.revenue,
              ebitda: p.ebitda,
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
                dataKey="ebitda"
                stroke="#059669"
                name="EBITDA"
              />
              <Line
                type="monotone"
                dataKey="freeCashFlow"
                stroke="#0EA5E9"
                name="Free Cash Flow"
              />
            </LineChart>
          </ResponsiveContainer>
        </Card>
      ),
      returns: (
        <Card className="p-6">
          <h2 className="text-xl font-semibold mb-4">Returns Analysis</h2>
          <div className="space-y-4">
            {projections.length > 0 && (
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h3 className="font-medium">IRR</h3>
                  <p className="text-2xl font-bold text-primary">
                    {projections[projections.length - 1].irr}%
                  </p>
                </div>
                <div>
                  <h3 className="font-medium">Multiple of Money</h3>
                  <p className="text-2xl font-bold text-primary">
                    {(projections[projections.length - 1].equityValue / inputs.equityContribution).toFixed(2)}x
                  </p>
                </div>
              </div>
            )}
          </div>
        </Card>
      ),
    };

    return sections;
  };

  return (
    <div className="p-6 space-y-6 animate-fade-in">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-primary">LBO Model</h1>
        <LBOTemplates
          selectedTemplate={selectedTemplate}
          onTemplateChange={handleTemplateChange}
        />
      </div>
      
      <Tabs defaultValue="inputs" className="w-full">
        <TabsList>
          <TabsTrigger value="inputs">Model Inputs</TabsTrigger>
          <TabsTrigger value="historical">Historical Data</TabsTrigger>
          <TabsTrigger value="results">Results</TabsTrigger>
        </TabsList>

        <TabsContent value="inputs">
          {renderContent().assumptions}
          <Button onClick={calculateLBO} className="w-full mt-6">
            Calculate LBO
          </Button>
        </TabsContent>

        <TabsContent value="historical">
          <Card className="p-6">
            <h2 className="text-xl font-semibold mb-4">Historical Performance</h2>
            <div className="space-y-4">
              {inputs.historicalRevenue.map((revenue, index) => (
                <div key={index} className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor={`historical-revenue-${index}`}>Year {2019 + index} Revenue ($)</Label>
                    <Input
                      id={`historical-revenue-${index}`}
                      type="number"
                      value={revenue}
                      onChange={(e) => {
                        const newHistorical = [...inputs.historicalRevenue];
                        newHistorical[index] = Number(e.target.value);
                        setInputs({ ...inputs, historicalRevenue: newHistorical });
                      }}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor={`historical-ebitda-${index}`}>Year {2019 + index} EBITDA ($)</Label>
                    <Input
                      id={`historical-ebitda-${index}`}
                      type="number"
                      value={inputs.historicalEBITDA[index]}
                      onChange={(e) => {
                        const newHistorical = [...inputs.historicalEBITDA];
                        newHistorical[index] = Number(e.target.value);
                        setInputs({ ...inputs, historicalEBITDA: newHistorical });
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="results">
          {renderContent().projections}
        </TabsContent>

        <TabsContent value="charts">
          {renderContent().charts}
        </TabsContent>

        <TabsContent value="returns">
          {renderContent().returns}
        </TabsContent>
      </Tabs>
    </div>
  );
}
