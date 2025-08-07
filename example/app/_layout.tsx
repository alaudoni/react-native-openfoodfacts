import { Stack } from "expo-router";
import { OpenFoodFactsProvider } from "react-native-openfoodfacts";

export default function RootLayout() {
  return (
    <OpenFoodFactsProvider
      config={{
        environment: "staging",
        appName: "Sicurezza Alimentare",
        version: "1.0.0",
        contactEmail: "andrealaudoni@gmail.com",
      }}
    >
      <Stack />
    </OpenFoodFactsProvider>
  );
}
