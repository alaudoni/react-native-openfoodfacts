import { QueryClient } from "@tanstack/react-query";
import { useContext } from "react";
import { OPENFOODFACTS_QUERY_KEY } from "../constants";
import { OpenFoodFactsConfigContext } from "../types";

export function useOpenFoodFacts() {
  const context = useContext(OpenFoodFactsConfigContext);
  const queryClient = new QueryClient();

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

  const getProduct = async (ean: string) => {
    return queryClient.fetchQuery({
      queryKey: [OPENFOODFACTS_QUERY_KEY, ean],
      queryFn: () => context.api.getProduct(ean),
      staleTime: 1000 * 60 * 5,
    });
  };

  return { getProduct };
}
