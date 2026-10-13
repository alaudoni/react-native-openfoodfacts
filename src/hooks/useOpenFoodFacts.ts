import { useContext } from "react";
import { OpenFoodFactsConfigContext } from "../types";

/** Access the imperative API. For reactive lookups, use useProduct instead. */
export function useOpenFoodFacts() {
  const context = useContext(OpenFoodFactsConfigContext);
  if (!context) {
    throw new Error(
      "Wrap your component in OpenFoodFactsProvider before using useOpenFoodFacts.",
    );
  }
  return context.api;
}
