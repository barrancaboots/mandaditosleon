import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Alert,
  Image,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { User, Mail, Phone, LogOut, Camera as CameraIcon } from 'lucide-react-native';
import { useAuth } from '@/contexts/AuthContext';
import { t } from '@/lib/i18n';
import * as ImagePicker from 'expo-image-picker';
import { supabase } from '@/lib/supabase';

export default function ProfileScreen() {
  const { profile, user, signOut, fetchProfile } = useAuth();
  const [uploading, setUploading] = useState(false);

  const handleTakePhoto = async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permiso denegado', 'Necesitamos acceso a tu cámara para tomar una foto.');
      return;
    }

    let result = await ImagePicker.launchCameraAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.5,
      base64: true,
    });

    if (!result.canceled && user) {
      setUploading(true);
      const base64 = result.assets[0].base64;
      if (base64) {
        await uploadAvatar(base64, user);
      }
      setUploading(false);
    }
  };

  const uploadAvatar = async (base64: string, currentUser: any) => {
    try {
      const filePath = `public/${currentUser.id}.png`;
      
      const { error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(filePath, base64, {
          contentType: 'image/png',
          upsert: true,
        });

      if (uploadError) throw uploadError;

      // Espera un momento para que Supabase procese la imagen antes de obtener la URL
      await new Promise(resolve => setTimeout(resolve, 1000));

      const { data: { publicUrl } } = supabase.storage
        .from('avatars')
        .getPublicUrl(filePath);

      const { error: updateError } = await supabase
        .from('profiles')
        .update({ avatar_url: `${publicUrl}?t=${new Date().getTime()}` }) // Se añade un timestamp para evitar problemas de caché
        .eq('id', currentUser.id);

      if (updateError) throw updateError;
      
      // Vuelve a cargar el perfil para que la UI se actualice
      await fetchProfile(currentUser);

    } catch (error: any) {
      Alert.alert('Error', 'No se pudo subir la imagen: ' + error.message);
    }
  };
  
  const userRole = profile?.role === 'admin' ? t('administrator') : t('customer');

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Mi Perfil</Text>
      </View>

      <View style={styles.content}>
        <View style={styles.profileInfo}>
          <TouchableOpacity style={styles.avatar} onPress={handleTakePhoto} disabled={uploading}>
            {uploading ? (
              <ActivityIndicator color="#FFC107" />
            ) : profile?.avatar_url ? (
              <Image source={{ uri: profile.avatar_url }} style={styles.avatarImage} />
            ) : (
              <User size={40} color="#6B7280" />
            )}
            {!uploading && (
              <View style={styles.cameraOverlay}>
                <CameraIcon size={16} color="#FFFFFF" />
              </View>
            )}
          </TouchableOpacity>
          <Text style={styles.userName}>{profile?.full_name || 'Usuario'}</Text>
          <Text style={styles.userRole}>{userRole}</Text>
        </View>

        <View style={styles.detailsSection}>
          <View style={styles.detailItem}>
            <Mail size={20} color="#6B7280" />
            <Text style={styles.detailText}>{user?.email}</Text>
          </View>
          <View style={styles.detailItem}>
            <Phone size={20} color="#6B7280" />
            <Text style={styles.detailText}>{profile?.phone_number || t('notProvided')}</Text>
          </View>
        </View>

        <TouchableOpacity style={styles.signOutButton} onPress={signOut}>
          <LogOut size={20} color="#EF4444" />
          <Text style={styles.signOutText}>{t('signOut')}</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F7F7F7' },
  header: { padding: 20, backgroundColor: '#FFFFFF', alignItems: 'center', borderBottomWidth: 1, borderBottomColor: '#F0F0F0' },
  headerTitle: { fontFamily: 'Poppins_600SemiBold', fontSize: 18, color: '#1A1A1A' },
  content: { padding: 20 },
  profileInfo: { alignItems: 'center', marginBottom: 30 },
  avatar: { width: 100, height: 100, borderRadius: 50, backgroundColor: '#FFFFFF', justifyContent: 'center', alignItems: 'center', marginBottom: 15, borderWidth: 1, borderColor: '#E5E7EB', position: 'relative' },
  avatarImage: { width: '100%', height: '100%', borderRadius: 50 },
  cameraOverlay: { position: 'absolute', bottom: 0, right: 0, backgroundColor: 'rgba(0, 0, 0, 0.6)', padding: 8, borderRadius: 15 },
  userName: { fontFamily: 'Poppins_700Bold', fontSize: 22, color: '#1A1A1A' },
  userRole: { fontFamily: 'Poppins_400Regular', fontSize: 14, color: '#6B7280', textTransform: 'capitalize', marginTop: 4 },
  detailsSection: { backgroundColor: '#FFFFFF', borderRadius: 15, padding: 10, marginBottom: 20 },
  detailItem: { flexDirection: 'row', alignItems: 'center', padding: 15 },
  detailText: { fontFamily: 'Poppins_400Regular', fontSize: 16, color: '#1A1A1A', marginLeft: 15 },
  signOutButton: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', backgroundColor: '#FFFFFF', borderRadius: 15, paddingVertical: 15, borderWidth: 1, borderColor: '#FEE2E2' },
  signOutText: { fontFamily: 'Poppins_600SemiBold', color: '#EF4444', fontSize: 16, marginLeft: 10 },
});