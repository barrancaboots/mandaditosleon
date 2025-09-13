import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  TextInput,
  ScrollView,
  FlatList,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { useAuth } from '@/contexts/AuthContext';
import { useCart } from '@/contexts/CartContext';
import { useProducts } from '@/hooks/useProducts';
import { Database } from '@/types/database';
import { Search, ShoppingCart as ShoppingCartIcon, Heart, Plus } from 'lucide-react-native';

type Product = Database['public']['Tables']['products']['Row'];
type Category = Database['public']['Tables']['categories']['Row'];

const ProductCard = ({ product, onAddToCart }: { product: Product, onAddToCart: (product: Product) => void }) => (
  <View style={styles.productCard}>
    <View style={styles.productImageContainer}>
      {product.image_base64 ? (
        <Image
          source={{ uri: `data:image/png;base64,${product.image_base64}` }}
          style={styles.productImage}
        />
      ) : (
        <View style={[styles.productImage, styles.placeholderImage]} />
      )}
      <TouchableOpacity style={styles.favoriteButton}>
        <Heart size={20} color="#6B7280" />
      </TouchableOpacity>
    </View>
    <Text style={styles.productName}>{product.name}</Text>
    <View style={styles.productFooter}>
      <Text style={styles.productPrice}>${product.price.toFixed(2)}</Text>
      <TouchableOpacity style={styles.addButton} onPress={() => onAddToCart(product)}>
        <Plus size={20} color="#1A1A1A" />
      </TouchableOpacity>
    </View>
  </View>
);

