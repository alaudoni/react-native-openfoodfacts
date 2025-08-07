# react-native-openfoodfacts

A simple and idiomatic wrapper to access the [OpenFoodFacts](https://world.openfoodfacts.org/) API from React Native.

> ⚠️ Early stage project: the library is under active development.

## Goals

- Provide hooks and functions to easily access OpenFoodFacts data in React Native apps
- Take inspiration from the structure and features of the [Flutter openfoodfacts-dart library](https://github.com/openfoodfacts/openfoodfacts-dart)
- Keep the codebase clean, lightweight, and easily extensible

## Installation

```sh
npm install react-native-openfoodfacts
```

or

```sh
yarn add react-native-openfoodfacts
```

## Setup

Wrap your app (or the part of the app that uses OpenFoodFacts hooks) with the `OpenFoodFactsProvider` to enable React Query context:

```tsx
import { OpenFoodFactsProvider } from "react-native-openfoodfacts";

export default function App() {
  return (
    <OpenFoodFactsProvider
      config={{
        environment: "staging", // or "production"
        appName: "Your App Name",
        version: "1.0.0",
        contactEmail: "your-email@example.com",
        cacheTime: 10, // optional, cache time in minutes (default: 10)
      }}
    >
      {/* Your app components */}
    </OpenFoodFactsProvider>
  );
}
```

## Basic usage

```tsx
import { useOpenFoodFacts } from "react-native-openfoodfacts";

export default function ProductScreen() {
  const { getProduct } = useOpenFoodFacts();

  const {
    data: productResponse,
    isLoading,
    error,
  } = getProduct("3017620422003"); // Example EAN

  const product = productResponse?.product;

  if (isLoading) return <Text>Loading...</Text>;
  if (error) return <Text>Error: {error.message}</Text>;
  if (!product) return <Text>Product not found</Text>;

  return (
    <View>
      <Text>{product.product_name}</Text>
      <Text>{product.brands}</Text>
    </View>
  );
}
```

## Useful links

- [OpenFoodFacts](https://world.openfoodfacts.org/)
- [OpenFoodFacts API](https://world.openfoodfacts.org/data)

---

Contributions and feedback are welcome!
