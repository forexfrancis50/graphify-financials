import { createContext, useContext, useState, ReactNode } from "react";

interface ModelData {
  dcf?: {
    revenue: number;
    growthRate: number;
    operatingMargin: number;
    discountRate: number;
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
  options?: {
    stockPrice: number;
    strikePrice: number;
    timeToExpiry: number;
    volatility: number;
    riskFreeRate: number;
  };
}

interface ModelDataContextType {
  modelData: ModelData;
  saveModelData: (modelType: keyof ModelData, data: any) => void;
  getModelData: (modelType: keyof ModelData) => any;
  clearModelData: (modelType: keyof ModelData) => void;
}

const ModelDataContext = createContext<ModelDataContextType | undefined>(undefined);

export function ModelDataProvider({ children }: { children: ReactNode }) {
  const [modelData, setModelData] = useState<ModelData>({});

  const saveModelData = (modelType: keyof ModelData, data: any) => {
    setModelData((prev) => ({
      ...prev,
      [modelType]: data,
    }));
  };

  const getModelData = (modelType: keyof ModelData) => {
    return modelData[modelType];
  };

  const clearModelData = (modelType: keyof ModelData) => {
    setModelData((prev) => {
      const newData = { ...prev };
      delete newData[modelType];
      return newData;
    });
  };

  return (
    <ModelDataContext.Provider value={{ modelData, saveModelData, getModelData, clearModelData }}>
      {children}
    </ModelDataContext.Provider>
  );
}

export function useModelData() {
  const context = useContext(ModelDataContext);
  if (context === undefined) {
    throw new Error("useModelData must be used within a ModelDataProvider");
  }
  return context;
}