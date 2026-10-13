# Open Food Facts integration plan

Status: library refactor and package checks implemented on
`codex/official-sdk-integration`; native runtime checks remain pending.
See [the compatibility report](sdk-compatibility.md).

## Objective

Prepare react-native-openfoodfacts for use in AlimAlert as a small React Native
integration layer over the official Open Food Facts JavaScript SDK, subject to
verified compatibility. Deliver barcode lookup first and publish only after the
packed library has been validated in the example. AlimAlert integration follows
the release, as agreed with the user on 2026-10-13.

Project code, comments, documentation, issues, and pull requests use English.

Agreed constraints: preserve the existing cache behavior unless SDK integration
requires a specific adjustment; do not add automated tests for now. Explain and
detail Phase 4 with the user when that phase is reached.

## Scope

The library owns SDK configuration, an imperative lookup client, React Query
hooks, request outcomes, and cache behavior. The wrapper delegates to the SDK public API and reuses its
response schemas, rather than keeping a legacy response envelope.
AlimAlert owns its product model,
barcode scanner, navigation, screens, and interpretation of product data.

Search, product editing, image uploads, persistent offline storage, and UI design
are deferred. Missing product data must remain distinguishable from empty data;
the library must not infer that a product is safe from absent allergen fields.

## Phase 1 — SDK compatibility spike

- Record the exact official SDK version and the Expo, React Native, React,
  TypeScript, and React Query versions to support, using AlimAlert's actual stack.
- Test a published SDK package, rather than relying on the upstream development
  branch. Pin the evaluated prerelease version during the spike.
- Check Metro bundling, Hermes execution, package exports, and TypeScript imports.
- Verify injected fetch, production/staging URLs, staging authorization, and app
  identification headers. Use staging for live development requests.
- Check the supported product endpoint and response types, including requested
  fields, language options, and cancellation support. Prefer the current API
  recommended by OFF when supported by the tested SDK. Use the SDK public
  getProductV3 method and adapt product/response types to its v3 schemas.
- Exercise found and missing products, incomplete data, network failures, and
  cancellation. Simulate rate limiting instead of deliberately exhausting limits.

Deliverable: a reproducible example and a compatibility report distinguishing
runtime checks from static inspection and documenting any untested platforms.

Exit criterion: verified compatibility on the available target runtime, with an
explicit checklist for remaining platforms. If blocked, document the precise
limitation and assess a small upstream fix before choosing a fallback transport.

## Phase 2 — Public API and implementation

- Define a direct useProduct(barcode, options) hook and an imperative lookup API.
- Require app identification at configuration time and keep client instances
  stable across provider renders.
- Reuse upstream product types where sufficient; document gaps rather than
  copying an entire product schema.
- Preserve the existing React Query cache, cacheTime configuration, and support
  for an injected QueryClient. Check for necessary SDK integration adjustments
  through manual verification; avoid a general cache redesign or renaming.
- Keep barcodes as strings, preserve leading zeros, and define validation based
  on supported OFF barcode formats rather than assuming every code is EAN-13.
- Distinguish not-found outcomes from transport, API, and configuration errors.
- Forward cancellation and configure bounded retry behavior that respects rate
  limits and avoids retrying invalid input or missing products.
- Define React and React Query peer dependencies and tested compatibility ranges.
- Document the migration from useOpenFoodFacts().getProduct();
  choose an explicit breaking migration or a temporary deprecated adapter.

Deliverable: the narrow lookup API and English migration documentation.

Exit criterion: configuration, hook behavior, response contracts, and migration
are coherent and verified. No scanner or application screens are added here.

## Phase 3 — Package verification

- Use build, type checking, package inspection, and manual example-app checks.
  Do not add automated tests in this iteration.
- Verify declaration resolution and Metro consumption of emitted JSX/modules.
  Choose supported module formats from consumer requirements.
- Install an npm pack tarball in the example app and validate documented usage;
  replace its dependency on the old committed 0.1.0 tarball.
- Add the license file matching the chosen package license, update the README,
  and record the tested platform/version matrix.

Deliverable: a reproducible package and passing release checks.

Exit criterion: the packed artifact works in the example app; source imports
alone are not sufficient evidence.

## Phase 4 — AlimAlert integration (details deferred)

Explain the proposed integration to the user and define its implementation steps
when this phase is reached, using AlimAlert's actual code and the completed
library. The intended outcome remains a working data integration before UI
design. Detailed deliverables and exit criteria will be agreed at that point.

## Phase 5 — Release and upstream coordination

- Target 0.2.0; use a prerelease if compatibility evidence remains incomplete.
- Prepare the English changelog, migration instructions, release notes, and a
  reply to issue #1 explaining SDK reuse and verified runtime compatibility.
- Recheck the SDK version and current OFF API guidance before release.
- Publication of 0.2.0 was authorized by the user on 2026-10-13 following their
  manual example check. AlimAlert integration remains a separate later phase. Send the issue reply only when explicitly authorized.

Deliverable: an npm release and corresponding GitHub release, followed by
updating AlimAlert to the released version.

## References

- [Official SDK](https://github.com/openfoodfacts/openfoodfacts-js)
- [OFF API documentation](https://openfoodfacts.github.io/openfoodfacts-server/api/)
- [Upstream reuse suggestion](https://github.com/alaudoni/react-native-openfoodfacts/issues/1)
- [Published library](https://www.npmjs.com/package/react-native-openfoodfacts)
