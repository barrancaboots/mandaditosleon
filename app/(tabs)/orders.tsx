// Dentro del componente renderOrderCard en app/(tabs)/orders.tsx
// ... justo después del <View style={styles.orderBody}>
{item.status === 'pendiente' && (
  <TouchableOpacity
    style={styles.cancelButton}
    onPress={() => handleCancelOrder(item.id)}
  >
    <Text style={styles.cancelButtonText}>Cancelar Pedido</Text>
  </TouchableOpacity>
)}

// Y añade la función para manejar la cancelación dentro del componente OrdersScreen
const handleCancelOrder = async (orderId: number) => {
  Alert.alert(
    "Confirmar Cancelación",
    "¿Estás seguro de que quieres cancelar este pedido?",
    [
      { text: "No", style: "cancel" },
      {
        text: "Sí, Cancelar",
        style: "destructive",
        onPress: async () => {
          const { error } = await supabase
            .from('orders')
            .update({ status: 'cancelado' })
            .eq('id', orderId);

          if (error) {
            Alert.alert("Error", "No se pudo cancelar el pedido.");
          } else {
            fetchOrders(); // Actualiza la lista para reflejar el cambio
          }
        },
      },
    ]
  );
};

// Finalmente, añade estos estilos al StyleSheet
const styles = StyleSheet.create({
  // ... todos los demás estilos
  cancelButton: {
    marginTop: 15,
    paddingVertical: 10,
    borderRadius: 10,
    backgroundColor: '#FEE2E2',
    alignItems: 'center',
  },
  cancelButtonText: {
    color: '#EF4444',
    fontFamily: 'Poppins_600SemiBold',
  },
});