import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import MapView, { UrlTile } from 'react-native-maps';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function TrackScreen() {
  // Coordenadas fijas para centrar el mapa (León, Guanajuato)
  const defaultRegion = {
    latitude: 21.1290,
    longitude: -101.6853,
    latitudeDelta: 0.0922,
    longitudeDelta: 0.0421,
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Mapa</Text>
      </View>
    
      <MapView
        style={styles.map}
        initialRegion={defaultRegion}
      >
        {/* Esta línea le dice al mapa que use los "azulejos" de OpenStreetMap */}
        <UrlTile
          urlTemplate="https://tiles.openfreemap.org/styles/liberty"
          maximumZ={19}
        />
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
});