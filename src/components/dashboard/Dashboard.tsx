import { ModelMetrics } from "./ModelMetrics";
import { ModelSummary } from "./ModelSummary";
import { Card } from "@/components/ui/card";
import { Brain, Calculator, LineChart } from "lucide-react";

export function Dashboard() {
  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <h2 className="text-2xl font-bold">Model Overview</h2>
        
        <Card className="p-6 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950 dark:to-indigo-950">
          <div className="flex items-start gap-4">
            <div className="p-3 rounded-full bg-primary/10">
              <Calculator className="w-6 h-6 text-primary" />
            </div>
            <div className="space-y-2">
              <h3 className="text-xl font-semibold">Professional Financial Modeling Suite</h3>
              <p className="text-muted-foreground">
                Access comprehensive financial modeling tools including DCF, LBO, M&A, and Options analysis. 
                Our suite provides professional-grade templates and real-time calculations to support your 
                investment decisions.
              </p>
              <div className="flex gap-4 mt-4">
                <div className="flex items-center gap-2">
                  <Brain className="w-4 h-4 text-primary" />
                  <span className="text-sm">AI-Powered Analysis</span>
                </div>
                <div className="flex items-center gap-2">
                  <LineChart className="w-4 h-4 text-primary" />
                  <span className="text-sm">Advanced Visualizations</span>
                </div>
              </div>
            </div>
          </div>
        </Card>
        
        <ModelMetrics />
      </div>
      
      <div className="grid md:grid-cols-2 gap-6">
        <ModelSummary />
        <div className="space-y-6">
          {/* Additional dashboard sections can be added here */}
        </div>
      </div>
    </div>
  );
}