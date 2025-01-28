import { Card } from "@/components/ui/card";
import { useModelData } from "@/contexts/ModelDataContext";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

export function ModelSummary() {
  const { modelData } = useModelData();
  const navigate = useNavigate();

  const getModelStatus = (modelType: keyof typeof modelData) => {
    return modelData[modelType] ? "Configured" : "Not configured";
  };

  const models = [
    { name: "DCF Model", route: "/dcf", key: "dcf" as const },
    { name: "LBO Model", route: "/lbo", key: "lbo" as const },
    { name: "M&A Model", route: "/ma", key: "accretionDilution" as const },
    { name: "Options Model", route: "/options", key: "options" as const },
  ];

  return (
    <Card className="p-6">
      <h2 className="text-xl font-semibold mb-4">Model Status</h2>
      <div className="space-y-4">
        {models.map((model) => (
          <div key={model.key} className="flex items-center justify-between">
            <div>
              <h3 className="font-medium">{model.name}</h3>
              <p className={`text-sm ${
                getModelStatus(model.key) === "Configured" 
                  ? "text-green-600" 
                  : "text-muted-foreground"
              }`}>
                {getModelStatus(model.key)}
              </p>
            </div>
            <Button 
              variant="outline" 
              onClick={() => navigate(model.route)}
            >
              {getModelStatus(model.key) === "Configured" ? "Update" : "Configure"}
            </Button>
          </div>
        ))}
      </div>
    </Card>
  );
}