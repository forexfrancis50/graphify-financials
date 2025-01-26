import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import * as XLSX from 'xlsx';

export const exportToPDF = (title: string, data: any[], columns: string[]) => {
  const doc = new jsPDF();
  
  // Add title
  doc.setFontSize(16);
  doc.text(title, 14, 15);
  
  // Add timestamp
  doc.setFontSize(10);
  doc.text(`Generated on: ${new Date().toLocaleString()}`, 14, 25);

  // Convert data to format expected by autoTable
  const tableData = data.map(row => 
    columns.map(col => row[col]?.toString() || '')
  );

  autoTable(doc, {
    head: [columns],
    body: tableData,
    startY: 30,
    styles: { fontSize: 8 },
    headStyles: { fillColor: [41, 128, 185] },
  });

  doc.save(`${title.toLowerCase().replace(/\s+/g, '-')}-${Date.now()}.pdf`);
};

export const exportToExcel = (title: string, data: any[]) => {
  const worksheet = XLSX.utils.json_to_sheet(data);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "Data");
  XLSX.writeFile(workbook, `${title.toLowerCase().replace(/\s+/g, '-')}-${Date.now()}.xlsx`);
};