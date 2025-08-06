import { useEffect } from "react";
import { Text, View } from "react-native";
import { useOpenFoodFacts } from "react-native-openfoodfacts";

export default function Index() {
  const { getProduct } = useOpenFoodFacts();

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const product = await getProduct("3017620422003");
        console.log("Product data:", product);
      } catch (error) {
        console.error("Error fetching product:", error);
      }
    };

    fetchProduct();
  }, [getProduct]);

  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Text>Edit app/index.tsx to edit this screen.</Text>
    </View>
  );
}
