import { useEffect, useState } from 'react';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import * as SplashScreen from 'expo-splash-screen';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { AuthProvider } from '@/contexts/AuthContext';
import { CartProvider } from '@/contexts/CartContext';
import AnimatedSplashScreen from '@/components/AnimatedSplashScreen';
import { useFonts, Poppins_400Regular, Poppins_600SemiBold, Poppins_700Bold } from '@expo-google-fonts/poppins';
import { useRenderLog } from '@/hooks/useRenderLog';

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [fontsLoaded] = useFonts({
    Poppins_400Regular,
    Poppins_600SemiBold,
    Poppins_700Bold,
  });

  const [splashAnimationFinished, setSplashAnimationFinished] = useState(false);

  useEffect(() => {
    if (fontsLoaded && splashAnimationFinished) {
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded, splashAnimationFinished]);
  
  const handleAnimationFinish = () => {
    setSplashAnimationFinished(true);
  };

  if (!fontsLoaded) {
    return null;
  }

  if (!splashAnimationFinished) {
    return <AnimatedSplashScreen onAnimationFinish={handleAnimationFinish} />;
  }
useRenderLog('_layout');
  return (
    <SafeAreaProvider>
      <AuthProvider>
        <CartProvider>
          <Stack screenOptions={{ headerShown: false }}>
            <Stack.Screen name="(auth)" />
            <Stack.Screen name="(tabs)" />
            <Stack.Screen name="admin" />
            <Stack.Screen name="+not-found" />
          </Stack>
          <StatusBar style="auto" />
        </CartProvider>
      </AuthProvider>
    </SafeAreaProvider>
  );
}