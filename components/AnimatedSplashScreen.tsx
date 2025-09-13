import React, { useEffect } from 'react';
import { View, StyleSheet } from 'react-native';
import Animated, { useSharedValue, withTiming, runOnJS } from 'react-native-reanimated';
import AnimatedLogo from './AnimatedLogo'; // 👈 CAMBIO: Importamos el nuevo logo animado

export default function AnimatedSplashScreen({ onAnimationFinish }: { onAnimationFinish: () => void }) {
  // Valores para la animación de SALIDA de toda la pantalla
  const opacity = useSharedValue(1);
  const scale = useSharedValue(1);

  useEffect(() => {
    // Esperamos 3 segundos antes de que toda la pantalla desaparezca
    setTimeout(() => {
      // Animación de salida (zoom out y fade out)
      scale.value = withTiming(1.5, { duration: 600 });
      opacity.value = withTiming(0, { duration: 800 }, () => {
        runOnJS(onAnimationFinish)();
      });
    }, 3000); // Duración total de la splash screen
  }, []);

  return (
    <Animated.View style={[styles.container, { opacity }]}>
        {/* 👇 CAMBIO: Usamos el componente del logo animado aquí */}
        <AnimatedLogo width={180} height={180} />
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
  },
});