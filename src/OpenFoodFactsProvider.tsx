import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import React, { ReactNode } from "react";
import { getProduct as fetchProduct } from "./api/getProduct";
import {
  PRODUCTION_ENV,
  PRODUCTION_URL,
  STAGING_ENV,
  STAGING_URL,
} from "./constants";
import {
  OpenFoodFactsApi,
  OpenFoodFactsConfig,
  OpenFoodFactsConfigContext,
  OpenFoodFactsEnvironment,
} from "./types";

type OFFProviderProps = {
  children: ReactNode;
  queryClient?: QueryClient;
  config?: OpenFoodFactsConfig;
};

const defaultClient = new QueryClient();

const getDefaultConfig = (config?: OpenFoodFactsConfig) => {
  const environment: OpenFoodFactsEnvironment =
    config?.environment ?? PRODUCTION_ENV;
  let headers = config?.headers;

  // baseUrl è sempre calcolata internamente
  const baseUrl = environment === STAGING_ENV ? STAGING_URL : PRODUCTION_URL;

  let userAgent = "";
  if (config?.appName && config?.version && config?.contactEmail) {
    userAgent = `${config.appName}/${config.version} (${config.contactEmail})`;
  }

  if (environment === STAGING_ENV && !headers?.Authorization) {
    headers = {
      ...headers,
      Authorization:
        "Basic " +
        (typeof btoa !== "undefined"
          ? btoa("off:off")
          : Buffer.from("off:off").toString("base64")),
    };
  }

  // Aggiungiamo lo User-Agent agli headers se presente
  if (userAgent) {
    headers = {
      ...headers,
      "User-Agent": userAgent,
    };
  }

  return {
    ...config,
    environment,
    headers,
    baseUrl,
    userAgent,
  };
};

export const OpenFoodFactsProvider = ({
  children,
  queryClient,
  config,
}: OFFProviderProps) => {
  const currentConfig = getDefaultConfig(config);

  const openFoodFactsApi: OpenFoodFactsApi = {
    getProduct: (ean: string) =>
      fetchProduct(ean, currentConfig.baseUrl, currentConfig.headers),
  };

  return (
    <OpenFoodFactsConfigContext.Provider
      value={{
        config: currentConfig,
        api: openFoodFactsApi,
      }}
    >
      <QueryClientProvider client={queryClient ?? defaultClient}>
        {children}
      </QueryClientProvider>
    </OpenFoodFactsConfigContext.Provider>
  );
};
