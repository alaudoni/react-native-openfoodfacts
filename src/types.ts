import React from "react";
import type { FetchFn } from "@openfoodfacts/openfoodfacts-nodejs";
import { ProductResponse } from "./types/product";

export type OpenFoodFactsEnvironment = "production" | "staging";

export type OpenFoodFactsConfig = {
  environment?: OpenFoodFactsEnvironment;
  headers?: Record<string, string>;
  fetch?: FetchFn;
  // Application identity used in the User-Agent header
  appName?: string;
  version?: string;
  contactEmail?: string;
  // Cache time in minutes (default: 10)
  cacheTime?: number;
};

export type OpenFoodFactsApi = {
  getProduct: (ean: string, signal?: AbortSignal) => Promise<ProductResponse>;
};

export const OpenFoodFactsConfigContext = React.createContext<
  | {
      config: OpenFoodFactsConfig;
      api: OpenFoodFactsApi;
    }
  | undefined
>(undefined);
