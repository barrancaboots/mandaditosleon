import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { User, Mail, Phone, LogOut } from 'lucide-react-native';
import { useAuth } from '@/contexts/AuthContext';
import { t } from '@/lib/i18n';

export default function ProfileScreen() {
  // Obtenemos también el objeto 'user' que contiene el email
  const { profile, user, signOut } = useAuth();

  const handleSignOut = () => {
    Alert.alert(
      t('signOut'),
      t('signOutConfirm'),
      [
        { text: t('cancel'), style: 'cancel' },
        { text: t('signOut'), style: 'destructive', onPress: signOut },
      ]
    );
  };

  const userRole = profile?.role === 'admin' 
    ? t('administrator') 
    : profile?.role === 'repartidor' 
    ? 'Repartidor' 
    : t('customer');

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Mi Perfil</Text>
      </View>

      <View style={styles.content}>
        <View style={styles.profileInfo}>
          <View style={styles.avatar}>
            <User size={40} color="#6B7280" />
          </View>
          <Text style={styles.userName}>{profile?.full_name || 'Usuario'}</Text>
          <Text style={styles.userRole}>{userRole}</Text>
        </View>

        <View style={styles.detailsSection}>
          <View style={styles.detailItem}>
            <Mail size={20} color="#6B7280" />
            {/* 👇 --- ¡AQUÍ ESTÁ LA CORRECCIÓN! --- 👇 */}
            <Text style={styles.detailText}>{user?.email}</Text>
          </View>
          <View style={styles.detailItem}>
            <Phone size={20} color="#6B7280" />
            <Text style={styles.detailText}>{profile?.phone_number || t('notProvided')}</Text>
          </View>
        </View>

        <TouchableOpacity style={styles.signOutButton} onPress={handleSignOut}>
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
  avatar: { width: 90, height: 90, borderRadius: 45, backgroundColor: '#FFFFFF', justifyContent: 'center', alignItems: 'center', marginBottom: 15, borderWidth: 1, borderColor: '#E5E7EB' },
  userName: { fontFamily: 'Poppins_700Bold', fontSize: 22, color: '#1A1A1A' },
  userRole: { fontFamily: 'Poppins_400Regular', fontSize: 14, color: '#6B7280', textTransform: 'capitalize', marginTop: 4 },
  detailsSection: { backgroundColor: '#FFFFFF', borderRadius: 15, padding: 10, marginBottom: 20 },
  detailItem: { flexDirection: 'row', alignItems: 'center', padding: 15 },
  detailText: { fontFamily: 'Poppins_400Regular', fontSize: 16, color: '#1A1A1A', marginLeft: 15 },
  signOutButton: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', backgroundColor: '#FFFFFF', borderRadius: 15, paddingVertical: 15, borderWidth: 1, borderColor: '#FEE2E2' },
  signOutText: { fontFamily: 'Poppins_600SemiBold', color: '#EF4444', fontSize: 16, marginLeft: 10 },
});