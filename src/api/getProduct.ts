import axios from "axios";

export async function getProduct(
  ean: string,
  baseUrl: string,
  headers?: Record<string, string>
) {
  const res = await axios.get(
    `${baseUrl}/api/v2/product/${ean}`,
    headers ? { headers } : undefined
  );
  return res.data;
}
