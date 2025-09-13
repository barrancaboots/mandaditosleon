import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ArrowLeft } from 'lucide-react-native';
import { router } from 'expo-router';
import { useAuth } from '@/contexts/AuthContext';
import { useCart } from '@/contexts/CartContext';
import { supabase } from '@/lib/supabase';
import { t } from '@/lib/i18n';

export default function CheckoutScreen() {
  const { user } = useAuth();
  const { state, clearCart } = useCart();
  const [deliveryAddress, setDeliveryAddress] = useState('');
  const [deliveryNotes, setDeliveryNotes] = useState('');
  const [loading, setLoading] = useState(false);

  const handlePlaceOrder = async () => {
    if (!deliveryAddress.trim()) {
      Alert.alert(t('error'), t('addressRequired'));
      return;
    }

    if (!user) {
      Alert.alert(t('error'), t('loginRequired'));
      router.push('/(auth)/login');
      return;
    }

    setLoading(true);
    
    try {
      const { data: order, error: orderError } = await supabase
        .from('orders')
        .insert({
          client_id: user.id,
          price: state.total,
          delivery_address: deliveryAddress.trim(),
          description: deliveryNotes.trim() || '',
          // Valores requeridos por la BD que no están en el formulario
          pickup_address: 'Origen del pedido', // Puedes cambiar esto
          pickup_lat: 0,
          pickup_lng: 0,
          delivery_lat: 0,
          delivery_lng: 0,
        })
        .select()
        .single();

      if (orderError) throw orderError;

      const orderItems = state.items.map(item => ({
        order_id: order.id,
        product_id: item.id,
        quantity: item.quantity,
        price: item.price,
      }));

      const { error: itemsError } = await supabase
        .from('order_items')
        .insert(orderItems);

      if (itemsError) throw itemsError;

      clearCart();
      
      Alert.alert(
        t('orderPlacedSuccess'),
        t('orderPlacedSubtitle'),
        [
          { text: t('ok'), onPress: () => router.replace('/(tabs)/orders') }
        ]
      );
    } catch (error: any) {
      Alert.alert(t('error'), error.message || t('orderFailed'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <ArrowLeft size={24} color="#1A1A1A" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Finalizar Compra</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Resumen de tu Pedido</Text>
          {state.items.map((item) => (
            <View key={item.id} style={styles.orderItem}>
              <Text style={styles.itemName}>{item.quantity}x {item.name}</Text>
              <Text style={styles.itemTotal}>
                ${(item.price * item.quantity).toFixed(2)}
              </Text>
            </View>
          ))}
          <View style={styles.totalContainer}>
            <Text style={styles.totalLabel}>Total</Text>
            <Text style={styles.totalAmount}>${state.total.toFixed(2)}</Text>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Información de Entrega</Text>
          
          <Text style={styles.inputLabel}>Dirección de Entrega</Text>
          <TextInput
            style={styles.textInput}
            placeholder="Escribe tu dirección completa..."
            value={deliveryAddress}
            onChangeText={setDeliveryAddress}
            multiline
          />

          <Text style={styles.inputLabel}>Notas Adicionales (Opcional)</Text>
          <TextInput
            style={styles.textInput}
            placeholder="Ej: tocar el timbre, dejar en recepción..."
            value={deliveryNotes}
            onChangeText={setDeliveryNotes}
            multiline
          />
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <TouchableOpacity
          style={[styles.placeOrderButton, loading && styles.buttonDisabled]}
          onPress={handlePlaceOrder}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#1A1A1A" />
          ) : (
            <Text style={styles.placeOrderText}>
              Confirmar Pedido - ${state.total.toFixed(2)}
            </Text>
          )}
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F7F7F7' },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 20, paddingVertical: 15, backgroundColor: '#FFFFFF' },
  backButton: { padding: 5 },
  headerTitle: { fontFamily: 'Poppins_600SemiBold', fontSize: 18, color: '#1A1A1A' },
  content: { paddingHorizontal: 20, paddingBottom: 120 },
  section: { backgroundColor: '#FFFFFF', borderRadius: 15, padding: 20, marginTop: 20 },
  sectionTitle: { fontFamily: 'Poppins_600SemiBold', fontSize: 16, color: '#1A1A1A', marginBottom: 15 },
  orderItem: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 8 },
  itemName: { fontFamily: 'Poppins_400Regular', fontSize: 14, color: '#6B7280', flex: 1 },
  itemTotal: { fontFamily: 'Poppins_600SemiBold', fontSize: 14, color: '#1A1A1A' },
  totalContainer: { flexDirection: 'row', justifyContent: 'space-between', paddingTop: 15, marginTop: 10, borderTopWidth: 1, borderTopColor: '#F0F0F0' },
  totalLabel: { fontFamily: 'Poppins_700Bold', fontSize: 18, color: '#1A1A1A' },
  totalAmount: { fontFamily: 'Poppins_700Bold', fontSize: 18, color: '#1A1A1A' },
  inputLabel: { fontFamily: 'Poppins_600SemiBold', fontSize: 14, color: '#1A1A1A', marginBottom: 8, marginTop: 10 },
  textInput: { backgroundColor: '#F7F7F7', borderRadius: 10, paddingHorizontal: 15, paddingVertical: 12, fontSize: 14, fontFamily: 'Poppins_400Regular', color: '#1A1A1A', textAlignVertical: 'top', minHeight: 80 },
  footer: { position: 'absolute', bottom: 0, left: 0, right: 0, backgroundColor: '#FFFFFF', padding: 20, paddingBottom: 30, borderTopLeftRadius: 20, borderTopRightRadius: 20 },
  placeOrderButton: { backgroundColor: '#FFC107', borderRadius: 15, paddingVertical: 15, alignItems: 'center' },
  buttonDisabled: { opacity: 0.6 },
  placeOrderText: { fontFamily: 'Poppins_600SemiBold', fontSize: 18, color: '#1A1A1A' },
});