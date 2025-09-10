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

// ... (Las interfaces Category y Product permanecen igual)

export default function HomeScreen() {
  // ... (La lógica del componente permanece igual)

  const handleAddToCart = (product: Product) => {
    addItem({
      id: product.id,
      name: product.name,
      price: product.price,
      image_url: product.image_url,
    });
    
    Alert.alert('Éxito', `${product.name} agregado al carrito!`);
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <View>
          <Text style={styles.greeting}>Bienvenido de vuelta</Text>
          <Text style={styles.userName}>{profile?.full_name || 'Cliente'}</Text>
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
        {/* Categories */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Categorías</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {/* ... */}
          </ScrollView>
        </View>

        {/* Products */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Productos</Text>
          {loading ? (
            <Text style={styles.loadingText}>Cargando productos...</Text>
          ) : (
            <View style={styles.productsGrid}>
              {/* ... */}
            </View>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

// Los estilos (styles) permanecen sin cambios
// ...