// app/index.tsx

import { Redirect } from 'expo-router';
import { useAuth } from '../contexts/AuthContext';
import { View, ActivityIndicator, StyleSheet } from 'react-native';

export default function RootIndex() {
  const { session, loading } = useAuth();

  // Muestra un indicador de carga mientras se verifica la sesión
  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#FFC107" />
      </View>
    );
  }

  // --- MODIFICACIÓN PARA DESARROLLO ---
  // Redirigimos siempre a la pantalla de login de desarrollo.
  // ¡Recuerda cambiar esto antes de pasar a producción!
  return <Redirect href="dev-login" />;

  /*
  // --- CÓDIGO ORIGINAL DE PRODUCCIÓN ---
  if (!session) {
    // Si no hay sesión, va al login normal.
    return <Redirect href="/(auth)/login" />;
  }

  // Si hay sesión, va a la pantalla principal.
  return <Redirect href="/(tabs)" />;
  */
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F8FAFC',
  },
});