import { Button } from "@/components/ui/button";
import { FileDown } from "lucide-react";
import { exportToPDF, exportToExcel } from "@/utils/exportUtils";

interface ExportButtonsProps {
  title: string;
  data: any[];
}

export function ExportButtons({ title, data }: ExportButtonsProps) {
  return (
    <div className="flex gap-2">
      <Button
        variant="outline"
        size="sm"
        onClick={() => exportToPDF(data, title)}
      >
        <FileDown className="mr-2 h-4 w-4" />
        Export PDF
      </Button>
      <Button
        variant="outline"
        size="sm"
        onClick={() => exportToExcel(data, title)}
      >
        <FileDown className="mr-2 h-4 w-4" />
        Export Excel
      </Button>
    </div>
  );
}