import type {
  ProductV3,
  ProductStateV3,
} from "@openfoodfacts/openfoodfacts-nodejs";

/** Product and response schemas exported by the official SDK's v3 API. */
export type Product = ProductV3;
export type ProductResponse = ProductStateV3<ProductV3>;
export type {
  ProductV3,
  ProductStateV3,
  ProductQueryV3,
} from "@openfoodfacts/openfoodfacts-nodejs";
