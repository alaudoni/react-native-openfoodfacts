import { QueryClient } from "@tanstack/react-query";
import { useContext } from "react";
import { getProduct as fetchProduct } from "../api/getProduct";
import { OpenFoodFactsConfigContext } from "../types";

export function useOpenFoodFacts() {
  const config = useContext(OpenFoodFactsConfigContext);
  const queryClient = new QueryClient();

  const getProduct = async (ean: string, category: string) => {
    const baseUrl = (config as any)?.baseUrl;
    const headers = (config as any)?.headers;
    if (!baseUrl) {
      throw new Error("OpenFoodFacts baseUrl not found in context");
    }
    return queryClient.fetchQuery({
      queryKey: ["openfoodfacts", ean],
      queryFn: () => fetchProduct(ean, baseUrl, headers),
      staleTime: 1000 * 60 * 5, // 5 minuti
    });
  };

  return { getProduct };
}
