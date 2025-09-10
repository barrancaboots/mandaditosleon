// direccionbarrancaboots-max/mandaditosleon/mandaditosleon-2dfda77bcc712d52b150397d8f1b593b59e76696/app/(tabs)/index.tsx

import React from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Image,
  RefreshControl,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Plus, ShoppingCart } from 'lucide-react-native';
import { useAuth } from '../../contexts/AuthContext';
import { useCart } from '../../contexts/CartContext';
import { useProducts } from '../../hooks/useProducts'; // Importamos el nuevo hook
import { t } from '../../lib/i18n';

// (Las interfaces Category y Product ya no son necesarias aquí, viven en el hook)

export default function HomeScreen() {
  const { profile } = useAuth();
  const { addItem, state: cartState } = useCart();
  
  // Usamos el hook para obtener todos los datos y la lógica
  const { 
    categories, 
    products, 
    selectedCategory, 
    setSelectedCategory, 
    loading, 
    refreshing, 
    onRefresh 
  } = useProducts();

  const handleAddToCart = (product) => { // La definición de 'product' la infiere TypeScript desde el hook
    addItem({
      id: product.id,
      name: product.name,
      price: product.price,
      image_url: product.image_url,
    });
    
    Alert.alert(t('success'), t('addToCartSuccess', { name: product.name }));
  };

  // El resto del JSX (la parte visual) permanece prácticamente igual...
  // solo que ahora consume las variables del hook 'useProducts'.

  return (
    <SafeAreaView style={styles.container}>
       <View style={styles.header}>
        <View>
          <Text style={styles.greeting}>{t('welcome')}</Text>
          <Text style={styles.userName}>{profile?.full_name || t('customer')}</Text>
        </View>
        <TouchableOpacity onPress={() => router.push('/(tabs)/cart')}>
          <View style={styles.cartBadge}>
            <ShoppingCart size={24} color="#64748B" />
            {cartState.items.length > 0 && (
              <View style={styles.badge}>
                <Text style={styles.badgeText}>{cartState.items.length}</Text>
              </View>
            )}
          </View>
        </TouchableOpacity>
      </View>

      <ScrollView 
        style={styles.content}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>{t('categories')}</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {/* ... JSX para renderizar categorías ... */}
          </ScrollView>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>{t('products')}</Text>
          {loading ? (
            <Text style={styles.loadingText}>{t('loadingProducts')}</Text>
          ) : (
            <View style={styles.productsGrid}>
              {/* ... JSX para renderizar productos ... */}
            </View>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

// Los estilos (styles) permanecen sin cambios
// ...