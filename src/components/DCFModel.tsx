import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

interface DCFInputs {
  initialRevenue: number;
  growthRate: number;
  operatingMargin: number;
  taxRate: number;
  discountRate: number;
}

export function DCFModel() {
  const [inputs, setInputs] = useState<DCFInputs>({
    initialRevenue: 1000000,
    growthRate: 10,
    operatingMargin: 20,
    taxRate: 25,
    discountRate: 10,
  });

  const [projections, setProjections] = useState<any[]>([]);

  const calculateDCF = () => {
    const years = 5;
    const newProjections = [];

    let currentRevenue = inputs.initialRevenue;
    for (let year = 1; year <= years; year++) {
      currentRevenue *= (1 + inputs.growthRate / 100);
      const operatingIncome = currentRevenue * (inputs.operatingMargin / 100);
      const taxAmount = operatingIncome * (inputs.taxRate / 100);
      const freeCashFlow = operatingIncome - taxAmount;
      const discountedCashFlow = freeCashFlow / Math.pow(1 + inputs.discountRate / 100, year);

      newProjections.push({
        year,
        revenue: Math.round(currentRevenue),
        operatingIncome: Math.round(operatingIncome),
        freeCashFlow: Math.round(freeCashFlow),
        discountedCashFlow: Math.round(discountedCashFlow),
      });
    }

    setProjections(newProjections);
  };

  return (
    <div className="p-6 space-y-6 animate-fade-in">
      <h1 className="text-3xl font-bold text-primary">DCF Model</h1>
      
      <div className="grid md:grid-cols-2 gap-6">
        <Card className="p-6 space-y-4">
          <h2 className="text-xl font-semibold">Model Inputs</h2>
          
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

            <Button onClick={calculateDCF} className="w-full">
              Calculate DCF
            </Button>
          </div>
        </Card>

        <Card className="p-6">
          <h2 className="text-xl font-semibold mb-4">Projections Chart</h2>
          {projections.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={projections}>
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
                  dataKey="discountedCashFlow"
                  stroke="#059669"
                  name="Discounted Cash Flow"
                />
              </LineChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-[300px] flex items-center justify-center text-gray-500">
              Enter inputs and calculate to see projections
            </div>
          )}
        </Card>
      </div>

      {projections.length > 0 && (
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
                    Free Cash Flow
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Discounted Cash Flow
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {projections.map((row) => (
                  <tr key={row.year}>
                    <td className="px-6 py-4 whitespace-nowrap">{row.year}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      ${row.revenue.toLocaleString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      ${row.operatingIncome.toLocaleString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      ${row.freeCashFlow.toLocaleString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      ${row.discountedCashFlow.toLocaleString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      )}
    </div>
  );
}