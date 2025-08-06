import React from "react";

export type OpenFoodFactsEnvironment = "production" | "staging";

export type OpenFoodFactsConfig = {
  environment?: OpenFoodFactsEnvironment;
  headers?: Record<string, string>;
  userAgent?: string;
};

export type OpenFoodFactsApi = {
  getProduct: (ean: string) => Promise<any>;
};

export const OpenFoodFactsConfigContext = React.createContext<
  | {
      config: OpenFoodFactsConfig;
      api: OpenFoodFactsApi;
    }
  | undefined
>(undefined);
