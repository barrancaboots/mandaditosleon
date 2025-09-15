import React, { useEffect } from 'react';
import { View, StyleSheet } from 'react-native';
import Animated, { useSharedValue, withTiming, runOnJS } from 'react-native-reanimated';
import AnimatedLogo from './AnimatedLogo'; // Asegúrate de que importa el logo animado

export default function AnimatedSplashScreen({ onAnimationFinish }: { onAnimationFinish: () => void }) {
  const opacity = useSharedValue(1);

  useEffect(() => {
    // Esperamos 4 segundos antes de que la pantalla de carga desaparezca
    setTimeout(() => {
      // Animación de salida (fade out)
      opacity.value = withTiming(0, { duration: 500 }, () => {
        runOnJS(onAnimationFinish)();
      });
    }, 4000); // Aumentamos la duración para dar tiempo a la nueva animación
  }, []);

  return (
    <Animated.View style={[styles.container, { opacity }]}>
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