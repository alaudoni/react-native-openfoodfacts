import React from "react";
import { ProductResponse } from "./types/product";

export type OpenFoodFactsEnvironment = "production" | "staging";

export type OpenFoodFactsConfig = {
  environment?: OpenFoodFactsEnvironment;
  headers?: Record<string, string>;
  // Parametri per la composizione dello User-Agent
  appName?: string;
  version?: string;
  contactEmail?: string;
  // Cache time in minutes (default: 10)
  cacheTime?: number;
};

export type OpenFoodFactsApi = {
  getProduct: (ean: string) => Promise<ProductResponse>;
};

export const OpenFoodFactsConfigContext = React.createContext<
  | {
      config: OpenFoodFactsConfig;
      api: OpenFoodFactsApi;
    }
  | undefined
>(undefined);
