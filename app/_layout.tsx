import { useEffect, useState } from 'react';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import * as SplashScreen from 'expo-splash-screen';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { AuthProvider } from '@/contexts/AuthContext';
import { CartProvider } from '@/contexts/CartContext';
import AnimatedSplashScreen from '@/components/AnimatedSplashScreen';
import { useFonts, Poppins_400Regular, Poppins_600SemiBold, Poppins_700Bold } from '@expo-google-fonts/poppins';

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [fontsLoaded, error] = useFonts({
    Poppins_400Regular,
    Poppins_600SemiBold,
    Poppins_700Bold,
  });

  const [splashAnimationFinished, setSplashAnimationFinished] = useState(false);

  useEffect(() => {
    if (error) console.error("Error cargando las fuentes:", error);
    if (fontsLoaded && splashAnimationFinished) {
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded, splashAnimationFinished, error]);
  
  const handleAnimationFinish = () => {
    setSplashAnimationFinished(true);
  };

  if (!fontsLoaded) {
    return null;
  }

  if (!splashAnimationFinished) {
    return <AnimatedSplashScreen onAnimationFinish={handleAnimationFinish} />;
  }

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