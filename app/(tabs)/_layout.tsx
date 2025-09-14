import React from 'react';
import { Tabs } from 'expo-router';
import { StyleSheet } from 'react-native';
import { Home, ShoppingCart, ListOrdered, User, MapPin } from 'lucide-react-native'; // 👈 Importamos los nuevos iconos
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useCart } from '@/contexts/CartContext';

export default function TabLayout() {
  const { bottom } = useSafeAreaInsets();
  const { state: cartState } = useCart();
  const iconSize = 26; // 👈 Tamaño estandarizado

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: '#FFC107',
        tabBarInactiveTintColor: '#6B7280', // Un gris más suave
        tabBarStyle: {
          ...styles.tabBar,
          height: 60 + bottom,
          paddingBottom: bottom + 5,
        },
        tabBarLabelStyle: styles.tabBarLabel,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Inicio',
          tabBarIcon: ({ color }) => <Home size={iconSize} color={color} />,
        }}
      />
      <Tabs.Screen
        name="track"
        options={{
          title: 'Seguimiento',
          tabBarIcon: ({ color }) => <MapPin size={iconSize} color={color} />,
        }}
      />
      <Tabs.Screen
        name="cart"
        options={{
          title: 'Carrito',
          tabBarIcon: ({ color }) => <ShoppingCart size={iconSize} color={color} />,
          tabBarBadge: cartState.items.length > 0 ? cartState.items.length : undefined,
        }}
      />
      <Tabs.Screen
        name="orders"
        options={{
          title: 'Pedidos',
          tabBarIcon: ({ color }) => <ListOrdered size={iconSize} color={color} />,
        }}
      />
       <Tabs.Screen
        name="profile"
        options={{
          title: 'Perfil',
          tabBarIcon: ({ color }) => <User size={iconSize} color={color} />,
        }}
      />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    backgroundColor: 'white',
    borderTopWidth: 1,
    borderTopColor: '#F0F0F0',
    paddingTop: 5,
  },
  tabBarLabel: {
    fontFamily: 'Poppins_400Regular',
    fontSize: 10,
    marginTop: -5, // Reduce el espacio entre el icono y el texto
  }
});