// app/(tabs)/track.tsx

import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, Image, ActivityIndicator } from 'react-native';
import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps';
import * as Location from 'expo-location';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/lib/supabase';
import { Database } from '@/types/database';

// Definimos un tipo para la ubicación para mayor claridad
type LocationCoords = {
  latitude: number;
  longitude: number;
};

const TrackOrderScreen = () => {
  const { session } = useAuth();
  // Estado para el pedido más reciente del usuario
  const [order, setOrder] = useState<Database['public']['Tables']['orders']['Row'] | null>(null);
  // Estado para la ubicación del cliente
  const [userLocation, setUserLocation] = useState<LocationCoords | null>(null);
  // Estado para manejar la carga y los errores
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  useEffect(() => {
    // Función asíncrona para obtener la ubicación y el pedido
    const fetchData = async () => {
      if (!session?.user) {
        setLoading(false);
        return;
      }

      // --- 1. OBTENER UBICACIÓN DEL USUARIO ---
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setErrorMsg('El permiso para acceder a la ubicación fue denegado');
        setLoading(false);
        return;
      }

      try {
        let location = await Location.getCurrentPositionAsync({});
        const currentUserLocation = {
          latitude: location.coords.latitude,
          longitude: location.coords.longitude,
        };
        setUserLocation(currentUserLocation);

        // --- 2. OBTENER EL ÚLTIMO PEDIDO DEL USUARIO ---
        const { data: latestOrder, error } = await supabase
          .from('orders')
          .select('*')
          // --- CORRECCIÓN AQUÍ: Cambiamos 'user_id' por 'client_id' ---
          .eq('client_id', session.user.id) 
          .order('created_at', { ascending: false }) // Obtenemos el más reciente
          .limit(1)
          .single(); // Esperamos un solo resultado

        if (error && error.code !== 'PGRST116') { // Ignoramos el error si no hay pedidos
          throw error;
        }

        if (latestOrder) {
          setOrder(latestOrder);
        }

      } catch (e) {
        setErrorMsg('Error al obtener los datos. Inténtalo de nuevo.');
        console.error(e);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [session]);

  // Si está cargando, mostramos un indicador
  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#FF6347" />
        <Text>Cargando mapa...</Text>
      </View>
    );
  }

  // Si hubo un error de permisos o no hay ubicación
  if (errorMsg || !userLocation) {
    return (
      <View style={styles.centered}>
        <Text>{errorMsg || 'No se pudo obtener la ubicación.'}</Text>
      </View>
    );
  }

  // Si no hay ningún pedido
  if (!order) {
    return (
      <View style={styles.centered}>
        <Text>Aún no tienes pedidos para rastrear.</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <MapView
        style={styles.map}
        provider={PROVIDER_GOOGLE}
        initialRegion={{
          latitude: userLocation.latitude,
          longitude: userLocation.longitude,
          latitudeDelta: 0.02,
          longitudeDelta: 0.01,
        }}
      >
        {/* --- 3. RENDERIZADO CONDICIONAL DEL MARCADOR --- */}

        {/* Si el pedido NO tiene repartidor asignado */}
        {!order.repartidor_id && userLocation && (
          <Marker
            coordinate={userLocation}
            title="Tu Ubicación"
            description="Esperando a un repartidor"
          >
            {/* Usamos una Imagen como marcador personalizado */}
            <Image
              source={require('@/assets/images/splash-icon.png')} // Asegúrate que la ruta a tu logo es correcta
              style={styles.logoMarker}
            />
          </Marker>
        )}

        {/* Si el pedido SÍ tiene repartidor (lógica futura) */}
        {order.repartidor_id && (
          // Aquí iría el marcador del repartidor cuando implementes esa parte
          <Marker
            coordinate={userLocation} // Cambiar por la ubicación del repartidor
            title="Repartidor Asignado"
            description="Tu repartidor está en camino"
          >
            {/* Puedes usar un ícono de moto o similar aquí */}
          </Marker>
        )}
      </MapView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  map: {
    width: '100%',
    height: '100%',
  },
  logoMarker: {
    width: 60, // Ajusta el tamaño del logo según necesites
    height: 60,
    resizeMode: 'contain',
  },    
});

export default TrackOrderScreen;