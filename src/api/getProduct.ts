import { OpenFoodFacts } from "@openfoodfacts/openfoodfacts-nodejs";
import type { FetchFn } from "@openfoodfacts/openfoodfacts-nodejs";
import type { OpenFoodFactsApi, OpenFoodFactsConfig } from "../types";
import { PRODUCTION_URL, STAGING_URL } from "../constants";

export class OpenFoodFactsRequestError extends Error {
  constructor(
    message: string,
    public readonly status: number,
    public readonly details?: unknown,
  ) {
    super(message);
    this.name = "OpenFoodFactsRequestError";
  }
}

export function createOpenFoodFactsClient(
  config: OpenFoodFactsConfig,
): OpenFoodFactsApi {
  if (
    !config.appName?.trim() ||
    !config.version?.trim() ||
    !config.contactEmail?.trim()
  ) {
    throw new Error(
      "Open Food Facts requires appName, version, and contactEmail.",
    );
  }

  const environment = config.environment ?? "production";
  const baseUrl = environment === "staging" ? STAGING_URL : PRODUCTION_URL;
  const appHeaders = new Headers(config.headers);
  appHeaders.set(
    "User-Agent",
    `${config.appName}/${config.version} (${config.contactEmail})`,
  );
  if (environment === "staging" && !appHeaders.has("Authorization")) {
    // Public staging credentials (off:off); no Buffer or btoa dependency.
    appHeaders.set("Authorization", "Basic b2ZmOm9mZg==");
  }
  const fetchImplementation = config.fetch ?? globalThis.fetch;
  if (!fetchImplementation) {
    throw new Error("A fetch implementation is required.");
  }

  return {
    async getProduct(barcode, signal) {
      if (!barcode.trim() || !/^[0-9]+$/.test(barcode)) {
        throw new Error("Barcode must be a non-empty string of digits.");
      }
      // Scope the fetch wrapper to this request so concurrent lookups never
      // share an AbortSignal. The SDK's public method has no signal argument.
      const fetchWithAppHeaders: FetchFn = async (input, init) => {
        const headers = new Headers(
          typeof input === "object" && "headers" in input
            ? input.headers
            : undefined,
        );
        new Headers(init?.headers).forEach((value, key) =>
          headers.set(key, value),
        );
        appHeaders.forEach((value, key) => headers.set(key, value));
        const response = await fetchImplementation(input, {
          ...init,
          headers,
          ...(signal ? { signal } : {}),
        });
        if (!response.ok) {
          const details: unknown = await response
            .clone()
            .json()
            .catch(() => undefined);
          throw new OpenFoodFactsRequestError(
            `Open Food Facts request failed (HTTP ${response.status}).`,
            response.status,
            details,
          );
        }
        return response;
      };
      const sdk = new OpenFoodFacts(fetchWithAppHeaders, { host: baseUrl });
      const result = await sdk.getProductV3<["all"]>(barcode, {
        fields: ["all"],
      });
      if (!result.data) {
        throw new Error("Open Food Facts SDK returned no product response.");
      }
      return result.data;
    },
  };
}
