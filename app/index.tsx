import React from 'react';
import { Redirect } from 'expo-router';
import { useAuth } from '@/contexts/AuthContext';
import { View, ActivityIndicator, StyleSheet } from 'react-native';

export default function RootIndex() {
  const { session, profile, loading } = useAuth();

  // Muestra un indicador de carga mientras se obtiene la sesión
  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#FFC107" />
      </View>
    );
  }

  // Si no hay sesión, redirige al login
  if (!session) {
    return <Redirect href="/(auth)/login" />;
  }

  // Si el usuario es admin, redirige al panel de admin
  if (profile?.role === 'admin') {
    return <Redirect href="/admin" />;
  }

  // Para todos los demás, redirige a la pantalla principal
  return <Redirect href="/(tabs)" />;
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F7F7F7',
  },
});