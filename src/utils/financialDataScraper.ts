
import { toast } from "@/components/ui/use-toast";

// Financial data structure
export interface FinancialData {
  companyName: string;
  ticker: string;
  source: string;
  date: string;
  incomeStatement?: {
    revenue: number;
    operatingIncome: number;
    netIncome: number;
    eps: number;
  };
  balanceSheet?: {
    totalAssets: number;
    totalLiabilities: number;
    totalEquity: number;
    currentAssets: number;
    currentLiabilities: number;
    cash: number;
    inventory: number;
    receivables: number;
    payables: number;
  };
  cashFlow?: {
    operatingCashFlow: number;
    capex: number;
    freeCashFlow: number;
  };
}

export const supportedSources = [
  { name: "Yahoo Finance", url: "https://finance.yahoo.com/quote/{ticker}/financials" },
  { name: "MarketWatch", url: "https://www.marketwatch.com/investing/stock/{ticker}/financials" },
  { name: "Seeking Alpha", url: "https://seekingalpha.com/symbol/{ticker}/income-statement" },
  { name: "CNBC", url: "https://www.cnbc.com/quotes/{ticker}" }
];

/**
 * Attempts to fetch financial data from the specified source for the given ticker
 */
export const fetchFinancialData = async (
  ticker: string,
  source: string
): Promise<FinancialData | null> => {
  try {
    // In a real implementation, this would use a backend API or service that handles
    // the actual scraping. For demonstration purposes, we'll simulate the response.
    console.log(`Fetching financial data for ${ticker} from ${source}`);
    
    // Simulate an API call with a timeout
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // For demo purposes, generate mock data based on the ticker
    // In a real implementation, this would be actual scraped data
    const mockData: FinancialData = {
      companyName: `${ticker.toUpperCase()} Corporation`,
      ticker: ticker.toUpperCase(),
      source: source,
      date: new Date().toISOString().split('T')[0],
      incomeStatement: {
        revenue: Math.floor(Math.random() * 10000000000) + 1000000000,
        operatingIncome: Math.floor(Math.random() * 2000000000) + 200000000,
        netIncome: Math.floor(Math.random() * 1000000000) + 100000000,
        eps: Math.floor(Math.random() * 10 * 100) / 100 + 0.5,
      },
      balanceSheet: {
        totalAssets: Math.floor(Math.random() * 20000000000) + 5000000000,
        totalLiabilities: Math.floor(Math.random() * 10000000000) + 2000000000,
        totalEquity: Math.floor(Math.random() * 10000000000) + 3000000000,
        currentAssets: Math.floor(Math.random() * 5000000000) + 1000000000,
        currentLiabilities: Math.floor(Math.random() * 3000000000) + 500000000,
        cash: Math.floor(Math.random() * 2000000000) + 200000000,
        inventory: Math.floor(Math.random() * 1000000000) + 100000000,
        receivables: Math.floor(Math.random() * 800000000) + 100000000,
        payables: Math.floor(Math.random() * 600000000) + 100000000,
      },
      cashFlow: {
        operatingCashFlow: Math.floor(Math.random() * 1500000000) + 300000000,
        capex: Math.floor(Math.random() * 500000000) + 100000000,
        freeCashFlow: Math.floor(Math.random() * 1000000000) + 200000000,
      }
    };
    
    return mockData;
  } catch (error) {
    console.error("Error fetching financial data:", error);
    toast({
      title: "Error",
      description: "Failed to fetch financial data. Please try again.",
      variant: "destructive",
    });
    return null;
  }
};

/**
 * Saves financial data to local storage for use across the app
 */
export const saveFinancialData = (data: FinancialData): void => {
  try {
    // Save to localStorage for persistence
    const storedData = localStorage.getItem('financialData');
    let allData: FinancialData[] = [];
    
    if (storedData) {
      allData = JSON.parse(storedData);
      // Check if we already have data for this ticker/source combination
      const existingIndex = allData.findIndex(
        item => item.ticker === data.ticker && item.source === data.source
      );
      
      if (existingIndex >= 0) {
        // Update existing data
        allData[existingIndex] = data;
      } else {
        // Add new data
        allData.push(data);
      }
    } else {
      allData = [data];
    }
    
    localStorage.setItem('financialData', JSON.stringify(allData));
    
    // Announce data is available via a custom event
    const event = new CustomEvent('financialDataUpdated', { detail: data });
    window.dispatchEvent(event);
    
    toast({
      title: "Data Saved",
      description: `Financial data for ${data.companyName} has been saved.`,
    });
  } catch (error) {
    console.error("Error saving financial data:", error);
    toast({
      title: "Error",
      description: "Failed to save financial data.",
      variant: "destructive",
    });
  }
};

/**
 * Retrieves all saved financial data
 */
export const getAllFinancialData = (): FinancialData[] => {
  try {
    const storedData = localStorage.getItem('financialData');
    if (storedData) {
      return JSON.parse(storedData);
    }
  } catch (error) {
    console.error("Error retrieving financial data:", error);
  }
  return [];
};

/**
 * Formats large numbers for display
 */
export const formatCurrency = (value: number): string => {
  if (value >= 1000000000) {
    return `$${(value / 1000000000).toFixed(2)}B`;
  } else if (value >= 1000000) {
    return `$${(value / 1000000).toFixed(2)}M`;
  } else if (value >= 1000) {
    return `$${(value / 1000).toFixed(2)}K`;
  } else {
    return `$${value.toFixed(2)}`;
  }
};
