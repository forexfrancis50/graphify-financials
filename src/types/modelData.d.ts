
interface ModelData {
  options?: {
    stockPrice: number;
    strikePrice: number;
    timeToExpiry: number;
    riskFreeRate: number;
    volatility: number;
    optionType: "call" | "put";
    dividendYield: number;
  };
  dcf?: {
    revenue: number;
    growthRate: number;
    operatingMargin: number;
    discountRate: number;
    taxRate?: number;
    workingCapitalPercent?: number;
    capexPercent?: number;
    terminalGrowthRate?: number;
    historicalRevenue?: number[];
  };
  accretionDilution?: {
    acquirerShares: number;
    acquirerEPS: number;
    acquirerPE: number;
    targetShares: number;
    targetEPS: number;
    targetPE: number;
  };
  lbo?: {
    purchasePrice: number;
    leverage: number;
    exitMultiple: number;
  };
}
