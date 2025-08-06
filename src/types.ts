import React from "react";

export type OpenFoodFactsEnvironment = "production" | "staging";

export type OpenFoodFactsConfig = {
  environment?: OpenFoodFactsEnvironment; // "production" (default) | "staging"
  headers?: Record<string, string>; // default: Authorization per staging, può essere sovrascritto
  userAgent?: string; // opzionale, da aggiungere alle richieste
  // altri parametri futuri
};

export const OpenFoodFactsConfigContext = React.createContext<
  OpenFoodFactsConfig | undefined
>(undefined);
