import { useEffect } from 'react';
import '../global.css';

import { Stack } from 'expo-router';
import { BLEPrinter } from 'react-native-thermal-receipt-printer';

export const unstable_settings = {
  initialRouteName: '(tabs)',
};

export default function Layout() {
  useEffect(() => {
    BLEPrinter.init();
  }, []);
  return (
    <Stack
      screenOptions={{
        headerShown: false,
      }}>
      <Stack.Screen name="(tabs)" />
    </Stack>
  );
}
