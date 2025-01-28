import { Card } from "@/components/ui/card";
import { useModelData } from "@/contexts/ModelDataContext";
import { TrendingUp, DollarSign, Percent, ChartLine } from "lucide-react";

export function ModelMetrics() {
  const { modelData } = useModelData();

  const getMetricCard = (title: string, value: string | number, icon: JSX.Element, description: string) => (
    <Card className="p-4 space-y-2">
      <div className="flex items-center justify-between">
        <h3 className="font-medium text-sm text-muted-foreground">{title}</h3>
        <div className="text-primary">{icon}</div>
      </div>
      <div className="text-2xl font-bold">{value}</div>
      <p className="text-sm text-muted-foreground">{description}</p>
    </Card>
  );

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {modelData.dcf && getMetricCard(
        "DCF Growth Rate",
        `${modelData.dcf.growthRate}%`,
        <TrendingUp className="w-4 h-4" />,
        "Projected annual growth rate"
      )}
      
      {modelData.lbo && getMetricCard(
        "LBO Exit Multiple",
        modelData.lbo.exitMultiple.toFixed(1) + "x",
        <ChartLine className="w-4 h-4" />,
        "Expected exit valuation multiple"
      )}
      
      {modelData.options && getMetricCard(
        "Option Value",
        `$${modelData.options.stockPrice}`,
        <DollarSign className="w-4 h-4" />,
        "Current stock price"
      )}
      
      {modelData.accretionDilution && getMetricCard(
        "Acquirer P/E",
        modelData.accretionDilution.acquirerPE.toFixed(1) + "x",
        <Percent className="w-4 h-4" />,
        "Acquirer price-to-earnings ratio"
      )}
    </div>
  );
}