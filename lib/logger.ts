// lib/logger.ts

import { supabase } from './supabase';

// Definimos los niveles de log que coinciden con el ENUM de la base de datos
type LogLevel = 'info' | 'warn' | 'error' | 'debug';

/**
 * Registra un evento en la tabla de logs de Supabase.
 *
 * @param level El nivel de severidad del log ('info', 'warn', 'error', 'debug').
 * @param message El mensaje principal del log.
 * @param metadata Un objeto opcional con información adicional (ej. el objeto de un error).
 */
export const logEvent = async (level: LogLevel, message: string, metadata?: object) => {
  try {
    // Obtenemos el usuario actual para asociar el log si está autenticado
    const { data: { user } } = await supabase.auth.getUser();

    const { error } = await supabase.from('logs').insert({
      level,
      message,
      user_id: user?.id || null,
      metadata: metadata || {},
    });

    if (error) {
      // Si falla el log, lo mostramos en la consola para no perderlo.
      console.error('Error al guardar log en Supabase:', error.message);
    }
  } catch (e) {
    // Captura cualquier otro error durante el proceso de log.
    console.error('Error inesperado en el sistema de logs:', e);
  }
};