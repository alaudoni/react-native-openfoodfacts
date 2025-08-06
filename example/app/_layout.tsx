import { Stack } from "expo-router";
import { OpenFoodFactsProvider } from "react-native-openfoodfacts";

export default function RootLayout() {
  return (
    <OpenFoodFactsProvider config={{ environment: "staging" }}>
      <Stack />
    </OpenFoodFactsProvider>
  );
}
