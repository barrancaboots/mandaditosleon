import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  RefreshControl,
  FlatList,
  ActivityIndicator
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Clock, CheckCircle, Truck, Package, ShoppingBag } from 'lucide-react-native';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/lib/supabase';
import { t } from '@/lib/i18n';
import { useFocusEffect } from 'expo-router';
import { Database } from '@/types/database';

// Definimos un tipo más completo para nuestras órdenes, incluyendo los productos anidados
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
      // La consulta ahora trae los nombres de los productos dentro de order_items
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
  
  // Usamos useFocusEffect para que la lista se actualice cada vez que el usuario entra a la pestaña
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
  
  const getStatusText = (status: Order['status']) => t(`orderStatus.${status}` as any);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pendiente': return <Clock size={20} color="#F59E0B" />;
      case 'aceptado': return <CheckCircle size={20} color="#059669" />;
      case 'en_camino': return <Truck size={20} color="#2563EB" />;
      case 'entregado': return <Package size={20} color="#059669" />;
      default: return <Clock size={20} color="#64748B" />;
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('es-MX', {
      month: 'short', day: 'numeric', year: 'numeric',
      hour: '2-digit', minute: '2-digit',
    });
  };

  // Componente para renderizar cada tarjeta de pedido
  const renderOrderCard = ({ item }: { item: Order }) => (
    <View style={styles.orderCard}>
      <View style={styles.orderHeader}>
        <View style={styles.statusContainer}>
          {getStatusIcon(item.status)}
          <Text style={styles.status}>{getStatusText(item.status)}</Text>
        </View>
        <Text style={styles.orderDate}>
          {item.created_at ? formatDate(item.created_at) : ''}
        </Text>
      </View>
      <View style={styles.orderBody}>
        <Text style={styles.orderTotal}>${item.price.toFixed(2)}</Text>
        <Text style={styles.orderAddress} numberOfLines={1}>{item.delivery_address}</Text>
        
        {/* Lista de productos en el pedido */}
        <View style={styles.orderItems}>
            {item.order_items.slice(0, 2).map((orderItem) => (
                <Text key={orderItem.id} style={styles.orderItemText}>
                    {orderItem.quantity}x {orderItem.products?.name || 'Producto no disponible'}
                </Text>
            ))}
            {item.order_items.length > 2 && (
                <Text style={styles.moreItemsText}>
                    +{item.order_items.length - 2} más...
                </Text>
            )}
        </View>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Mis Pedidos</Text>
      </View>
      
      {loading ? (
        <ActivityIndicator style={{ marginTop: 50 }} size="large" color="#FFC107" />
      ) : orders.length === 0 ? (
        <View style={styles.emptyContainer}>
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

// Estilos rediseñados para la pantalla de "Mis Pedidos"
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F7F7F7',
    },
    header: {
        padding: 20,
        backgroundColor: '#FFFFFF',
        alignItems: 'center',
        borderBottomWidth: 1,
        borderBottomColor: '#F0F0F0',
    },
    headerTitle: {
        fontFamily: 'Poppins_600SemiBold',
        fontSize: 18,
        color: '#1A1A1A',
    },
    orderCard: {
        backgroundColor: '#FFFFFF',
        borderRadius: 15,
        padding: 15,
        marginBottom: 15,
    },
    orderHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingBottom: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#F0F0F0',
    },
    statusContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    status: {
        fontFamily: 'Poppins_600SemiBold',
        fontSize: 14,
        color: '#1A1A1A',
        marginLeft: 8,
        textTransform: 'capitalize',
    },
    orderDate: {
        fontFamily: 'Poppins_400Regular',
        fontSize: 12,
        color: '#6B7280',
    },
    orderBody: {
        paddingTop: 15,
    },
    orderTotal: {
        fontFamily: 'Poppins_700Bold',
        fontSize: 22,
        color: '#1A1A1A',
        marginBottom: 5,
    },
    orderAddress: {
        fontFamily: 'Poppins_400Regular',
        fontSize: 14,
        color: '#6B7280',
        marginBottom: 10,
    },
    orderItems: {
        marginTop: 5,
    },
    orderItemText: {
        fontFamily: 'Poppins_400Regular',
        fontSize: 14,
        color: '#1A1A1A',
    },
    moreItemsText: {
        fontFamily: 'Poppins_400Regular',
        fontSize: 14,
        color: '#6B7280',
        marginTop: 5,
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
});