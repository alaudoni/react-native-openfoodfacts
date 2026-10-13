# Open Food Facts example

This Expo 54 / React Native 0.81.5 app consumes the locally packed library. It uses
OFF staging and performs a lookup only after pressing **Look up product**.

From the repository root:

```sh
npm install
mkdir -p artifacts
npm pack --pack-destination artifacts
cd example
npm install
npx expo start
```

Use a barcode present in the staging database; production and staging contents
can differ. Change the provider configuration in `app/_layout.tsx` when needed.
After changing the library, repack it and reinstall the tarball in this example.
