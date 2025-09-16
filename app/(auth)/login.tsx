import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import AnimatedLogo from '../../components/AnimatedLogo';
import { supabase } from '../../lib/supabase';
import { devLog } from '../../lib/devLogger';
import { useRenderLog } from '../../hooks/useRenderLog';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  keyboardAvoidingContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  logoContainer: {
    flex: 1.2,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 28,
    fontFamily: 'Poppins_700Bold',
    color: '#333',
    marginTop: 10,
  },
  subtitle: {
    fontSize: 16,
    fontFamily: 'Poppins_400Regular',
    color: '#666',
    marginTop: 4,
  },
  formContainer: {
    flex: 1,
    paddingHorizontal: 30,
    justifyContent: 'flex-start',
  },
  input: {
    backgroundColor: '#F7F7F7',
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderRadius: 10,
    fontSize: 16,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: '#E5E5E5',
    fontFamily: 'Poppins_400Regular',
  },
  button: {
    paddingVertical: 15,
    borderRadius: 15,
    alignItems: 'center',
    marginTop: 10,
  },
  loginButton: {
    backgroundColor: '#FFC107',
  },
  registerButton: {
    backgroundColor: 'transparent',
  },
  buttonText: {
    color: '#1A1A1A',
    fontWeight: '600',
    fontFamily: 'Poppins_600SemiBold',
    fontSize: 16,
  },
  registerButtonText: {
    color: '#333',
    fontWeight: 'normal',
  },
});

export default function LoginScreen() {
  useRenderLog('LoginScreen');
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function handleLogin() {
    if (!email || !password) {
      Alert.alert('Campos requeridos', 'Por favor, ingresa tu correo y contraseña.');
      return;
    }

    setLoading(true);
    const { data: loginData, error: loginError } = await supabase.auth.signInWithPassword({
      email: email,
      password: password,
    });

    devLog('Respuesta de API [signInWithPassword]:', { data: loginData, error: loginError });

    if (loginError) {
      setLoading(false);
      Alert.alert('Error al iniciar sesión', loginError.message);
      return;
    }

    if (loginData.user) {
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', loginData.user.id)
        .single();

      setLoading(false);

      if (profileError) {
        Alert.alert('Error al obtener el perfil', 'No se pudo cargar la información del usuario.');
        router.replace('/(tabs)');
      } else if (profile) {
        if (profile.role === 'admin') {
          router.replace('/admin');
        } else {
          router.replace('/(tabs)');
        }
      }
    } else {
      setLoading(false);
      Alert.alert('Error', 'No se pudo obtener la sesión del usuario.');
    }
  }

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardAvoidingContainer}
      >
        <View style={styles.logoContainer}>
          <AnimatedLogo width={180} height={180} />
          <Text style={styles.title}>Mandaditos León</Text>
          <Text style={styles.subtitle}>Tu mandado, hecho.</Text>
        </View>

        <View style={styles.formContainer}>
          <TextInput
            style={styles.input}
            placeholder="correo@ejemplo.com"
            value={email}
            onChangeText={setEmail}
            autoCapitalize="none"
            keyboardType="email-address"
          />
          <TextInput
            style={styles.input}
            placeholder="Contraseña"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
          />

          <TouchableOpacity
            style={[styles.button, styles.loginButton]}
            onPress={handleLogin}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="#1A1A1A" />
            ) : (
              <Text style={styles.buttonText}>Iniciar Sesión</Text>
            )}
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.button, styles.registerButton]}
            onPress={() => router.push('/(auth)/register')}
            disabled={loading}
          >
            <Text style={[styles.buttonText, styles.registerButtonText]}>¿No tienes cuenta? Regístrate</Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}