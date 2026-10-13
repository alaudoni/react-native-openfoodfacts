import { useState } from "react";
import {
  ActivityIndicator,
  Button,
  ScrollView,
  Text,
  TextInput,
} from "react-native";
import {
  OpenFoodFactsRequestError,
  useProduct,
} from "react-native-openfoodfacts";

export default function Index() {
  const [input, setInput] = useState("3017620422003");
  const [barcode, setBarcode] = useState("");
  const { data, isFetching, error, refetch } = useProduct(barcode);
  const product = data && "product" in data ? data.product : undefined;
  const notFound =
    error instanceof OpenFoodFactsRequestError && error.status === 404;
  return (
    <ScrollView contentContainerStyle={{ padding: 24, gap: 16 }}>
      <Text>Open Food Facts SDK example (staging)</Text>
      <TextInput
        accessibilityLabel="Barcode"
        value={input}
        onChangeText={setInput}
        keyboardType="number-pad"
        style={{ borderWidth: 1, padding: 12 }}
      />
      <Button
        title="Look up product"
        onPress={() => {
          if (input === barcode) void refetch();
          else setBarcode(input);
        }}
        disabled={!input || isFetching}
      />
      {isFetching && <ActivityIndicator />}
      {error && <Text>{notFound ? "Product not found" : error.message}</Text>}
      {!error &&
        data &&
        (product ? (
          <>
            <Text>{product.product_name || "Product name unavailable"}</Text>
            <Text>{product.brands || "Brand unavailable"}</Text>
            <Text>{product.ingredients_text || "Ingredients unavailable"}</Text>
            <Text>
              {product.allergens || "Allergen information unavailable"}
            </Text>
          </>
        ) : (
          <Text>{data.result.name}</Text>
        ))}
      <Text>Product data from Open Food Facts.</Text>
    </ScrollView>
  );
}
