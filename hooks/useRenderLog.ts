import { useEffect, useRef } from 'react';
import { devLog } from '../lib/devLogger'; // Importamos tu logger personalizado

/**
 * Un hook de depuración que imprime un mensaje en la consola cada vez que
 * el componente que lo utiliza se renderiza.
 * @param componentName El nombre del componente para identificar los logs.
 */
export const useRenderLog = (componentName: string) => {
  // useRef para mantener el contador de renderizados sin provocar nuevos renders.
  const renderCount = useRef(0);

  useEffect(() => {
    // Incrementamos el contador en cada renderizado.
    renderCount.current += 1;
    // Usamos tu logger para imprimir el mensaje.
    devLog(`🎨 Componente pintado: ${componentName} | Render #${renderCount.current}`);
  }); // Sin array de dependencias, se ejecuta en CADA render.
};