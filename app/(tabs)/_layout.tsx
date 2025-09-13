import React from 'react';
import { Redirect } from 'expo-router';
import { useAuth } from '@/contexts/AuthContext';
import { View, ActivityIndicator, StyleSheet } from 'react-native';

export default function RootIndex() {
  const { session, profile, loading } = useAuth();

  // 1. Muestra un indicador de carga mientras se verifica la sesión.
  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#FFC107" />
      </View>
    );
  }

  // 2. Si no hay sesión, redirige al usuario a la pantalla de login.
  if (!session) {
    return <Redirect href="/(auth)/login" />;
  }

  // 3. Si hay sesión y el usuario es un administrador, lo redirige al panel de admin.
  if (profile?.role === 'admin') {
    return <Redirect href="/admin" />;
  }

  // 4. Para cualquier otro caso (cliente, repartidor, etc.), lo redirige a la pantalla principal.
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