import {
  ActivityIndicator,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { useOpenFoodFacts } from "react-native-openfoodfacts";

export default function Index() {
  const { getProduct } = useOpenFoodFacts();

  const {
    data: productResponse,
    isLoading,
    error,
  } = getProduct("3017620422003");

  const product = productResponse?.product;

  console.log("Product data:", product?.product_name);
  if (isLoading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#007AFF" />
        <Text style={styles.loadingText}>Caricamento prodotto...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.centered}>
        <Text style={styles.errorText}>
          {error?.message || "Errore nel caricamento del prodotto"}
        </Text>
      </View>
    );
  }

  if (!product) {
    return (
      <View style={styles.centered}>
        <Text style={styles.errorText}>Nessun prodotto disponibile</Text>
      </View>
    );
  }

  const formatNutrient = (value: number | undefined, unit: string = "g") => {
    return value !== undefined ? `${value}${unit}` : "N/A";
  };

  const getNutriScoreColor = (grade: string | undefined) => {
    switch (grade?.toLowerCase()) {
      case "a":
        return "#008000";
      case "b":
        return "#85C441";
      case "c":
        return "#FDD835";
      case "d":
        return "#FF8C00";
      case "e":
        return "#E53935";
      default:
        return "#666";
    }
  };

  return (
    <ScrollView style={styles.container}>
      {/* Header con immagine e nome prodotto */}
      <View style={styles.header}>
        {product.image_url && (
          <Image
            source={{ uri: product.image_url }}
            style={styles.productImage}
          />
        )}
        <View style={styles.headerInfo}>
          <Text style={styles.productName}>
            {product.product_name || "Nome non disponibile"}
          </Text>
          <Text style={styles.brands}>
            {product.brands || "Marca non disponibile"}
          </Text>
          <Text style={styles.quantity}>{product.quantity || ""}</Text>
        </View>
      </View>

      {/* Informazioni nutrizionali principali */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>
          Informazioni Nutrizionali (per 100g)
        </Text>
        <View style={styles.nutritionGrid}>
          <View style={styles.nutritionItem}>
            <Text style={styles.nutritionLabel}>Energia</Text>
            <Text style={styles.nutritionValue}>
              {formatNutrient(
                product.nutriments?.["energy-kcal_100g"],
                " kcal"
              )}
            </Text>
          </View>
          <View style={styles.nutritionItem}>
            <Text style={styles.nutritionLabel}>Grassi</Text>
            <Text style={styles.nutritionValue}>
              {formatNutrient(product.nutriments?.fat_100g)}
            </Text>
          </View>
          <View style={styles.nutritionItem}>
            <Text style={styles.nutritionLabel}>Grassi saturi</Text>
            <Text style={styles.nutritionValue}>
              {formatNutrient(product.nutriments?.["saturated-fat_100g"])}
            </Text>
          </View>
          <View style={styles.nutritionItem}>
            <Text style={styles.nutritionLabel}>Carboidrati</Text>
            <Text style={styles.nutritionValue}>
              {formatNutrient(product.nutriments?.carbohydrates_100g)}
            </Text>
          </View>
          <View style={styles.nutritionItem}>
            <Text style={styles.nutritionLabel}>Zuccheri</Text>
            <Text style={styles.nutritionValue}>
              {formatNutrient(product.nutriments?.sugars_100g)}
            </Text>
          </View>
          <View style={styles.nutritionItem}>
            <Text style={styles.nutritionLabel}>Proteine</Text>
            <Text style={styles.nutritionValue}>
              {formatNutrient(product.nutriments?.proteins_100g)}
            </Text>
          </View>
          <View style={styles.nutritionItem}>
            <Text style={styles.nutritionLabel}>Sale</Text>
            <Text style={styles.nutritionValue}>
              {formatNutrient(product.nutriments?.salt_100g)}
            </Text>
          </View>
          <View style={styles.nutritionItem}>
            <Text style={styles.nutritionLabel}>Fibre</Text>
            <Text style={styles.nutritionValue}>
              {formatNutrient(product.nutriments?.fiber_100g)}
            </Text>
          </View>
        </View>
      </View>

      {/* Punteggi e valutazioni */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Punteggi</Text>
        <View style={styles.scoresContainer}>
          {product.nutriscore_grade && (
            <View style={styles.scoreItem}>
              <Text style={styles.scoreLabel}>Nutri-Score</Text>
              <Text
                style={[
                  styles.scoreValue,
                  { color: getNutriScoreColor(product.nutriscore_grade) },
                ]}
              >
                {product.nutriscore_grade.toUpperCase()}
              </Text>
            </View>
          )}
          {product.nova_group && (
            <View style={styles.scoreItem}>
              <Text style={styles.scoreLabel}>NOVA Group</Text>
              <Text style={styles.scoreValue}>{product.nova_group}</Text>
            </View>
          )}
          {product.ecoscore_grade && (
            <View style={styles.scoreItem}>
              <Text style={styles.scoreLabel}>Eco-Score</Text>
              <Text
                style={[
                  styles.scoreValue,
                  { color: getNutriScoreColor(product.ecoscore_grade) },
                ]}
              >
                {product.ecoscore_grade.toUpperCase()}
              </Text>
            </View>
          )}
        </View>
      </View>

      {/* Categorie */}
      {product.categories && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Categorie</Text>
          <Text style={styles.categories}>{product.categories}</Text>
        </View>
      )}

      {/* Ingredienti */}
      {product.ingredients_text && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Ingredienti</Text>
          <Text style={styles.ingredients}>{product.ingredients_text}</Text>
        </View>
      )}

      {/* Allergeni */}
      {product.allergens && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Allergeni</Text>
          <Text style={styles.allergens}>{product.allergens}</Text>
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8f8f8",
  },
  centered: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f8f8f8",
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: "#666",
  },
  errorText: {
    fontSize: 16,
    color: "#e53935",
    textAlign: "center",
    marginHorizontal: 20,
  },
  header: {
    backgroundColor: "white",
    padding: 16,
    flexDirection: "row",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  productImage: {
    width: 100,
    height: 100,
    borderRadius: 8,
    marginRight: 16,
  },
  headerInfo: {
    flex: 1,
    justifyContent: "center",
  },
  productName: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 8,
    color: "#333",
  },
  brands: {
    fontSize: 16,
    color: "#666",
    marginBottom: 4,
  },
  quantity: {
    fontSize: 14,
    color: "#999",
  },
  section: {
    backgroundColor: "white",
    margin: 12,
    padding: 16,
    borderRadius: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 12,
    color: "#333",
  },
  nutritionGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  nutritionItem: {
    width: "48%",
    marginBottom: 12,
    padding: 8,
    backgroundColor: "#f5f5f5",
    borderRadius: 4,
  },
  nutritionLabel: {
    fontSize: 12,
    color: "#666",
    marginBottom: 4,
  },
  nutritionValue: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
  },
  scoresContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
  },
  scoreItem: {
    alignItems: "center",
    padding: 12,
    backgroundColor: "#f5f5f5",
    borderRadius: 8,
    minWidth: 80,
  },
  scoreLabel: {
    fontSize: 12,
    color: "#666",
    marginBottom: 4,
    textAlign: "center",
  },
  scoreValue: {
    fontSize: 24,
    fontWeight: "bold",
  },
  categories: {
    fontSize: 14,
    color: "#666",
    lineHeight: 20,
  },
  ingredients: {
    fontSize: 14,
    color: "#333",
    lineHeight: 20,
  },
  allergens: {
    fontSize: 14,
    color: "#e53935",
    lineHeight: 20,
    fontWeight: "500",
  },
});
