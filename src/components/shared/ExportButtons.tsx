import { Button } from "@/components/ui/button";
import { FileDown } from "lucide-react";
import { exportToPDF, exportToExcel } from "@/utils/exportUtils";

interface ExportButtonsProps {
  title: string;
  data: any[];
  columns: string[];
}

export function ExportButtons({ title, data, columns }: ExportButtonsProps) {
  return (
    <div className="flex gap-2">
      <Button
        variant="outline"
        size="sm"
        onClick={() => exportToPDF(title, data, columns)}
      >
        <FileDown className="mr-2 h-4 w-4" />
        Export PDF
      </Button>
      <Button
        variant="outline"
        size="sm"
        onClick={() => exportToExcel(title, data)}
      >
        <FileDown className="mr-2 h-4 w-4" />
        Export Excel
      </Button>
    </div>
  );
}