# Official SDK compatibility report

Checked on 2026-10-13 on branch `codex/official-sdk-integration`.

## Versions

- Official SDK: `@openfoodfacts/openfoodfacts-nodejs@2.0.0-alpha.35` (pinned).
- Example: Expo 54.0.37, React Native 0.81.5, React 19.1.0.
- Example React Query: 5.104.2, within the declared v5 peer range.
- Local Node.js: 24.15.0.
- Library version: 0.2.0.

The example uses the same Expo SDK generation and React Native/React versions
as AlimAlert. The AlimAlert repository was read only to inspect its dependencies.

## Verified

- Library build and TypeScript checks pass.
- The example installs the generated npm tarball and passes TypeScript checking.
- Metro exports succeed for iOS and Android. Both exports generate Hermes
  bytecode. This demonstrates bundling and compilation, not device execution.
- A real staging lookup through sdk.getProductV3 returned status `success`,
  result ID `product_found`, barcode `3017620422003`, and product name `Nutella`.
- Manual checks with an injected fetch implementation confirmed staging URL,
  app-specific User-Agent, staging Basic authorization, and leading-zero retention.
- Simulated v3 success responses are returned unchanged, with status `success`,
  `result`, and `product`. Simulated HTTP 404, 429, and 503 throw errors with their
  HTTP status and original response payload. An aborted request propagates
  AbortError. The SDK request uses `/api/v3/product/{code}?fields=all`.
- The maintainer reported that the updated example works during manual
  verification. The platform and scenario were not specified, so this does not
  establish full cross-platform runtime coverage.
- The original barcode query key, cacheTime-in-minutes behavior, optional injected
  QueryClient, and shared default QueryClient are retained.

No automated test suite was added. Simulated outcomes were checked interactively,
not by hitting OFF rate limits. Cache behavior was preserved by code inspection;
cache reuse has not yet been verified on a device.

## Implementation decisions

Use the SDK public `getProductV3(barcode, { fields: ["all"] })` method. Product
aliases upstream ProductV3; ProductResponse aliases ProductStateV3<ProductV3>.
Return the SDK data unchanged, preserving its status, result, errors, warnings,
and product fields. No v2 response is reconstructed and no SDK internal client
is called.

The public SDK method does not accept an AbortSignal. Each lookup constructs an
SDK instance with a request-scoped fetch wrapper, keeping concurrent cancellation
signals isolated. That wrapper adds app/staging headers and reports HTTP errors
with status and the original body in details. HTTP 404 is an error rather than a
synthetic numeric-status response. The SDK prerelease remains pinned.

The reactive API is useProduct; useOpenFoodFacts exposes a promise-returning
imperative API. See the README for the v3 response narrowing and migration.

## Remaining verification

- Execute the example and a real staging lookup on iOS and Android runtimes.
- Verify native fetch app headers and AbortSignal behavior on those platforms.
- Check repeated lookup cache reuse and an application-supplied QueryClient.
- Validate any React 18 or Expo/RN versions beyond the example before claiming
  runtime support for them.
- Integrate and verify the packed library in AlimAlert after discussing Phase 4.

An iPhone 17 simulator with iOS 26.4 and Expo Go 54 was detected. The computer-use
interface did not provide usable screenshots or reliable UI actions, so no
simulator lookup is claimed. The first Expo server attempt also encountered
sandbox port restrictions. These limitations do not invalidate the successful
native export checks.

The example dependency installation reported 41 audit findings (17 moderate,
24 high). The root library dependency installation reported none. Broad dependency
remediation is outside this SDK migration; the example has not been declared ready
for distribution as a production app.
