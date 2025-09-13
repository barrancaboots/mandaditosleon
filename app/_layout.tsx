import { useEffect, useState } from 'react';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import * as SplashScreen from 'expo-splash-screen';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { AuthProvider } from '../contexts/AuthContext';
import { CartProvider } from '../contexts/CartContext';
import AnimatedSplashScreen from '../components/AnimatedSplashScreen';

// Mantenemos la pantalla de carga nativa visible para evitar un parpadeo
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [splashAnimationFinished, setSplashAnimationFinished] = useState(false);

  // Esta función se llamará cuando la animación del logo termine
  const handleAnimationFinish = async () => {
    setSplashAnimationFinished(true); // Marcamos que la animación terminó
    await SplashScreen.hideAsync(); // Ocultamos la pantalla de carga nativa
  };

  // Si la animación no ha terminado, mostramos nuestro componente de splash
  if (!splashAnimationFinished) {
    return <AnimatedSplashScreen onAnimationFinish={handleAnimationFinish} />;
  }

  // Si la animación ya terminó, mostramos la aplicación real
  return (
    <SafeAreaProvider>
      <AuthProvider>
        <CartProvider>
          <Stack screenOptions={{ headerShown: false }}>
            <Stack.Screen name="(auth)" options={{ headerShown: false }} />
            <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
            <Stack.Screen name="admin" options={{ headerShown: false }} />
            <Stack.Screen name="+not-found" />
          </Stack>
          <StatusBar style="auto" />
        </CartProvider>
      </AuthProvider>
    </SafeAreaProvider>
  );
}