export default function HomeScreen() {
  const { profile } = useAuth();
  const { addItem, state: cartState } = useCart();
  const { categories, products, selectedCategory, setSelectedCategory } = useProducts();

  const handleAddToCart = (product: Product) => {
    addItem(product);
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScrollView stickyHeaderIndices={[1]}>
        <View style={styles.header}>
          <View>
            <Text style={styles.greeting}>Hola de nuevo,</Text>
            <Text style={styles.userName}>{profile?.full_name || 'Cliente'}</Text>
          </View>
          <TouchableOpacity onPress={() => router.push('/(tabs)/cart')} style={styles.cartButton}>
            <ShoppingCartIcon size={28} color="#1A1A1A" />
            {cartState.items.length > 0 && (
              <View style={styles.cartBadge}>
                <Text style={styles.cartBadgeText}>{cartState.items.length}</Text>
              </View>
            )}
          </TouchableOpacity>
        </View>
        
        <View style={styles.searchContainer}>
          <View style={styles.searchBar}>
            <Search size={22} color="#6B7280" />
            <TextInput
              placeholder="Buscar productos..."
              style={styles.searchInput}
            />
          </View>
        </View>
        
        <View>
          <Text style={styles.sectionTitle}>Categorías</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.categoriesScrollView}>
            {/* 👇 --- INICIO DE LA MODIFICACIÓN --- 👇 */}
            {categories.map((category) => (
              <TouchableOpacity
                key={category.id}
                style={styles.categoryContainer}
                onPress={() => setSelectedCategory(category.id)}
              >
                <View
                  style={[
                    styles.categoryIconContainer,
                    selectedCategory === category.id && styles.categoryIconContainerActive,
                  ]}
                >
                  {category.image_base64 && (
                    <Image
                      source={{ uri: `data:image/png;base64,${category.image_base64}` }}
                      style={styles.categoryIcon}
                    />
                  )}
                </View>
                <Text
                  style={[
                    styles.categoryText,
                    selectedCategory === category.id && styles.categoryTextActive,
                  ]}
                >
                  {category.name}
                </Text>
              </TouchableOpacity>
            ))}
            {/* ☝️ --- FIN DE LA MODIFICACIÓN --- ☝️ */}
          </ScrollView>
        </View>

        <View style={styles.productsSection}>
          <Text style={styles.sectionTitle}>Productos</Text>
          <FlatList
            data={products}
            renderItem={({ item }) => <ProductCard product={item} onAddToCart={handleAddToCart} />}
            keyExtractor={(item) => item.id.toString()}
            numColumns={2}
            scrollEnabled={false}
            columnWrapperStyle={{ justifyContent: 'space-between' }}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  // ... (otros estilos no cambian)
  container: {
    flex: 1,
    backgroundColor: '#F7F7F7',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 15,
  },
  greeting: {
    fontFamily: 'Poppins_400Regular',
    fontSize: 16,
    color: '#6B7280',
  },
  userName: {
    fontFamily: 'Poppins_700Bold',
    fontSize: 22,
    color: '#1A1A1A',
  },
  cartButton: {
    padding: 8,
  },
  cartBadge: {
    position: 'absolute',
    top: 0,
    right: 0,
    backgroundColor: '#FFC107',
    borderRadius: 10,
    width: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cartBadgeText: {
    color: '#1A1A1A',
    fontSize: 12,
    fontFamily: 'Poppins_600SemiBold',
  },
  searchContainer: {
    paddingHorizontal: 20,
    paddingBottom: 10,
    backgroundColor: '#F7F7F7',
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 15,
    paddingHorizontal: 15,
    height: 50,
  },
  searchInput: {
    flex: 1,
    marginLeft: 10,
    fontSize: 16,
    fontFamily: 'Poppins_400Regular',
  },
  sectionTitle: {
    fontFamily: 'Poppins_600SemiBold',
    fontSize: 18,
    color: '#1A1A1A',
    paddingHorizontal: 20,
    marginTop: 20,
    marginBottom: 15,
  },
  categoriesScrollView: {
    paddingLeft: 20, // Ajuste para que el primer ítem no se pegue al borde
  },
  // 👇 --- INICIO DE NUEVOS ESTILOS PARA CATEGORÍAS --- 👇
  categoryContainer: {
    alignItems: 'center',
    marginRight: 20,
    width: 70, // Ancho fijo para cada categoría
  },
  categoryIconContainer: {
    width: 60,
    height: 60,
    borderRadius: 30, // Círculo perfecto
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  categoryIconContainerActive: {
    backgroundColor: '#FFC107',
    borderColor: '#FFC107',
  },
  categoryIcon: {
    width: 32,
    height: 32,
    resizeMode: 'contain',
  },
  categoryText: {
    fontFamily: 'Poppins_400Regular',
    fontSize: 12,
    color: '#6B7280',
    textAlign: 'center',
  },
  categoryTextActive: {
    fontFamily: 'Poppins_600SemiBold',
    color: '#1A1A1A',
  },
  // ☝️ --- FIN DE NUEVOS ESTILOS PARA CATEGORÍAS --- ☝️
  productsSection: {
    paddingHorizontal: 20,
  },
  productCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 15,
    padding: 10,
    marginBottom: 20,
    width: '48%',
  },
  productImageContainer: {
    width: '100%',
    aspectRatio: 1,
    backgroundColor: '#F7F7F7',
    borderRadius: 10,
    marginBottom: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  productImage: {
    width: '80%',
    height: '80%',
    resizeMode: 'contain',
  },
  placeholderImage: {
    backgroundColor: '#E5E7EB',
  },
  favoriteButton: {
    position: 'absolute',
    top: 10,
    right: 10,
    backgroundColor: 'rgba(255, 255, 255, 0.7)',
    borderRadius: 15,
    padding: 5,
  },
  productName: {
    fontFamily: 'Poppins_600SemiBold',
    fontSize: 14,
    color: '#1A1A1A',
    marginBottom: 5,
  },
  productFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 5,
  },
  productPrice: {
    fontFamily: 'Poppins_700Bold',
    fontSize: 16,
    color: '#1A1A1A',
  },
  addButton: {
    backgroundColor: '#FFC107',
    borderRadius: 10,
    padding: 8,
  },
});