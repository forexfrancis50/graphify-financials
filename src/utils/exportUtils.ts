import jsPDF from 'jspdf';
import * as XLSX from 'xlsx';
import 'jspdf-autotable';

declare module 'jspdf' {
  interface jsPDF {
    autoTable: (options: any) => jsPDF;
  }
}

export const exportToPDF = (data: any[], filename: string) => {
  const doc = new jsPDF();
  
  if (data.length > 0) {
    const headers = Object.keys(data[0]);
    const rows = data.map(Object.values);
    
    doc.autoTable({
      head: [headers],
      body: rows,
    });
  }
  
  doc.save(`${filename}.pdf`);
};

export const exportToExcel = (data: any[], filename: string) => {
  const ws = XLSX.utils.json_to_sheet(data);
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');
  XLSX.writeFile(wb, `${filename}.xlsx`);
};