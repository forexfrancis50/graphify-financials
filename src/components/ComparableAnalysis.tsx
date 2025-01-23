import { useState } from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Plus, Trash2 } from "lucide-react";

interface CompanyData {
  name: string;
  revenue: number;
  ebitda: number;
  netIncome: number;
  evToRevenue: number;
  evToEbitda: number;
  peRatio: number;
}

export function ComparableAnalysis() {
  const [companies, setCompanies] = useState<CompanyData[]>([
    {
      name: "Company 1",
      revenue: 1000000,
      ebitda: 200000,
      netIncome: 150000,
      evToRevenue: 2.5,
      evToEbitda: 12.5,
      peRatio: 15,
    },
  ]);

  const addCompany = () => {
    setCompanies([
      ...companies,
      {
        name: `Company ${companies.length + 1}`,
        revenue: 0,
        ebitda: 0,
        netIncome: 0,
        evToRevenue: 0,
        evToEbitda: 0,
        peRatio: 0,
      },
    ]);
  };

  const removeCompany = (index: number) => {
    setCompanies(companies.filter((_, i) => i !== index));
  };

  const updateCompany = (index: number, field: keyof CompanyData, value: string) => {
    const newCompanies = [...companies];
    if (field === "name") {
      newCompanies[index][field] = value;
    } else {
      newCompanies[index][field] = Number(value);
    }
    setCompanies(newCompanies);
  };

  const calculateAverages = () => {
    return {
      evToRevenue: companies.reduce((acc, curr) => acc + curr.evToRevenue, 0) / companies.length,
      evToEbitda: companies.reduce((acc, curr) => acc + curr.evToEbitda, 0) / companies.length,
      peRatio: companies.reduce((acc, curr) => acc + curr.peRatio, 0) / companies.length,
    };
  };

  const averages = calculateAverages();

  return (
    <Card className="p-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">Comparable Company Analysis</h2>
        <Button onClick={addCompany} variant="outline" size="sm">
          <Plus className="w-4 h-4 mr-2" />
          Add Company
        </Button>
      </div>
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Company Name</TableHead>
              <TableHead>Revenue ($)</TableHead>
              <TableHead>EBITDA ($)</TableHead>
              <TableHead>Net Income ($)</TableHead>
              <TableHead>EV/Revenue</TableHead>
              <TableHead>EV/EBITDA</TableHead>
              <TableHead>P/E Ratio</TableHead>
              <TableHead></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {companies.map((company, index) => (
              <TableRow key={index}>
                <TableCell>
                  <Input
                    value={company.name}
                    onChange={(e) => updateCompany(index, "name", e.target.value)}
                  />
                </TableCell>
                <TableCell>
                  <Input
                    type="number"
                    value={company.revenue}
                    onChange={(e) => updateCompany(index, "revenue", e.target.value)}
                  />
                </TableCell>
                <TableCell>
                  <Input
                    type="number"
                    value={company.ebitda}
                    onChange={(e) => updateCompany(index, "ebitda", e.target.value)}
                  />
                </TableCell>
                <TableCell>
                  <Input
                    type="number"
                    value={company.netIncome}
                    onChange={(e) => updateCompany(index, "netIncome", e.target.value)}
                  />
                </TableCell>
                <TableCell>
                  <Input
                    type="number"
                    value={company.evToRevenue}
                    onChange={(e) => updateCompany(index, "evToRevenue", e.target.value)}
                  />
                </TableCell>
                <TableCell>
                  <Input
                    type="number"
                    value={company.evToEbitda}
                    onChange={(e) => updateCompany(index, "evToEbitda", e.target.value)}
                  />
                </TableCell>
                <TableCell>
                  <Input
                    type="number"
                    value={company.peRatio}
                    onChange={(e) => updateCompany(index, "peRatio", e.target.value)}
                  />
                </TableCell>
                <TableCell>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => removeCompany(index)}
                    className="text-destructive"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
            <TableRow className="font-medium">
              <TableCell colSpan={4}>Average Multiples</TableCell>
              <TableCell>{averages.evToRevenue.toFixed(2)}x</TableCell>
              <TableCell>{averages.evToEbitda.toFixed(2)}x</TableCell>
              <TableCell>{averages.peRatio.toFixed(2)}x</TableCell>
              <TableCell></TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </div>
    </Card>
  );
}