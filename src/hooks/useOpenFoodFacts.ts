import { useQuery, UseQueryResult } from "@tanstack/react-query";
import { useCallback, useContext } from "react";
import { DEFAULT_CACHE_TIME, OPENFOODFACTS_QUERY_KEY } from "../constants";
import { OpenFoodFactsConfigContext } from "../types";
import { ProductResponse } from "../types/product";

export function useOpenFoodFacts() {
  const context = useContext(OpenFoodFactsConfigContext);

  if (!context) {
    throw new Error(
      "OpenFoodFactsContext not found. Make sure you are using OpenFoodFactsProvider."
    );
  }
  if (
    !context.config?.appName ||
    !context.config?.version ||
    !context.config?.contactEmail
  ) {
    throw new Error(
      "Missing required config properties. Make sure appName, version, and contactEmail are provided to OpenFoodFactsProvider."
    );
  }

  const getProduct = useCallback(
    (ean: string): UseQueryResult<ProductResponse, Error> => {
      return useQuery({
        queryKey: [OPENFOODFACTS_QUERY_KEY, ean],
        queryFn: () => context.api.getProduct(ean),
        staleTime: 1000 * 60 * (context.config.cacheTime ?? DEFAULT_CACHE_TIME),
      });
    },
    [context.api, context.config.cacheTime]
  );

  return { getProduct };
}
