import { useEffect, useState } from 'react';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import * as SplashScreen from 'expo-splash-screen';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { AuthProvider } from '@/contexts/AuthContext';
import { CartProvider } from '@/contexts/CartContext';
import AnimatedSplashScreen from '@/components/AnimatedSplashScreen';
import { useFonts, Poppins_400Regular, Poppins_600SemiBold, Poppins_700Bold } from '@expo-google-fonts/poppins';

// Mantenemos la pantalla de carga nativa visible
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [fontsLoaded, error] = useFonts({
    Poppins_400Regular,
    Poppins_600SemiBold,
    Poppins_700Bold,
  });

  // Un único estado para controlar si la app está lista para mostrarse
  const [splashAnimationFinished, setSplashAnimationFinished] = useState(false);

  useEffect(() => {
    if (error) {
      console.error("Error cargando las fuentes:", error);
    }
    // Ocultamos el splash nativo solo cuando las fuentes han cargado Y la animación ha terminado
    if (fontsLoaded && splashAnimationFinished) {
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded, splashAnimationFinished, error]);
  
  // Esta función ahora es la que actualiza el estado para mostrar la app
  const handleAnimationFinish = () => {
    setSplashAnimationFinished(true);
  };

  // Mientras las fuentes no estén cargadas, no renderizamos nada
  if (!fontsLoaded) {
    return null;
  }

  // Si la animación no ha terminado, mostramos el splash
  if (!splashAnimationFinished) {
    return <AnimatedSplashScreen onAnimationFinish={handleAnimationFinish} />;
  }

  // Cuando la animación termina, se muestra la app
  return (
    <SafeAreaProvider>
      <AuthProvider>
        <CartProvider>
          <Stack screenOptions={{ headerShown: false }} />
          <StatusBar style="auto" />
        </CartProvider>
      </AuthProvider>
    </SafeAreaProvider>
  );
}