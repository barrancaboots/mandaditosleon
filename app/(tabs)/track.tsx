import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, ActivityIndicator } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/lib/supabase';
import { Database } from '@/types/database';
import { MapPin, Package } from 'lucide-react-native';

type Profile = Database['public']['Tables']['profiles']['Row'];
type Order = Database['public']['Tables']['orders']['Row'];

export default function TrackOrderScreen() {
  const { user } = useAuth();
  const [order, setOrder] = useState<Order | null>(null);
  const [driverLocation, setDriverLocation] = useState<{ latitude: number; longitude: number } | null>(null);
  const [loading, setLoading] = useState(true);
  const mapRef = useRef<MapView>(null);

  useEffect(() => {
    // 1. Buscar si el usuario tiene un pedido activo para rastrear
    const findActiveOrder = async () => {
      if (!user) return;

      const { data, error } = await supabase
        .from('orders')
        .select('*')
        .eq('client_id', user.id)
        .in('status', ['aceptado', 'en_camino']) // Buscamos pedidos aceptados o en camino
        .order('created_at', { ascending: false })
        .limit(1)
        .single();

      if (data) {
        setOrder(data);
      } else {
        setLoading(false);
      }

      if (error) {
        console.error("Error buscando pedido activo:", error);
        setLoading(false);
      }
    };

    findActiveOrder();
  }, [user]);

  useEffect(() => {
    if (!order || !order.driver_id) {
      if(order) setLoading(false);
      return;
    };

    // 2. Suscribirse a los cambios de ubicación del repartidor en tiempo real
    const channel = supabase
      .channel(`driver-location-${order.driver_id}`)
      .on<Profile>(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'profiles',
          filter: `id=eq.${order.driver_id}`,
        },
        (payload) => {
          const { current_lat, current_lng } = payload.new;
          if (current_lat && current_lng) {
            const newLocation = { latitude: current_lat, longitude: current_lng };
            setDriverLocation(newLocation);
            // Centra el mapa en la nueva ubicación del repartidor
            mapRef.current?.animateToRegion({ ...newLocation, latitudeDelta: 0.01, longitudeDelta: 0.01 });
          }
        }
      )
      .subscribe();
      
      setLoading(false);

    // Limpiar la suscripción al desmontar el componente
    return () => {
      supabase.removeChannel(channel);
    };
  }, [order]);
  
  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
         <View style={styles.header}>
            <Text style={styles.headerTitle}>Seguimiento de Pedido</Text>
        </View>
        <View style={styles.centered}>
            <ActivityIndicator size="large" color="#FFC107" />
            <Text style={styles.infoText}>Buscando tu pedido...</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (!order) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
            <Text style={styles.headerTitle}>Seguimiento de Pedido</Text>
        </View>
        <View style={styles.centered}>
          <Package size={80} color="#E5E7EB" />
          <Text style={styles.infoText}>No tienes pedidos en camino.</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
        <View style={styles.header}>
            <Text style={styles.headerTitle}>Tu repartidor está en camino</Text>
        </View>
        <MapView
            ref={mapRef}
            style={styles.map}
            initialRegion={{
                latitude: order.delivery_lat || 21.1290, // Latitud de León como fallback
                longitude: order.delivery_lng || -101.6853, // Longitud de León como fallback
                latitudeDelta: 0.0922,
                longitudeDelta: 0.0421,
            }}
        >
            {/* Marcador para la dirección de entrega */}
            {order.delivery_lat && order.delivery_lng && (
                <Marker
                    coordinate={{ latitude: order.delivery_lat, longitude: order.delivery_lng }}
                    title="Tu Ubicación"
                    pinColor="#059669"
                />
            )}
            {/* Marcador para el repartidor (se actualiza en tiempo real) */}
            {driverLocation && (
                <Marker
                    coordinate={driverLocation}
                    title="Repartidor"
                >
                    <MapPin size={32} color="#FFC107" />
                </Marker>
            )}
        </MapView>
    </SafeAreaView>
  );
}

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
    map: {
        flex: 1,
    },
    centered: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    infoText: {
        fontFamily: 'Poppins_500Medium',
        fontSize: 16,
        color: '#6B7280',
        marginTop: 20,
    }
});