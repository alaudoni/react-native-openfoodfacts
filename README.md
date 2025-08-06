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
    <OpenFoodFactsProvider>{/* Your app components */}</OpenFoodFactsProvider>
  );
}
```

## Basic usage

```tsx
import { useOpenFoodFacts } from "react-native-openfoodfacts";

export default function ProductScreen() {
  const { data, isLoading, error } = useOpenFoodFacts("3017620422003"); // Example EAN

  if (isLoading) return <Text>Loading...</Text>;
  if (error) return <Text>Error: {error.message}</Text>;

  return (
    <View>
      <Text>{data?.product_name}</Text>
      {/* Other data... */}
    </View>
  );
}
```

## Useful links

- [OpenFoodFacts](https://world.openfoodfacts.org/)
- [OpenFoodFacts API](https://world.openfoodfacts.org/data)
- [Flutter SDK openfoodfacts-dart](https://github.com/openfoodfacts/openfoodfacts-dart)

---

Contributions and feedback are welcome!
