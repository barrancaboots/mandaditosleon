import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, ActivityIndicator } from 'react-native';
import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as Location from 'expo-location';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/lib/supabase';
import { Database } from '@/types/database';
import { Package, AlertTriangle } from 'lucide-react-native';
import Logo from '@/components/Logo';

type Order = Database['public']['Tables']['orders']['Row'];

export default function TrackOrderScreen() {
  const { user } = useAuth();
  const [order, setOrder] = useState<Order | null>(null);
  const [userLocation, setUserLocation] = useState<{ latitude: number; longitude: number } | null>(null);
  const [locationPermission, setLocationPermission] = useState(true);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const setupScreen = async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setLocationPermission(false);
        setLoading(false);
        return;
      }

      setLocationPermission(true);
      let location = await Location.getCurrentPositionAsync({});
      setUserLocation(location.coords);

      if (user) {
        const { data } = await supabase
          .from('orders')
          .select('*')
          .eq('client_id', user.id)
          .in('status', ['aceptado', 'en_camino'])
          .limit(1)
          .single();
        if (data) setOrder(data);
      }
      setLoading(false);
    };

    setupScreen();
  }, [user]);
  
  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.centered}><ActivityIndicator size="large" color="#FFC107" /></View>
      </SafeAreaView>
    );
  }

  // Si hay un pedido activo, se mostraría la lógica de seguimiento (pendiente)
  if (order) {
    return (
        <SafeAreaView style={styles.container} edges={['top']}>
            <View style={styles.header}><Text style={styles.headerTitle}>Tu repartidor está en camino</Text></View>
            {/* Aquí iría el mapa de seguimiento del repartidor */}
        </SafeAreaView>
    );
  }

  // Si no hay pedido, muestra la ubicación del cliente
  return (
    <SafeAreaView style={styles.container} edges={['top']}>
        <View style={styles.header}><Text style={styles.headerTitle}>Tu Ubicación Actual</Text></View>
        {!locationPermission ? (
            <View style={styles.centered}>
                <AlertTriangle size={80} color="#E5E7EB" />
                <Text style={styles.infoText}>Se necesita permiso de ubicación.</Text>
            </View>
        ) : userLocation ? (
            <MapView
                provider={PROVIDER_GOOGLE}
                style={styles.map}
                initialRegion={{
                    latitude: userLocation.latitude,
                    longitude: userLocation.longitude,
                    latitudeDelta: 0.01,
                    longitudeDelta: 0.01,
                }}
            >
                <Marker coordinate={userLocation} title="Estás aquí">
                    <Logo width={40} height={40} />
                </Marker>
            </MapView>
        ) : (
            <View style={styles.centered}><ActivityIndicator size="large" color="#FFC107" /></View>
        )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#F7F7F7' },
    header: { padding: 20, backgroundColor: '#FFFFFF', alignItems: 'center', borderBottomWidth: 1, borderBottomColor: '#F0F0F0' },
    headerTitle: { fontFamily: 'Poppins_600SemiBold', fontSize: 18, color: '#1A1A1A' },
    map: { flex: 1 },
    centered: { flex: 1, justifyContent: 'center', alignItems: 'center', paddingHorizontal: 20 },
    infoText: { fontFamily: 'Poppins_400Regular', fontSize: 16, color: '#6B7280', marginTop: 20, textAlign: 'center' }
});