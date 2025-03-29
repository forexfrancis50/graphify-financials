
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";
import { FinancialData } from "@/utils/financialDataScraper";
import { importFinancialDataToModel, getCompatibleModels } from "@/utils/modelDataImport";
import { Calculator, ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface CompatibleCalculatorsProps {
  financialData: FinancialData;
}

export function CompatibleCalculators({ financialData }: CompatibleCalculatorsProps) {
  const { toast } = useToast();
  const navigate = useNavigate();
  const compatibleModels = getCompatibleModels();
  
  const handleCalculatorSelect = (modelId: string, modelName: string) => {
    // Import the data to the selected model
    importFinancialDataToModel(financialData, modelId);
    
    // Notify the user
    toast({
      title: "Data Imported",
      description: `${financialData.ticker} data imported to ${modelName} model.`,
    });
    
    // Navigate to the appropriate page
    let route = "";
    switch (modelId) {
      case "dcf":
        route = "/dcf";
        break;
      case "options":
        route = "/options";
        break;
      case "financialRatios":
        route = "/financial-ratios";
        break;
      case "breakEven":
        route = "/break-even";
        break;
      case "evEbitda":
        route = "/ev-ebitda";
        break;
      default:
        route = "/";
    }
    
    navigate(route);
  };
  
  return (
    <Card className="p-4 mt-4">
      <h3 className="text-lg font-medium mb-3">Compatible Calculators</h3>
      <p className="text-sm text-muted-foreground mb-4">
        Continue your analysis by importing this data directly into one of these calculators:
      </p>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {compatibleModels.map((model) => (
          <Button
            key={model.id}
            variant="outline"
            className="justify-between"
            onClick={() => handleCalculatorSelect(model.id, model.name)}
          >
            <span className="flex items-center">
              <Calculator className="mr-2 h-4 w-4" />
              {model.name}
            </span>
            <ArrowRight className="h-4 w-4" />
          </Button>
        ))}
      </div>
    </Card>
  );
}
