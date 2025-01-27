import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import { Download, Upload } from "lucide-react";
import * as XLSX from 'xlsx';

export function BatchDataOperations() {
  const { toast } = useToast();
  const [file, setFile] = useState<File | null>(null);

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setFile(file);
      const reader = new FileReader();
      
      reader.onload = (e) => {
        try {
          const data = e.target?.result;
          const workbook = XLSX.read(data, { type: 'binary' });
          const sheetName = workbook.SheetNames[0];
          const worksheet = workbook.Sheets[sheetName];
          const jsonData = XLSX.utils.sheet_to_json(worksheet);
          
          // Store the imported data in localStorage for use across models
          localStorage.setItem('batchImportedData', JSON.stringify(jsonData));
          
          toast({
            title: "Data Imported Successfully",
            description: `Imported ${jsonData.length} records from ${file.name}`,
          });
        } catch (error) {
          toast({
            title: "Import Failed",
            description: "Please ensure the file format is correct",
            variant: "destructive",
          });
        }
      };
      
      reader.readAsBinaryString(file);
    }
  };

  const handleExportAll = () => {
    try {
      // Collect data from all models
      const exportData = {
        dcf: localStorage.getItem('dcfModelData'),
        options: localStorage.getItem('optionsModelData'),
        lbo: localStorage.getItem('lboModelData'),
        // Add other models as needed
      };

      const worksheet = XLSX.utils.json_to_sheet([exportData]);
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, "AllModels");
      
      // Generate timestamp for filename
      const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
      XLSX.writeFile(workbook, `financial-models-export-${timestamp}.xlsx`);

      toast({
        title: "Export Successful",
        description: "All model data has been exported",
      });
    } catch (error) {
      toast({
        title: "Export Failed",
        description: "An error occurred while exporting data",
        variant: "destructive",
      });
    }
  };

  return (
    <Card className="p-6 space-y-4">
      <h3 className="text-lg font-semibold">Batch Data Operations</h3>
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1">
          <Input
            type="file"
            accept=".xlsx,.xls"
            onChange={handleFileUpload}
            className="cursor-pointer"
          />
        </div>
        <Button
          variant="outline"
          onClick={handleExportAll}
          className="flex items-center gap-2"
        >
          <Download className="w-4 h-4" />
          Export All Models
        </Button>
      </div>
    </Card>
  );
}