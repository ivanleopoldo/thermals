import { Tabs } from 'expo-router';
import FontAwesome5 from '@expo/vector-icons/FontAwesome5';
import { BLEPrinterProvider } from '~/lib/providers/BLEPrinterProvider';

export default function TabLayout() {
  return (
    <BLEPrinterProvider>
      <Tabs screenOptions={{ tabBarShowLabel: false, tabBarIconStyle: { margin: 7 } }}>
        <Tabs.Screen
          name="index"
          options={{
            title: 'Home',
            tabBarIcon: ({ color }) => <FontAwesome5 name="home" size={24} color={color} />,
          }}
        />
        <Tabs.Screen
          name="connect"
          options={{
            title: 'Connect',
            tabBarIcon: ({ color }) => <FontAwesome5 name="bluetooth-b" size={24} color={color} />,
          }}
        />
        <Tabs.Screen
          name="settings"
          options={{
            title: 'Settings',
            tabBarIcon: ({ color }) => <FontAwesome5 name="cog" size={24} color={color} />,
          }}
        />
      </Tabs>
    </BLEPrinterProvider>
  );
}
