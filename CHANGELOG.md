# Changelog

## 0.2.0 — 2026-10-13

Migrate barcode lookup to the official Open Food Facts JavaScript SDK and its
public getProductV3 method. The SDK is pinned to 2.0.0-alpha.35.

### Breaking changes

- Use useProduct(barcode, options) for reactive queries. The getProduct method
  returned by useOpenFoodFacts now returns a promise for imperative lookups.
- Product and ProductResponse now use the SDK ProductV3 and
  ProductStateV3<ProductV3> types. Responses use string status and result fields
  instead of numeric v2 status and status_verbose. Narrow the response before
  reading product fields.
- The former manually maintained nested product types and Unit enum are removed.
- React and TanStack React Query 5 are peer dependencies. Provide appName,
  version, and contactEmail in the provider configuration.

### Changes

- Replace Axios and duplicated product schemas with the official SDK.
- Add createOpenFoodFactsClient for lookups outside React components.
- Forward request cancellation and preserve HTTP status and error payloads.
- Preserve cacheTime, barcode query keys, and injected QueryClient support.
- Generate consumable JavaScript and TypeScript declarations in the package.
- Update the Expo example to SDK 54 and React Native 0.81.5, using a local tarball.
- Add English setup/migration documentation and the ISC license file.

### Verification

TypeScript and build checks, local tarball installation, iOS/Android Metro exports
with Hermes bytecode, a live staging lookup, and manual example verification by
the maintainer. No automated test suite was added. See the compatibility report
for remaining platform checks.
