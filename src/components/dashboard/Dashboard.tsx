import { ModelMetrics } from "./ModelMetrics";
import { ModelSummary } from "./ModelSummary";

export function Dashboard() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold mb-4">Model Overview</h2>
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