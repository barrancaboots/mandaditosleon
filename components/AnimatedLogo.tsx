import React, { useEffect } from 'react';
import { Svg, Path, G, Text } from 'react-native-svg';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withDelay,
  Easing,
} from 'react-native-reanimated';

// Creamos componentes animados para poder aplicarles estilos
const AnimatedG = Animated.createAnimatedComponent(G);
const AnimatedPath = Animated.createAnimatedComponent(Path);

export default function AnimatedLogo({ width = 200, height = 200 }) {
  // --- Valores de Animación ---
  // Para la melena (la primera caja)
  const maneOpacity = useSharedValue(0);
  const maneScale = useSharedValue(0.7);

  // Para la cara (la segunda caja que cae)
  const faceTranslateY = useSharedValue(-50);
  const faceOpacity = useSharedValue(0);

  // Para el pin (el marcador gris que también cae)
  const pinTranslateY = useSharedValue(-50);
  const pinOpacity = useSharedValue(0);

  // Para el texto final
  const textOpacity = useSharedValue(0);

  // Inicia la secuencia de animación cuando el componente se monta
  useEffect(() => {
    // 1. La melena entra con un fade in y un ligero zoom
    maneOpacity.value = withTiming(1, { duration: 800 });
    maneScale.value = withTiming(1, { duration: 800, easing: Easing.out(Easing.exp) });

    // 2. La cara "cae" en su lugar, con un retraso
    faceOpacity.value = withDelay(500, withTiming(1, { duration: 600 }));
    faceTranslateY.value = withDelay(500, withTiming(0, { duration: 600, easing: Easing.bounce }));

    // 3. El pin "cae" después, con más retraso
    pinOpacity.value = withDelay(900, withTiming(1, { duration: 600 }));
    pinTranslateY.value = withDelay(900, withTiming(0, { duration: 600, easing: Easing.bounce }));

    // 4. El texto aparece al final de todo
    textOpacity.value = withDelay(1500, withTiming(1, { duration: 800 }));
  }, []);

  // --- Estilos Animados ---
  const maneStyle = useAnimatedStyle(() => ({
    opacity: maneOpacity.value,
    transform: [{ scale: maneScale.value }],
  }));

  const faceStyle = useAnimatedStyle(() => ({
    opacity: faceOpacity.value,
    transform: [{ translateY: faceTranslateY.value }],
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
      {/* Usamos transform-origin para que el zoom sea desde el centro */}
      <AnimatedG style={[{ transformOrigin: 'center' }, maneStyle]}>
        <Path d="M50 0 L95 25 L85 60 L50 90 L15 60 L5 25 Z" fill="#FFC107"/>
      </AnimatedG>
      
      <AnimatedG style={faceStyle}>
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