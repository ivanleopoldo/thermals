import { Tabs } from 'expo-router';
import FontAwesome5 from '@expo/vector-icons/FontAwesome5';
import Providers from '~/lib/providers';

export default function TabLayout() {
  return (
    <Providers>
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
            lazy: true,
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
    </Providers>
  );
}
