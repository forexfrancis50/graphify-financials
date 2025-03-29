
import { FinancialData } from "./financialDataScraper";

// Map raw financial data to the specific model data structure
export const mapFinancialDataToModel = (
  data: FinancialData,
  modelType: string
): any => {
  switch (modelType) {
    case 'dcf':
      return {
        revenue: data.incomeStatement?.revenue || 0,
        growthRate: 0.05, // Default growth rate
        operatingMargin: data.incomeStatement
          ? (data.incomeStatement.operatingIncome / data.incomeStatement.revenue) * 100
          : 15,
        discountRate: 10, // Default discount rate
      };
      
    case 'options':
      return {
        stockPrice: 0, // Stock price not available in financial data
        strikePrice: 0, // Strike price not available
        timeToExpiry: 1, // Default 1 year
        riskFreeRate: 0.03, // Default risk-free rate
        volatility: 0.3, // Default volatility
        optionType: "call" as const, // Default option type
        dividendYield: 0.02, // Default dividend yield
      };
      
    case 'financialRatios':
      return {
        netIncome: data.incomeStatement?.netIncome || 0,
        totalAssets: data.balanceSheet?.totalAssets || 0,
        totalEquity: data.balanceSheet?.totalEquity || 0,
        totalLiabilities: data.balanceSheet?.totalLiabilities || 0,
        currentAssets: data.balanceSheet?.currentAssets || 0,
        currentLiabilities: data.balanceSheet?.currentLiabilities || 0,
        revenue: data.incomeStatement?.revenue || 0,
      };
      
    case 'breakEven':
      // For break-even analysis, use some derived values
      const operatingIncome = data.incomeStatement?.operatingIncome || 0;
      const revenue = data.incomeStatement?.revenue || 0;
      // Estimate fixed costs as 50% of operating income
      const fixedCosts = operatingIncome * 0.5;
      // Estimate variable cost using revenue and operating income
      const variableCost = (revenue - operatingIncome - fixedCosts) / (revenue * 0.1);
      
      return {
        fixedCosts,
        variableCost,
        sellingPrice: variableCost * 1.5, // Markup over variable cost
      };
      
    case 'evEbitda':
      return {
        enterpriseValue: (data.balanceSheet?.totalAssets || 0) - (data.balanceSheet?.currentAssets || 0) + 
                        (data.balanceSheet?.totalLiabilities || 0),
        ebitda: data.incomeStatement?.operatingIncome || 0,
      };
      
    default:
      return {};
  }
};

// Function to import financial data into local storage for a specific model
export const importFinancialDataToModel = (
  data: FinancialData,
  modelType: string
): void => {
  try {
    const mappedData = mapFinancialDataToModel(data, modelType);
    localStorage.setItem(`${modelType}ModelData`, JSON.stringify(mappedData));
    
    // Dispatch event to notify components that data has been imported
    const event = new CustomEvent('modelDataImported', { 
      detail: { modelType, data: mappedData } 
    });
    window.dispatchEvent(event);
  } catch (error) {
    console.error(`Error importing data to ${modelType} model:`, error);
  }
};

// Get a list of models that can import financial data
export const getCompatibleModels = (): {id: string, name: string}[] => {
  return [
    { id: 'dcf', name: 'Discounted Cash Flow' },
    { id: 'options', name: 'Options Pricing' },
    { id: 'financialRatios', name: 'Financial Ratios' },
    { id: 'breakEven', name: 'Break-Even Analysis' },
    { id: 'evEbitda', name: 'EV/EBITDA Valuation' },
  ];
};
