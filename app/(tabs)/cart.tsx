import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  FlatList,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { useCart } from '@/contexts/CartContext';
import { ArrowLeft, Plus, Minus, Trash2, ShoppingBag } from 'lucide-react-native';
import { Database } from '@/types/database';

type CartItem = Database['public']['Tables']['products']['Row'] & { quantity: number };

// Componente para cada fila de producto en el carrito
const CartListItem = ({ item, onUpdateQuantity, onRemoveItem }: { item: CartItem, onUpdateQuantity: (id: number, quantity: number) => void, onRemoveItem: (id: number) => void }) => (
  <View style={styles.cartItemContainer}>
    {item.image_base64 ? (
      <Image
        source={{ uri: `data:image/png;base64,${item.image_base64}` }}
        style={styles.cartItemImage}
      />
    ) : (
      <View style={[styles.cartItemImage, styles.placeholderImage]} />
    )}
    <View style={styles.cartItemDetails}>
      <Text style={styles.cartItemName} numberOfLines={1}>{item.name}</Text>
      <Text style={styles.cartItemPrice}>${item.price.toFixed(2)}</Text>
    </View>
    <View style={styles.quantityControl}>
      <TouchableOpacity onPress={() => onUpdateQuantity(item.id, item.quantity - 1)}>
        <Minus size={20} color="#1A1A1A" />
      </TouchableOpacity>
      <Text style={styles.quantityText}>{item.quantity}</Text>
      <TouchableOpacity onPress={() => onUpdateQuantity(item.id, item.quantity + 1)}>
        <Plus size={20} color="#1A1A1A" />
      </TouchableOpacity>
    </View>
    <TouchableOpacity onPress={() => onRemoveItem(item.id)} style={styles.removeButton}>
        <Trash2 size={20} color="#EF4444" />
    </TouchableOpacity>
  </View>
);

export default function CartScreen() {
  const { state, updateQuantity, removeItem } = useCart();

  // Caso para cuando el carrito está vacío
  if (!state.items || state.items.length === 0) {
    return (
      <SafeAreaView style={styles.container} edges={['top']}>
        <View style={styles.header}>
            <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
                <ArrowLeft size={24} color="#1A1A1A" />
            </TouchableOpacity>
            <Text style={styles.headerTitle}>Mi Carrito</Text>
            <View style={{ width: 24 }} />
        </View>
        <View style={styles.emptyContainer}>
          <ShoppingBag size={80} color="#E5E7EB" />
          <Text style={styles.emptyTitle}>Tu carrito está vacío</Text>
          <Text style={styles.emptySubtitle}>Añade productos para verlos aquí.</Text>
          <TouchableOpacity style={styles.emptyButton} onPress={() => router.replace('/(tabs)')}>
            <Text style={styles.emptyButtonText}>Ir a la tienda</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
            <ArrowLeft size={24} color="#1A1A1A" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Mi Carrito ({state.items.length})</Text>
        <View style={{ width: 24 }} />
      </View>

      <FlatList
        data={state.items}
        renderItem={({ item }) => (
          <CartListItem 
            item={item} 
            onUpdateQuantity={updateQuantity} 
            onRemoveItem={removeItem} 
          />
        )}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={{ paddingHorizontal: 20, paddingTop: 10 }}
      />

      {/* --- Resumen y Botón de Checkout --- */}
      <View style={styles.footer}>
        <View style={styles.summaryRow}>
          <Text style={styles.summaryText}>Subtotal</Text>
          <Text style={styles.summaryText}>${state.total.toFixed(2)}</Text>
        </View>
        <View style={styles.summaryRow}>
          <Text style={styles.summaryTotalText}>Total</Text>
          <Text style={styles.summaryTotalText}>${state.total.toFixed(2)}</Text>
        </View>
        <TouchableOpacity style={styles.checkoutButton} onPress={() => router.push('/checkout')}>
          <Text style={styles.checkoutButtonText}>Proceder al Pago</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F7F7F7',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 15,
    backgroundColor: '#FFFFFF',
  },
  backButton: {
    padding: 5,
  },
  headerTitle: {
    fontFamily: 'Poppins_600SemiBold',
    fontSize: 18,
    color: '#1A1A1A',
  },
  cartItemContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 15,
    padding: 10,
    marginBottom: 15,
  },
  cartItemImage: {
    width: 70,
    height: 70,
    borderRadius: 10,
    resizeMode: 'contain',
    backgroundColor: '#F7F7F7',
  },
  placeholderImage: {
      backgroundColor: '#E5E7EB',
  },
  cartItemDetails: {
    flex: 1,
    marginLeft: 15,
  },
  cartItemName: {
    fontFamily: 'Poppins_600SemiBold',
    fontSize: 16,
    color: '#1A1A1A',
  },
  cartItemPrice: {
    fontFamily: 'Poppins_400Regular',
    fontSize: 14,
    color: '#6B7280',
    marginTop: 4,
  },
  quantityControl: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F7F7F7',
    borderRadius: 10,
    padding: 5,
  },
  quantityText: {
    fontFamily: 'Poppins_600SemiBold',
    fontSize: 16,
    marginHorizontal: 15,
  },
  removeButton: {
      marginLeft: 10,
      padding: 5,
  },
  footer: {
    backgroundColor: '#FFFFFF',
    padding: 20,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  summaryText: {
    fontFamily: 'Poppins_400Regular',
    fontSize: 16,
    color: '#6B7280',
  },
  summaryTotalText: {
    fontFamily: 'Poppins_700Bold',
    fontSize: 18,
    color: '#1A1A1A',
  },
  checkoutButton: {
    backgroundColor: '#FFC107',
    borderRadius: 15,
    paddingVertical: 15,
    alignItems: 'center',
    marginTop: 10,
  },
  checkoutButtonText: {
    fontFamily: 'Poppins_600SemiBold',
    fontSize: 18,
    color: '#1A1A1A',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  emptyTitle: {
    fontFamily: 'Poppins_700Bold',
    fontSize: 22,
    color: '#1A1A1A',
    marginTop: 20,
  },
  emptySubtitle: {
    fontFamily: 'Poppins_400Regular',
    fontSize: 16,
    color: '#6B7280',
    textAlign: 'center',
    marginTop: 10,
  },
  emptyButton: {
      backgroundColor: '#FFC107',
      borderRadius: 15,
      paddingVertical: 15,
      paddingHorizontal: 40,
      marginTop: 30,
  },
  emptyButtonText: {
      fontFamily: 'Poppins_600SemiBold',
    fontSize: 16,
    color: '#1A1A1A',
  },
});
