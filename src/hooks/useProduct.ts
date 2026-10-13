import { useQuery, type UseQueryOptions } from "@tanstack/react-query";
import { useContext } from "react";
import { DEFAULT_CACHE_TIME, OPENFOODFACTS_QUERY_KEY } from "../constants";
import { OpenFoodFactsConfigContext } from "../types";
import type { ProductResponse } from "../types/product";
import { OpenFoodFactsRequestError } from "../api/getProduct";

export type ProductQueryOptions<TData = ProductResponse> = Omit<
  UseQueryOptions<ProductResponse, Error, TData>,
  "queryKey" | "queryFn"
>;

export function useProduct<TData = ProductResponse>(
  barcode: string,
  options?: ProductQueryOptions<TData>,
) {
  const context = useContext(OpenFoodFactsConfigContext);
  if (!context) {
    throw new Error(
      "Wrap your component in OpenFoodFactsProvider before using useProduct.",
    );
  }
  return useQuery({
    queryKey: [OPENFOODFACTS_QUERY_KEY, barcode],
    queryFn: ({ signal }) => context.api.getProduct(barcode, signal),
    staleTime: 1000 * 60 * (context.config.cacheTime ?? DEFAULT_CACHE_TIME),
    enabled: Boolean(barcode),
    retry: (failureCount, error) =>
      failureCount < 2 &&
      !(error instanceof OpenFoodFactsRequestError && error.status < 500),
    ...options,
  });
}
