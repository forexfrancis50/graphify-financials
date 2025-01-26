import { Button } from "@/components/ui/button";
import { useModelData } from "@/contexts/ModelDataContext";
import { useToast } from "@/components/ui/use-toast";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useState } from "react";

interface ModelDataTransferProps {
  currentModel: keyof ModelData;
  onDataTransfer: (data: any) => void;
}

export function ModelDataTransfer({ currentModel, onDataTransfer }: ModelDataTransferProps) {
  const { modelData, getModelData } = useModelData();
  const { toast } = useToast();
  const [selectedModel, setSelectedModel] = useState<string>("");

  const availableModels = Object.keys(modelData).filter(
    (model) => model !== currentModel && modelData[model as keyof ModelData]
  );

  const handleTransfer = () => {
    if (!selectedModel) return;
    
    const data = getModelData(selectedModel as keyof ModelData);
    if (data) {
      onDataTransfer(data);
      toast({
        title: "Data Transferred",
        description: `Data from ${selectedModel} model has been imported successfully.`,
      });
    }
  };

  if (availableModels.length === 0) {
    return null;
  }

  return (
    <div className="flex items-center gap-4 p-4 bg-muted/50 rounded-lg mb-4">
      <Select value={selectedModel} onValueChange={setSelectedModel}>
        <SelectTrigger className="w-[200px]">
          <SelectValue placeholder="Import data from..." />
        </SelectTrigger>
        <SelectContent>
          {availableModels.map((model) => (
            <SelectItem key={model} value={model}>
              {model.toUpperCase()} Model
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      <Button
        variant="secondary"
        onClick={handleTransfer}
        disabled={!selectedModel}
      >
        Import Data
      </Button>
    </div>
  );
}