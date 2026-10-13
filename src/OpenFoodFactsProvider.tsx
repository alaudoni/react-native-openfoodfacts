import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import React, { ReactNode, useMemo } from "react";
import { createOpenFoodFactsClient } from "./api/getProduct";
import { DEFAULT_CACHE_TIME } from "./constants";
import { OpenFoodFactsConfig, OpenFoodFactsConfigContext } from "./types";

type OFFProviderProps = {
  children: ReactNode;
  queryClient?: QueryClient;
  config: OpenFoodFactsConfig;
};

const defaultClient = new QueryClient();

export const OpenFoodFactsProvider = ({
  children,
  queryClient,
  config,
}: OFFProviderProps) => {
  const {
    environment,
    appName,
    version,
    contactEmail,
    headers,
    fetch,
    cacheTime,
  } = config;
  const value = useMemo(() => {
    const currentConfig = {
      environment: environment ?? ("production" as const),
      appName,
      version,
      contactEmail,
      headers,
      fetch,
      cacheTime: cacheTime ?? DEFAULT_CACHE_TIME,
    };
    return {
      config: currentConfig,
      api: createOpenFoodFactsClient(currentConfig),
    };
  }, [environment, appName, version, contactEmail, headers, fetch, cacheTime]);

  return (
    <OpenFoodFactsConfigContext.Provider value={value}>
      <QueryClientProvider client={queryClient ?? defaultClient}>
        {children}
      </QueryClientProvider>
    </OpenFoodFactsConfigContext.Provider>
  );
};
