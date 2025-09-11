// app/dev-login.tsx

import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { supabase } from '../lib/supabase';
import { router } from 'expo-router';

export default function DevLoginScreen() {
  const handleLoginAs = async (role: 'admin' | 'cliente' | 'repartidor') => {
    try {
      // Para este método, necesitas crear usuarios de prueba en tu dashboard de Supabase
      // con estos correos y contraseñas.
      const testUsers = {
        admin: { email: 'admin@test.com', password: 'password' },
        cliente: { email: 'cliente@test.com', password: 'password' },
        repartidor: { email: 'repartidor@test.com', password: 'password' },
      };

      const { email, password } = testUsers[role];

      const { error } = await supabase.auth.signInWithPassword({ email, password });

      if (error) {
        throw new Error(`No se pudo iniciar sesión como ${role}: ${error.message}`);
      }

      Alert.alert('¡Éxito!', `Has iniciado sesión como ${role}.`);
      
      // El listener en AuthContext se encargará de redirigir al usuario
      // a la pantalla correcta según su rol después de un inicio de sesión exitoso.

    } catch (error: any) {
      console.error('Error en el login de desarrollo:', error);
      Alert.alert('Error', error.message);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>🧪 Acceso Rápido 🧪</Text>
        <Text style={styles.subtitle}>
          (Pantalla exclusiva para desarrollo)
        </Text>

        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={[styles.button, { backgroundColor: '#c0392b' }]}
            onPress={() => handleLoginAs('admin')}
          >
            <Text style={styles.buttonText}>Entrar como Administrador</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.button, { backgroundColor: '#2980b9' }]}
            onPress={() => handleLoginAs('cliente')}
          >
            <Text style={styles.buttonText}>Entrar como Cliente</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.button, { backgroundColor: '#27ae60' }]}
            onPress={() => handleLoginAs('repartidor')}
          >
            <Text style={styles.buttonText}>Entrar como Repartidor</Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity onPress={() => router.replace('/(auth)/login')}>
           <Text style={styles.linkText}>Ir al login normal</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
    justifyContent: 'center',
  },
  content: {
    paddingHorizontal: 32,
    alignItems: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#1E293B',
    textAlign: 'center',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#64748B',
    textAlign: 'center',
    marginBottom: 40,
  },
  buttonContainer: {
    width: '100%',
  },
  button: {
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
    marginBottom: 16,
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  linkText: {
    marginTop: 20,
    color: '#2563EB',
    fontSize: 16,
    fontWeight: '600',
  },
});