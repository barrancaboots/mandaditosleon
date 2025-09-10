import React from 'react';
import { Tabs } from 'expo-router';
import { StyleSheet, View } from 'react-native';
import { FontAwesome, MaterialIcons } from '@expo/vector-icons'; // Para los iconos

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false, // Ocultamos el encabezado de cada pestaña
        tabBarActiveTintColor: '#FFC107', // Color del ícono activo
        tabBarInactiveTintColor: '#888', // Color del ícono inactivo
        tabBarStyle: styles.tabBar, // Aplicamos estilos a la barra
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Inicio',
          tabBarIcon: ({ color }) => (
            <FontAwesome size={28} name="home" color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="orders" // Asumiendo que tendrás una pantalla de pedidos
        options={{
          title: 'Pedidos',
          tabBarIcon: ({ color }) => (
            <MaterialIcons size={28} name="list-alt" color={color} />
          ),
        }}
      />
       <Tabs.Screen
        name="profile" // Asumiendo que tendrás una pantalla de perfil
        options={{
          title: 'Perfil',
          tabBarIcon: ({ color }) => (
            <FontAwesome size={28} name="user" color={color} />
          ),
        }}
      />
    </Tabs>
  );
}

// ESTA ES LA PARTE QUE SOLUCIONA TU ERROR
const styles = StyleSheet.create({
  tabBar: {
    backgroundColor: 'white',
    borderTopWidth: 1,
    borderTopColor: '#E5E5E5',
    height: 60,
    paddingBottom: 5,
    paddingTop: 5,
  },
});

