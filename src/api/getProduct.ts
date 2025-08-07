import axios from "axios";
import { ProductResponse } from "../types/product";

export async function getProduct(
  ean: string,
  baseUrl: string,
  headers?: Record<string, string>
): Promise<ProductResponse> {
  const res = await axios.get(
    `${baseUrl}/api/v2/product/${ean}`,
    headers ? { headers } : undefined
  );
  return res.data;
}
