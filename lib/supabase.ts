import { createClient } from '@supabase/supabase-js';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Database } from '@/types/database';

// Objeto de almacenamiento "falso" que no hace nada.
// Se usará cuando el código se ejecute en el servidor (donde 'window' no existe).
const dummyStorage = {
  setItem: (_key: string, _value: string) => Promise.resolve(),
  getItem: (_key: string) => Promise.resolve(null),
  removeItem: (_key: string) => Promise.resolve(),
};
//.
const supabaseUrl ='https://xjuivnmpbzjpqtfkvoca.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhqdWl2bm1wYnpqcHF0Zmt2b2NhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTcwNjk3OTIsImV4cCI6MjA3MjY0NTc5Mn0.Utge4vYA3-hEqdEsC2AT7GZoMHf1CzkrFH8-UB6uCyE';

export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey, {
  auth: {
    // Esta es la lógica CRÍTICA:
    // Si 'window' no está definido, significa que estamos en el servidor -> usamos el almacenamiento falso.
    // Si 'window' sí está definido, estamos en el cliente -> usamos AsyncStorage.
    storage: typeof window !== 'undefined' ? AsyncStorage : dummyStorage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
});