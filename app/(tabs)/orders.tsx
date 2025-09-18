import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  RefreshControl,
  FlatList,
  ActivityIndicator,
  TouchableOpacity,
  Alert
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Clock, CheckCircle, Truck, Package, ShoppingBag, XCircle } from 'lucide-react-native';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/lib/supabase';
import { t } from '@/lib/i18n';
import { useFocusEffect } from 'expo-router';
import { Database } from '@/types/database';

// Derivamos el tipo Order para que sea 100% consistente con la base de datos
type Order = Database['public']['Tables']['orders']['Row'] & {
    order_items: ({
        products: { name: string } | null
    } & Database['public']['Tables']['order_items']['Row'])[]
};

export default function OrdersScreen() {
  const { user } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchOrders = async () => {
    if (!user) {
      setLoading(false);
      return;
    };
    try {
      // Usamos 'client_id' para que coincida con la base de datos
      const { data, error } = await supabase
        .from('orders')
        .select(`*, order_items(*, products(name))`)
        .eq('client_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      if (data) {
        setOrders(data as Order[]);
      }
    } catch (error) {
      console.error('Error fetching orders:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };
  
  // useFocusEffect recarga los datos cada vez que se entra a la pantalla
  useFocusEffect(
    useCallback(() => {
      setLoading(true);
      fetchOrders();
    }, [user])
  );

  const onRefresh = () => {
    setRefreshing(true);
    fetchOrders();
  };

  const handleCancelOrder = async (orderId: number) => {
    Alert.alert(
      "Confirmar Cancelación",
      "¿Estás seguro de que quieres cancelar este pedido?",
      [
        { text: "No", style: "cancel" },
        {
          text: "Sí, Cancelar",
          style: "destructive",
          onPress: async () => {
            const { error } = await supabase
              .from('orders')
              .update({ status: 'cancelado' })
              .eq('id', orderId);

            if (error) {
              Alert.alert("Error", "No se pudo cancelar el pedido.");
            } else {
              fetchOrders(); // Actualiza la lista para reflejar el cambio
            }
          },
        },
      ]
    );
  };
  
  const getStatusText = (status: Order['status']) => t(`orderStatus.${status.replace('buscando_repartidor', 'confirmed')}` as any);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pendiente': return <Clock size={20} color="#F59E0B" />;
      case 'aceptado':
      case 'buscando_repartidor': 
        return <CheckCircle size={20} color="#059669" />;
      case 'en_camino': return <Truck size={20} color="#2563EB" />;
      case 'entregado': return <Package size={20} color="#059669" />;
      case 'cancelado': return <XCircle size={20} color="#EF4444" />;
      default: return <Clock size={20} color="#64748B" />;
    }
  };

  const renderOrderCard = ({ item }: { item: Order }) => (
    <View style={styles.orderCard}>
      <View style={styles.orderHeader}>
        <View style={styles.statusContainer}>
          {getStatusIcon(item.status)}
          <Text style={styles.status}>{getStatusText(item.status)}</Text>
        </View>
        <Text style={styles.orderDate}>
          {item.created_at ? new Date(item.created_at).toLocaleDateString('es-MX', { day: 'numeric', month: 'short' }) : ''}
        </Text>
      </View>
      <View style={styles.orderBody}>
        {/* Usamos 'price' que es el nombre correcto en la BD */}
        <Text style={styles.orderTotal}>${item.price.toFixed(2)}</Text>
        <Text style={styles.orderAddress} numberOfLines={1}>{item.delivery_address}</Text>
        
        <View style={styles.orderItems}>
            {item.order_items.slice(0, 2).map((orderItem) => (
                <Text key={orderItem.id} style={styles.orderItemText}>
                    {orderItem.quantity}x {orderItem.products?.name || 'Producto'}
                </Text>
            ))}
            {item.order_items.length > 2 && (
                <Text style={styles.moreItemsText}>
                    +{item.order_items.length - 2} más...
                </Text>
            )}
        </View>
        
        {item.status === 'pendiente' && (
            <TouchableOpacity
                style={styles.cancelButton}
                onPress={() => handleCancelOrder(item.id)}
            >
                <Text style={styles.cancelButtonText}>Cancelar Pedido</Text>
            </TouchableOpacity>
        )}
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Mis Pedidos</Text>
      </View>
      
      {loading ? (
        <View style={styles.centered}><ActivityIndicator size="large" color="#FFC107" /></View>
      ) : orders.length === 0 ? (
        <View style={styles.centered}>
            <ShoppingBag size={80} color="#E5E7EB" />
            <Text style={styles.emptyTitle}>No tienes pedidos</Text>
            <Text style={styles.emptySubtitle}>Cuando hagas tu primera compra, aparecerá aquí.</Text>
        </View>
      ) : (
        <FlatList
            data={orders}
            renderItem={renderOrderCard}
            keyExtractor={(item) => item.id.toString()}
            contentContainerStyle={{ padding: 20 }}
            refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#F7F7F7' },
    centered: { flex: 1, justifyContent: 'center', alignItems: 'center' },
    header: { padding: 20, backgroundColor: '#FFFFFF', alignItems: 'center', borderBottomWidth: 1, borderBottomColor: '#F0F0F0' },
    headerTitle: { fontFamily: 'Poppins_600SemiBold', fontSize: 18, color: '#1A1A1A' },
    orderCard: { backgroundColor: '#FFFFFF', borderRadius: 15, padding: 15, marginBottom: 15 },
    orderHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingBottom: 10, borderBottomWidth: 1, borderBottomColor: '#F0F0F0' },
    statusContainer: { flexDirection: 'row', alignItems: 'center' },
    status: { fontFamily: 'Poppins_600SemiBold', fontSize: 14, color: '#1A1A1A', marginLeft: 8, textTransform: 'capitalize' },
    orderDate: { fontFamily: 'Poppins_400Regular', fontSize: 12, color: '#6B7280' },
    orderBody: { paddingTop: 15 },
    orderTotal: { fontFamily: 'Poppins_700Bold', fontSize: 22, color: '#1A1A1A', marginBottom: 5 },
    orderAddress: { fontFamily: 'Poppins_400Regular', fontSize: 14, color: '#6B7280', marginBottom: 10 },
    orderItems: { marginTop: 5 },
    orderItemText: { fontFamily: 'Poppins_400Regular', fontSize: 14, color: '#1A1A1A' },
    moreItemsText: { fontFamily: 'Poppins_400Regular', fontSize: 14, color: '#6B7280', marginTop: 5 },
    emptyTitle: { fontFamily: 'Poppins_700Bold', fontSize: 22, color: '#1A1A1A', marginTop: 20 },
    emptySubtitle: { fontFamily: 'Poppins_400Regular', fontSize: 16, color: '#6B7280', textAlign: 'center', marginTop: 10, },
    cancelButton: { marginTop: 15, paddingVertical: 10, borderRadius: 10, backgroundColor: '#FEE2E2', alignItems: 'center' },
    cancelButtonText: { color: '#EF4444', fontFamily: 'Poppins_600SemiBold' },
});