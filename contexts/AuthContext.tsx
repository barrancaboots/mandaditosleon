import React, { createContext, useContext, useEffect, useState } from 'react';
import { Session, User } from '@supabase/supabase-js';
import { supabase } from '../lib/supabase';
import { Database } from '../types/database';

// Deriva el tipo Profile directamente del esquema para máxima consistencia
type Profile = Database['public']['Tables']['profiles']['Row'];

interface AuthContextType {
  session: Session | null;
  user: User | null;
  profile: Profile | null;
  loading: boolean;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);

  // Esta función se encarga de buscar el perfil del usuario
  const fetchProfile = async (user: User) => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();

      if (error) throw error;

      if (data) {
        // Combinamos los datos del perfil con el email del usuario de auth
        const profileWithEmail = Object.assign({}, data, { email: user.email });
        setProfile(profileWithEmail);
      }
    } catch (error) {
      console.error('Error fetching profile:', error);
      setProfile(null); // Si hay un error, nos aseguramos de que el perfil sea nulo
    }
  };

  useEffect(() => {
    // Escucha los cambios en el estado de autenticación (login, logout, inicio)
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (_event, session) => {
        setLoading(true); // Inicia la carga CADA VEZ que cambia la sesión
        setSession(session);
        const currentUser = session?.user ?? null;
        setUser(currentUser);
        
        if (currentUser) {
          // Si hay un usuario, busca su perfil
          await fetchProfile(currentUser);
        } else {
          // Si no hay sesión (logout o inicio sin sesión), limpia el perfil
          setProfile(null);
        }
        setLoading(false); // Finaliza la carga DESPUÉS de todas las operaciones
      }
    );

    return () => subscription.unsubscribe();
  }, []);
  
  const signOut = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
  };

  const value = {
    session,
    user,
    profile,
    loading,
    signOut,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};