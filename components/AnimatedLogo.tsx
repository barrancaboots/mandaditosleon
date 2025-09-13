import React, { useEffect } from 'react';
import { Svg, Path, G, Text } from 'react-native-svg';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withDelay,
  withRepeat,
  withSequence,
} from 'react-native-reanimated';

// Creamos un componente `Animated.G` para poder animar grupos de SVG
const AnimatedG = Animated.createAnimatedComponent(G);

export default function AnimatedLogo({ width = 200, height = 200 }) {
  // Valores compartidos para animar la opacidad y escala de cada parte
  const maneFaceScale = useSharedValue(0.5);
  const maneFaceOpacity = useSharedValue(0);
  
  const pinScale = useSharedValue(0.5);
  const pinOpacity = useSharedValue(0);

  const textOpacity = useSharedValue(0);

  // useEffect se ejecuta una vez para iniciar la secuencia de animación
  useEffect(() => {
    // 1. Animación "Pop-in" para la melena y cara
    maneFaceOpacity.value = withTiming(1, { duration: 600 });
    maneFaceScale.value = withTiming(1, { duration: 600 });

    // 2. Animación "Pop-in" para el pin (con retraso)
    pinOpacity.value = withDelay(400, withTiming(1, { duration: 600 }));
    pinScale.value = withDelay(400, withTiming(1, { duration: 600 }));

    // 3. Animación de "Pulso" para el pin (inicia después y se repite)
    pinScale.value = withDelay(
      1500, // Empieza después de 1.5s
      withRepeat(
        withSequence(
          withTiming(1.1, { duration: 1000 }),
          withTiming(1, { duration: 1000 })
        ),
        -1, // -1 significa que se repite infinitamente
        true // true para que la animación sea reversible (vaya y vuelva)
      )
    );
    
    // 4. Animación "Fade-in" para el texto (con más retraso)
    textOpacity.value = withDelay(800, withTiming(1, { duration: 800 }));
  }, []);

  // Creamos los estilos animados que se aplicarán a los componentes
  const maneFaceAnimatedStyle = useAnimatedStyle(() => ({
    opacity: maneFaceOpacity.value,
    transform: [{ scale: maneFaceScale.value }],
  }));

  const pinAnimatedStyle = useAnimatedStyle(() => ({
    opacity: pinOpacity.value,
    transform: [{ scale: pinScale.value }],
  }));

  const textAnimatedStyle = useAnimatedStyle(() => ({
    opacity: textOpacity.value,
  }));

  return (
    <Svg
      width={width}
      height={height}
      viewBox="0 0 100 125"
    >
      {/* Melena y cara animadas juntas */}
      <AnimatedG style={[{ transformOrigin: 'center' }, maneFaceAnimatedStyle]}>
        <Path d="M50 0 L95 25 L85 60 L50 90 L15 60 L5 25 Z" fill="#FFC107"/>
        <Path d="M50 15 L80 35 L75 60 L50 80 L25 60 L20 35 Z" fill="#FFD54F"/>
      </AnimatedG>

      {/* Pin animado por separado */}
      <AnimatedG style={[{ transformOrigin: 'center' }, pinAnimatedStyle]}>
        <Path d="M50 40 C45 40 40 45 40 50 C40 60 50 75 50 75 C50 75 60 60 60 50 C60 45 55 40 50 40 Z" fill="#424242"/>
        <Path d="M50 45 C52.76 45 55 47.24 55 50 C55 52.76 52.76 55 50 55 C47.24 55 45 52.76 45 50 C45 47.24 47.24 45 50 45 Z" fill="#FFFFFF"/>
      </AnimatedG>
      
      {/* Texto animado al final */}
      <AnimatedG style={textAnimatedStyle}>
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