// direccionbarrancaboots-max/mandaditosleon/mandaditosleon-2dfda77bcc712d52b150397d8f1b593b59e76696/app/(auth)/_layout.tsx

import { Stack } from 'expo-router';

export default function AuthLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="login" />
      <Stack.Screen name="register" />
    </Stack>
  );
}