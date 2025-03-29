
import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/components/ui/use-toast";
import { FinancialData, getAllFinancialData } from "@/utils/financialDataScraper";
import { getCompatibleModels, importFinancialDataToModel } from "@/utils/modelDataImport";
import { Database, Download } from "lucide-react";

interface FinancialDataImporterProps {
  activeModelType?: string;
  onDataImported?: (data: any) => void;
}

export function FinancialDataImporter({ 
  activeModelType, 
  onDataImported 
}: FinancialDataImporterProps) {
  const [savedData, setSavedData] = useState<FinancialData[]>([]);
  const [selectedData, setSelectedData] = useState<string>("");
  const [selectedModel, setSelectedModel] = useState<string>(activeModelType || "");
  const compatibleModels = getCompatibleModels();
  const { toast } = useToast();

  useEffect(() => {
    // Initialize with data from localStorage
    setSavedData(getAllFinancialData());
    
    // Set the active model if provided
    if (activeModelType) {
      setSelectedModel(activeModelType);
    }
    
    // Listen for updates to financial data
    const handleDataUpdated = () => {
      setSavedData(getAllFinancialData());
    };
    
    window.addEventListener('financialDataUpdated', handleDataUpdated);
    
    return () => {
      window.removeEventListener('financialDataUpdated', handleDataUpdated);
    };
  }, [activeModelType]);

  const handleImport = () => {
    if (!selectedData || !selectedModel) {
      toast({
        title: "Selection Required",
        description: "Please select both financial data and a target model.",
        variant: "destructive",
      });
      return;
    }
    
    const [ticker, source] = selectedData.split('|');
    const dataToImport = savedData.find(
      data => data.ticker === ticker && data.source === source
    );
    
    if (!dataToImport) {
      toast({
        title: "Error",
        description: "Selected data not found.",
        variant: "destructive",
      });
      return;
    }
    
    importFinancialDataToModel(dataToImport, selectedModel);
    
    toast({
      title: "Data Imported",
      description: `${dataToImport.ticker} data imported to ${
        compatibleModels.find(model => model.id === selectedModel)?.name || selectedModel
      } model.`,
    });
    
    // Call the callback if provided
    if (onDataImported) {
      const mappedData = JSON.parse(
        localStorage.getItem(`${selectedModel}ModelData`) || '{}'
      );
      onDataImported(mappedData);
    }
  };

  if (savedData.length === 0) {
    return (
      <Card className="p-4 bg-muted/40">
        <p className="text-sm text-muted-foreground text-center">
          No financial data available. Use the Financial Data Aggregator to fetch company data.
        </p>
      </Card>
    );
  }

  return (
    <Card className="p-4 space-y-4">
      <h3 className="text-sm font-medium">Import Financial Data</h3>
      
      <div className="space-y-3">
        <div>
          <label className="text-sm mb-1 block">Select Company Data</label>
          <Select value={selectedData} onValueChange={setSelectedData}>
            <SelectTrigger>
              <SelectValue placeholder="Choose company data" />
            </SelectTrigger>
            <SelectContent>
              {savedData.map((data) => (
                <SelectItem 
                  key={`${data.ticker}|${data.source}`} 
                  value={`${data.ticker}|${data.source}`}
                >
                  {data.companyName} ({data.ticker}) - {data.source}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        
        {!activeModelType && (
          <div>
            <label className="text-sm mb-1 block">Target Model</label>
            <Select value={selectedModel} onValueChange={setSelectedModel}>
              <SelectTrigger>
                <SelectValue placeholder="Choose target model" />
              </SelectTrigger>
              <SelectContent>
                {compatibleModels.map((model) => (
                  <SelectItem key={model.id} value={model.id}>
                    {model.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        )}
        
        <Button 
          onClick={handleImport} 
          className="w-full"
          variant="outline"
          disabled={!selectedData || !selectedModel}
        >
          <Download className="mr-2 h-4 w-4" />
          Import Data
        </Button>
      </div>
    </Card>
  );
}
