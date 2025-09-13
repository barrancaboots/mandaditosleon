import React, { useState, useEffect } from 'react';
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
import { supabase } from '../../lib/supabase';
import { t } from '../../lib/i18n';

// Las interfaces no cambian
interface Category {
  id: string;
  name: string;
  description: string | null;
  image_url: string | null;
}

interface Product {
  id: string;
  name: string;
  description: string | null;
  price: number;
  image_url: string | null;
  category_id: string;
}

export default function HomeScreen() {
  const { profile } = useAuth();
  const { addItem, state } = useCart();
  const [categories, setCategories] = useState<Category[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    fetchCategories();
  }, []);

  useEffect(() => {
    if (selectedCategory) {
      fetchProducts(selectedCategory);
    }
  }, [selectedCategory]);

 // En app/(tabs)/cart.tsx

const fetchCategories = async () => {
  try {
    const { data, error } = await supabase
      .from('categories')
      .select('*')
        .order('name');

    if (error) throw error;
    setCategories(data || []);
    
    if (data && data.length > 0 && !selectedCategory) {
      setSelectedCategory(data[0].id);
    }
  } catch (error) {
    console.error('Error fetching categories:', error);
  }
};
  const fetchProducts = async (categoryId: string) => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('category_id', categoryId)
        .eq('is_available', true)
        .order('name');

      if (error) throw error;
      setProducts(data || []);
    } catch (error) {
      console.error('Error fetching products:', error);
    } finally {
      setLoading(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchCategories();
    if (selectedCategory) {
      await fetchProducts(selectedCategory);
    }
    setRefreshing(false);
  };

  const handleAddToCart = (product: Product) => {
    addItem({
      id: product.id,
      name: product.name,
      price: product.price,
      image_url: product.image_url,
    });
    
    Alert.alert(t('success'), t('addToCartSuccess', { name: product.name }));
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <View>
          <Text style={styles.greeting}>{t('welcome')}</Text>
          <Text style={styles.userName}>{profile?.full_name || t('customer')}</Text>
        </View>
        <View style={styles.cartBadge}>
          <ShoppingCart size={24} color="#64748B" />
          {state.items.length > 0 && (
            <View style={styles.badge}>
              <Text style={styles.badgeText}>{state.items.length}</Text>
            </View>
          )}
        </View>
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
            <View style={styles.categoriesContainer}>
              {categories.map((category) => (
                <TouchableOpacity
                  key={category.id}
                  style={[
                    styles.categoryCard,
                    selectedCategory === category.id && styles.categoryCardActive,
                  ]}
                  onPress={() => setSelectedCategory(category.id)}
                >
                  {category.image_url && (
                    <Image source={{ uri: category.image_url }} style={styles.categoryImage} />
                  )}
                  <Text
                    style={[
                      styles.categoryName,
                      selectedCategory === category.id && styles.categoryNameActive,
                    ]}
                  >
                    {category.name}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </ScrollView>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>{t('products')}</Text>
          {loading ? (
            <Text style={styles.loadingText}>{t('loadingProducts')}</Text>
          ) : (
            <View style={styles.productsGrid}>
              {products.map((product) => (
                <View key={product.id} style={styles.productCard}>
                  {product.image_url && (
                    <Image source={{ uri: product.image_url }} style={styles.productImage} />
                  )}
                  <View style={styles.productInfo}>
                    <Text style={styles.productName}>{product.name}</Text>
                    {product.description && (
                      <Text style={styles.productDescription} numberOfLines={2}>
                        {product.description}
                      </Text>
                    )}
                    <View style={styles.productFooter}>
                      <Text style={styles.productPrice}>${product.price.toFixed(2)}</Text>
                      <TouchableOpacity
                        style={styles.addButton}
                        onPress={() => handleAddToCart(product)}
                      >
                        <Plus size={20} color="#FFFFFF" />
                      </TouchableOpacity>
                    </View>
                  </View>
                </View>
              ))}
            </View>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingBottom: 16,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
  },
  greeting: {
    fontSize: 14,
    color: '#64748B',
  },
  userName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1E293B',
  },
  cartBadge: {
    position: 'relative',
  },
  badge: {
    position: 'absolute',
    top: -8,
    right: -8,
    backgroundColor: '#EF4444',
    borderRadius: 10,
    minWidth: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  badgeText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: 'bold',
  },
  content: {
    flex: 1,
  },
  section: {
    marginTop: 24,
    paddingHorizontal: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1E293B',
    marginBottom: 16,
  },
  categoriesContainer: {
    flexDirection: 'row',
    gap: 12,
  },
  categoryCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    minWidth: 100,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  categoryCardActive: {
    backgroundColor: '#2563EB',
    borderColor: '#2563EB',
  },
  categoryImage: {
    width: 48,
    height: 48,
    borderRadius: 24,
    marginBottom: 8,
  },
  categoryName: {
    fontSize: 14,
    color: '#64748B',
    textAlign: 'center',
  },
  categoryNameActive: {
    color: '#FFFFFF',
  },
  loadingText: {
    textAlign: 'center',
    color: '#64748B',
    fontSize: 16,
    marginTop: 32,
  },
  productsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: 16,
  },
  productCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    overflow: 'hidden',
    width: '48%',
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  productImage: {
    width: '100%',
    height: 120,
    backgroundColor: '#F1F5F9',
  },
  productInfo: {
    padding: 12,
  },
  productName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1E293B',
    marginBottom: 4,
  },
  productDescription: {
    fontSize: 12,
    color: '#64748B',
    marginBottom: 8,
    lineHeight: 16,
  },
  productFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  productPrice: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#059669',
  },
  addButton: {
    backgroundColor: '#2563EB',
    borderRadius: 8,
    padding: 8,
  },
});