import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
} from 'react-native';
import { useRouter } from 'expo-router';
import Logo from '../../components/Logo'; // Asegúrate que la ruta al logo es correcta
import { supabase } from '../../lib/supabase'; // Asegúrate que la ruta a supabase es correcta

export default function LoginScreen() {
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
  // La función signInWithPassword devuelve un objeto con 'data' y 'error'
  const { data, error } = await supabase.auth.signInWithPassword({
    email: email,
    password: password,
  });

  setLoading(false);

  if (error) {
    // Si hay un error, lo mostramos
    Alert.alert('Error al iniciar sesión', error.message);
  } else if (data.session) {
    // ¡Éxito! Si no hay error y tenemos una sesión, redirigimos manualmente.
    // Usamos replace para que el usuario no pueda volver atrás a la pantalla de login.
    router.replace('/(tabs)');
  }
  // No necesitamos hacer nada más. El listener del AuthProvider también se activará,
  // pero nuestra redirección manual es más inmediata.
}
  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardAvoidingContainer}
      >
        <View style={styles.logoContainer}>
          <Logo width={180} height={180} />
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
              <ActivityIndicator color="#424242" />
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
    fontWeight: 'bold',
    color: '#333',
    marginTop: 10,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    marginTop: 4,
  },
  formContainer: {
    flex: 1,
    paddingHorizontal: 30,
    justifyContent: 'flex-start',
  },
  input: {
    backgroundColor: '#F2F2F2',
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderRadius: 10,
    fontSize: 16,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: '#E5E5E5',
  },
  button: {
    paddingVertical: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 10,
  },
  loginButton: {
    backgroundColor: '#FFC107', // Un amarillo dorado que combina con el león
  },
  registerButton: {
    backgroundColor: 'transparent',
  },
  buttonText: {
    color: '#424242',
    fontWeight: 'bold',
    fontSize: 16,
  },
  registerButtonText: {
    color: '#333',
    fontWeight: 'normal',
  },
});

