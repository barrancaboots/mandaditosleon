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
  const [isAppReady, setIsAppReady] = useState(false);

  useEffect(() => {
    if (error) {
      console.error("Error cargando las fuentes:", error);
    }
    // Una vez que las fuentes están cargadas, podemos preparar la app
    if (fontsLoaded) {
      // Usamos un temporizador para asegurarnos de que la animación del splash tenga tiempo de ejecutarse
      const timer = setTimeout(() => {
        setIsAppReady(true);
        SplashScreen.hideAsync();
      }, 4000); // Esto debe coincidir con la duración de tu animación de splash

      // Es buena práctica limpiar el temporizador si el componente se desmonta
      return () => clearTimeout(timer);
    }
  }, [fontsLoaded, error]);

  // Mientras las fuentes no estén cargadas, no renderizamos nada.
  // El splash nativo de Expo se encargará de cubrir la pantalla.
  if (!fontsLoaded) {
    return null;
  }

  // 👇 --- CORRECCIÓN DEFINITIVA --- 👇
  // Este es el único return principal. Usamos un ternario para decidir qué mostrar.
  // Esta estructura garantiza que el orden de los hooks nunca cambie entre renderizados.
   return (
    <SafeAreaProvider>
      <AuthProvider>
        <CartProvider>
          {isAppReady ? (
            // Si la app está lista, muestra el contenido principal
            <>
              <Stack screenOptions={{ headerShown: false }} />
              <StatusBar style="auto" />
            </>
          ) : (
            // Si no, muestra la animación del splash
            // Pasamos una función vacía porque ya controlamos el fin con el temporizador
            <AnimatedSplashScreen onAnimationFinish={() => {}} />
          )}
        </CartProvider>
      </AuthProvider>
    </SafeAreaProvider>
  );
}