// lib/devLogger.ts

import { IS_DEV_MODE } from '../config/appConfig';

/**
 * Imprime mensajes en la consola únicamente si IS_DEV_MODE es `true`.
 * Actúa como un wrapper de `console.log` para depuración.
 *
 * @param messages Uno o más argumentos para imprimir en la consola.
 */
export const devLog = (...messages: any[]) => {
  // Si no estamos en modo desarrollo, la función no hace nada.
  if (!IS_DEV_MODE) {
    return;
  }

  // Usamos un prefijo para distinguir fácilmente nuestros logs en la consola.
  const prefix = '[DEV_LOG]';

  // Imprimimos en la consola con el prefijo.
  console.log(prefix, ...messages);
};