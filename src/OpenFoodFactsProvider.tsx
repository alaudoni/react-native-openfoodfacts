import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import React, { ReactNode } from "react";
import {
  PRODUCTION_ENV,
  PRODUCTION_URL,
  STAGING_ENV,
  STAGING_URL,
} from "./constants";
import {
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

  return {
    ...config,
    environment,
    headers,
    // baseUrl non più esposto nel config, ma lo restituiamo come proprietà interna se serve
    baseUrl,
  };
};

export const OpenFoodFactsProvider = ({
  children,
  queryClient,
  config,
}: OFFProviderProps) => {
  const effectiveConfig = getDefaultConfig(config);
  return (
    <OpenFoodFactsConfigContext.Provider value={effectiveConfig}>
      <QueryClientProvider client={queryClient ?? defaultClient}>
        {children}
      </QueryClientProvider>
    </OpenFoodFactsConfigContext.Provider>
  );
};
