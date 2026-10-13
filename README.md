# react-native-openfoodfacts

React Native hooks and a lookup client built on the
[official Open Food Facts JavaScript SDK](https://github.com/openfoodfacts/openfoodfacts-js).

Version 0.2.0 migrates the library to the official SDK. See the migration guide
below when upgrading from 0.1.0. The SDK is pinned to `2.0.0-alpha.35` while compatibility is evaluated.
Barcode lookup delegates to the SDK public `getProductV3()` method. Product and
response types are exported directly from the SDK v3 types.

## Installation

```sh
npm install react-native-openfoodfacts @tanstack/react-query
```

React 18/19 and TanStack React Query 5 are peer dependencies. See the
[compatibility report](docs/sdk-compatibility.md) for verification limits.

## Setup

```tsx
import { QueryClient } from "@tanstack/react-query";
import { OpenFoodFactsProvider } from "react-native-openfoodfacts";

const queryClient = new QueryClient();

export default function App() {
  return (
    <OpenFoodFactsProvider
      queryClient={queryClient}
      config={{
        environment: "production", // Use staging for development.
        appName: "YourApp",
        version: "1.0.0",
        contactEmail: "your-email@example.com",
        cacheTime: 10,
      }}
    >
      {/* Your app */}
    </OpenFoodFactsProvider>
  );
}
```

`queryClient` is optional; pass your existing client if the app already uses React
Query. The provider retains the original shared default client when omitted.
`cacheTime` retains its existing meaning: minutes of query freshness (`staleTime`),
not the lifetime of unused cache entries. React Query controls garbage collection.
The existing query key remains `['openfoodfacts', barcode]`; use separate query
clients when accessing different environments in the same app.

App name, version, and contact email are required at runtime. The provider adds
app identification and public staging authorization headers. Optional `headers`
and `fetch` configuration support custom networking. Browser runtimes may restrict
custom User-Agent headers; native runtime behavior requires platform verification.

## Product lookup

```tsx
import { Text } from "react-native";
import { useProduct } from "react-native-openfoodfacts";

export function ProductDetails({ barcode }: { barcode: string }) {
  const { data, isLoading, error } = useProduct(barcode);
  if (!barcode) return <Text>Enter a barcode</Text>;
  if (isLoading) return <Text>Loading...</Text>;
  if (error) return <Text>{error.message}</Text>;
  if (!data) return <Text>No response</Text>;
  if (!("product" in data)) return <Text>{data.result.name}</Text>;
  return <Text>{data.product.product_name ?? "Product name unavailable"}</Text>;
}
```

Barcodes are digit strings; leading zeros are preserved. Empty barcodes disable
queries by default. Pass React Query options such as `enabled`, `select`,
`staleTime`, or `gcTime` as the second argument. Cancellation is forwarded to the
SDK request. The query data is the SDK v3 response: inspect `status` and `result`, and narrow
with `"product" in data` before reading product fields. HTTP failures, including
404, throw `OpenFoodFactsRequestError` with a numeric HTTP `status` and the original
response payload in `details`. Network errors propagate. The default retry policy allows at most two retries and does not retry
HTTP 4xx errors, including rate limits. Consumer query options can override it.

## Imperative lookup

```ts
import { createOpenFoodFactsClient } from "react-native-openfoodfacts";

const client = createOpenFoodFactsClient({
  environment: "staging",
  appName: "YourApp",
  version: "1.0.0",
  contactEmail: "your-email@example.com",
});
const result = await client.getProduct("3017620422003");
```

Within the provider, `useOpenFoodFacts()` exposes this imperative API. Its
`getProduct()` returns a promise and does not use the React Query cache.

## Migration from 0.1.0

- Replace reactive `useOpenFoodFacts().getProduct(barcode, options)` calls with
  `useProduct(barcode, options)`. Call the hook unconditionally in your component.
- Supply the provider's `config` and required app identity fields.
- Install React Query as an application dependency and pass your QueryClient if
  you already have one.
- `Product` now aliases the official `ProductV3` schema, and `ProductResponse`
  aliases `ProductStateV3<ProductV3>`. The former manually
  maintained nested types and `Unit` enum are no longer exported. Adapt any such
  imports to upstream types or your application's model.
- `cacheTime` remains supported. Numeric v2 response status and `status_verbose`
  are replaced by the SDK v3 response (`status`, `result`, and, depending on the
  outcome, `product`, `warnings`, or `errors`).

## Local verification

```sh
npm install
npm run typecheck
npm run build
mkdir -p artifacts
npm pack --pack-destination artifacts
cd example
npm install
npx expo start
```

The example installs the generated tarball, uses staging, and matches AlimAlert's
Expo 54 / React Native 0.81.5 stack. The local package version is 0.2.0. No automated test
suite is added in this iteration.

## Data source

Product data comes from [Open Food Facts](https://world.openfoodfacts.org/).
Consult the [API documentation](https://openfoodfacts.github.io/openfoodfacts-server/api/)
for current rate limits, app identification, and database/image reuse terms.
Missing ingredient or allergen information is unknown information and must not
be interpreted as confirmation of absence.
