import React, { useEffect } from 'react';
import { Svg, Path, G, Text } from 'react-native-svg';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withDelay,
  withSpring,
} from 'react-native-reanimated';

// Creamos componentes animados para poder aplicarles estilos
const AnimatedG = Animated.createAnimatedComponent(G);

export default function AnimatedLogo({ width = 200, height = 200 }) {
  // --- Valores de Animación ---
  const shieldOpacity = useSharedValue(0);
  const shieldScale = useSharedValue(0.8);
  const pinTranslateY = useSharedValue(-100);
  const pinOpacity = useSharedValue(0);
  const textOpacity = useSharedValue(0);

  useEffect(() => {
    // 1. El escudo aparece con un fade in y un suave crecimiento
    shieldOpacity.value = withTiming(1, { duration: 800 });
    shieldScale.value = withTiming(1, { duration: 800 });

    // 2. El pin "cae" en su lugar con un efecto de resorte (spring)
    pinOpacity.value = withDelay(400, withTiming(1, { duration: 100 }));
    pinTranslateY.value = withDelay(400, withSpring(0, {
      damping: 12,
      stiffness: 90,
    }));

    // 3. El texto aparece al final de todo
    textOpacity.value = withDelay(1200, withTiming(1, { duration: 800 }));
  }, []);

  // --- Estilos Animados ---
  const shieldStyle = useAnimatedStyle(() => ({
    opacity: shieldOpacity.value,
    transform: [{ scale: shieldScale.value }],
    // 👇 --- ¡AQUÍ ESTÁ LA CORRECCIÓN! --- 👇
    // Se ha eliminado la línea 'transformOrigin: 'center''
  }));
  
  const pinStyle = useAnimatedStyle(() => ({
    opacity: pinOpacity.value,
    transform: [{ translateY: pinTranslateY.value }],
  }));

  const textStyle = useAnimatedStyle(() => ({
    opacity: textOpacity.value,
  }));

  return (
    <Svg width={width} height={height} viewBox="0 0 100 125">
      <AnimatedG style={shieldStyle}>
        <Path d="M50 0 L95 25 L85 60 L50 90 L15 60 L5 25 Z" fill="#FFC107"/>
        <Path d="M50 15 L80 35 L75 60 L50 80 L25 60 L20 35 Z" fill="#FFD54F"/>
      </AnimatedG>
      
      <AnimatedG style={pinStyle}>
        <Path d="M50 40 C45 40 40 45 40 50 C40 60 50 75 50 75 C50 75 60 60 60 50 C60 45 55 40 50 40 Z" fill="#424242"/>
        <Path d="M50 45 C52.76 45 55 47.24 55 50 C55 52.76 52.76 55 50 55 C47.24 55 45 52.76 45 50 C45 47.24 47.24 45 50 45 Z" fill="#FFFFFF"/>
      </AnimatedG>
      
      <AnimatedG style={textStyle}>
        <Text x="50" y="105" fill="#333333" fontSize="12" fontWeight="bold" textAnchor="middle" fontFamily="Arial, sans-serif">
          Mandaditos
        </Text>
        <Text x="50" y="118" fill="#555555" fontSize="10" fontWeight="normal" textAnchor="middle" fontFamily="Arial, sans-serif">
          LEÓN
        </Text>
      </AnimatedG>
    </Svg>
  );
}