
import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/components/ui/use-toast";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ExportButtons } from "@/components/shared/ExportButtons";
import { fetchFinancialData, saveFinancialData, supportedSources, formatCurrency, FinancialData, getAllFinancialData } from "@/utils/financialDataScraper";
import { Search, Database, Download } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export function FinancialDataFetcher() {
  const [ticker, setTicker] = useState("");
  const [selectedSource, setSelectedSource] = useState(supportedSources[0].name);
  const [isLoading, setIsLoading] = useState(false);
  const [currentData, setCurrentData] = useState<FinancialData | null>(null);
  const [savedData, setSavedData] = useState<FinancialData[]>(getAllFinancialData());
  const { toast } = useToast();

  const handleFetch = async () => {
    if (!ticker) {
      toast({
        title: "Error",
        description: "Please enter a ticker symbol",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    try {
      const data = await fetchFinancialData(ticker, selectedSource);
      if (data) {
        setCurrentData(data);
        // Automatically save the data
        saveFinancialData(data);
        setSavedData(getAllFinancialData());
      }
    } finally {
      setIsLoading(false);
    }
  };

  const getExportData = () => {
    if (!currentData) return [];
    
    const data = [
      {
        Company: currentData.companyName,
        Ticker: currentData.ticker,
        Date: currentData.date,
        Source: currentData.source,
        Revenue: currentData.incomeStatement?.revenue,
        "Operating Income": currentData.incomeStatement?.operatingIncome,
        "Net Income": currentData.incomeStatement?.netIncome,
        EPS: currentData.incomeStatement?.eps,
        "Total Assets": currentData.balanceSheet?.totalAssets,
        "Total Liabilities": currentData.balanceSheet?.totalLiabilities,
        "Total Equity": currentData.balanceSheet?.totalEquity,
        "Current Assets": currentData.balanceSheet?.currentAssets,
        "Current Liabilities": currentData.balanceSheet?.currentLiabilities,
        "Operating Cash Flow": currentData.cashFlow?.operatingCashFlow,
        "Capital Expenditures": currentData.cashFlow?.capex,
        "Free Cash Flow": currentData.cashFlow?.freeCashFlow,
      }
    ];
    
    return data;
  };

  const handleExportAll = () => {
    if (savedData.length === 0) {
      toast({
        title: "No Data",
        description: "There is no financial data to export.",
        variant: "destructive",
      });
      return;
    }
    
    // Format the data for export
    const exportData = savedData.map(data => ({
      Company: data.companyName,
      Ticker: data.ticker,
      Date: data.date,
      Source: data.source,
      Revenue: data.incomeStatement?.revenue,
      "Operating Income": data.incomeStatement?.operatingIncome,
      "Net Income": data.incomeStatement?.netIncome,
      EPS: data.incomeStatement?.eps,
      "Total Assets": data.balanceSheet?.totalAssets,
      "Total Liabilities": data.balanceSheet?.totalLiabilities,
      "Total Equity": data.balanceSheet?.totalEquity,
      "Current Assets": data.balanceSheet?.currentAssets,
      "Current Liabilities": data.balanceSheet?.currentLiabilities,
      "Operating Cash Flow": data.cashFlow?.operatingCashFlow,
      "Capital Expenditures": data.cashFlow?.capex,
      "Free Cash Flow": data.cashFlow?.freeCashFlow,
    }));
    
    // Use the ExportButtons component to handle the export
    // This is added directly to the DOM for the export operation
    const tempExport = document.createElement("div");
    tempExport.style.display = "none";
    document.body.appendChild(tempExport);
    
    // Create a temporary ExportButtons component for this operation
    const exportBtn = document.createElement("button");
    exportBtn.setAttribute("data-export-data", JSON.stringify(exportData));
    exportBtn.setAttribute("data-export-title", "financial_data_export");
    exportBtn.setAttribute("data-export-type", "excel");
    exportBtn.click();
    
    document.body.removeChild(tempExport);
  };

  return (
    <div className="space-y-6">
      <Card className="p-6">
        <h2 className="text-2xl font-bold mb-4">Financial Data Aggregator</h2>
        <p className="text-muted-foreground mb-6">
          Enter a ticker symbol to fetch financial statement data from various financial websites.
        </p>
        
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 mb-6">
          <div>
            <label htmlFor="ticker" className="block text-sm font-medium mb-2">
              Ticker Symbol
            </label>
            <Input
              id="ticker"
              value={ticker}
              onChange={(e) => setTicker(e.target.value.toUpperCase())}
              placeholder="e.g. AAPL"
              className="uppercase"
            />
          </div>
          
          <div>
            <label htmlFor="source" className="block text-sm font-medium mb-2">
              Data Source
            </label>
            <Select value={selectedSource} onValueChange={setSelectedSource}>
              <SelectTrigger>
                <SelectValue placeholder="Select a source" />
              </SelectTrigger>
              <SelectContent>
                {supportedSources.map((source) => (
                  <SelectItem key={source.name} value={source.name}>
                    {source.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div className="flex items-end">
            <Button 
              onClick={handleFetch} 
              disabled={isLoading} 
              className="w-full"
            >
              {isLoading ? (
                "Fetching..."
              ) : (
                <>
                  <Search className="mr-2 h-4 w-4" />
                  Fetch Data
                </>
              )}
            </Button>
          </div>
        </div>

        {savedData.length > 0 && (
          <div className="flex justify-end mb-4">
            <Button variant="outline" onClick={handleExportAll}>
              <Database className="mr-2 h-4 w-4" />
              Export All Data
            </Button>
          </div>
        )}
        
        <Tabs defaultValue="current">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="current">Current Data</TabsTrigger>
            <TabsTrigger value="saved">Saved Data ({savedData.length})</TabsTrigger>
          </TabsList>
          
          <TabsContent value="current" className="pt-4">
            {currentData ? (
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-semibold">
                    {currentData.companyName} ({currentData.ticker})
                  </h3>
                  <ExportButtons
                    title={`${currentData.ticker}_financial_data`}
                    data={getExportData()}
                  />
                </div>
                
                <div className="grid gap-6 md:grid-cols-3">
                  <Card className="p-4">
                    <h4 className="text-sm font-medium mb-2">Income Statement</h4>
                    <ul className="space-y-2">
                      <li className="flex justify-between">
                        <span className="text-sm text-muted-foreground">Revenue</span>
                        <span>{formatCurrency(currentData.incomeStatement?.revenue || 0)}</span>
                      </li>
                      <li className="flex justify-between">
                        <span className="text-sm text-muted-foreground">Operating Income</span>
                        <span>{formatCurrency(currentData.incomeStatement?.operatingIncome || 0)}</span>
                      </li>
                      <li className="flex justify-between">
                        <span className="text-sm text-muted-foreground">Net Income</span>
                        <span>{formatCurrency(currentData.incomeStatement?.netIncome || 0)}</span>
                      </li>
                      <li className="flex justify-between">
                        <span className="text-sm text-muted-foreground">EPS</span>
                        <span>${currentData.incomeStatement?.eps.toFixed(2) || 0}</span>
                      </li>
                    </ul>
                  </Card>
                  
                  <Card className="p-4">
                    <h4 className="text-sm font-medium mb-2">Balance Sheet</h4>
                    <ul className="space-y-2">
                      <li className="flex justify-between">
                        <span className="text-sm text-muted-foreground">Total Assets</span>
                        <span>{formatCurrency(currentData.balanceSheet?.totalAssets || 0)}</span>
                      </li>
                      <li className="flex justify-between">
                        <span className="text-sm text-muted-foreground">Total Liabilities</span>
                        <span>{formatCurrency(currentData.balanceSheet?.totalLiabilities || 0)}</span>
                      </li>
                      <li className="flex justify-between">
                        <span className="text-sm text-muted-foreground">Total Equity</span>
                        <span>{formatCurrency(currentData.balanceSheet?.totalEquity || 0)}</span>
                      </li>
                      <li className="flex justify-between">
                        <span className="text-sm text-muted-foreground">Current Ratio</span>
                        <span>
                          {((currentData.balanceSheet?.currentAssets || 0) / 
                            (currentData.balanceSheet?.currentLiabilities || 1)).toFixed(2)}
                        </span>
                      </li>
                    </ul>
                  </Card>
                  
                  <Card className="p-4">
                    <h4 className="text-sm font-medium mb-2">Cash Flow</h4>
                    <ul className="space-y-2">
                      <li className="flex justify-between">
                        <span className="text-sm text-muted-foreground">Operating Cash Flow</span>
                        <span>{formatCurrency(currentData.cashFlow?.operatingCashFlow || 0)}</span>
                      </li>
                      <li className="flex justify-between">
                        <span className="text-sm text-muted-foreground">Capital Expenditures</span>
                        <span>{formatCurrency(currentData.cashFlow?.capex || 0)}</span>
                      </li>
                      <li className="flex justify-between">
                        <span className="text-sm text-muted-foreground">Free Cash Flow</span>
                        <span>{formatCurrency(currentData.cashFlow?.freeCashFlow || 0)}</span>
                      </li>
                    </ul>
                  </Card>
                </div>
              </div>
            ) : (
              <div className="text-center py-12 text-muted-foreground">
                No data available. Enter a ticker symbol and fetch data to view financial information.
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="saved" className="pt-4">
            {savedData.length > 0 ? (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Company</TableHead>
                      <TableHead>Ticker</TableHead>
                      <TableHead>Source</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead>Revenue</TableHead>
                      <TableHead>Net Income</TableHead>
                      <TableHead>Total Assets</TableHead>
                      <TableHead>FCF</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {savedData.map((data, index) => (
                      <TableRow key={`${data.ticker}-${data.source}-${index}`}>
                        <TableCell>{data.companyName}</TableCell>
                        <TableCell>{data.ticker}</TableCell>
                        <TableCell>{data.source}</TableCell>
                        <TableCell>{data.date}</TableCell>
                        <TableCell>{formatCurrency(data.incomeStatement?.revenue || 0)}</TableCell>
                        <TableCell>{formatCurrency(data.incomeStatement?.netIncome || 0)}</TableCell>
                        <TableCell>{formatCurrency(data.balanceSheet?.totalAssets || 0)}</TableCell>
                        <TableCell>{formatCurrency(data.cashFlow?.freeCashFlow || 0)}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            ) : (
              <div className="text-center py-12 text-muted-foreground">
                No saved data available.
              </div>
            )}
          </TabsContent>
        </Tabs>
      </Card>
    </div>
  );
}
